const xml2js = require('xml2js');

function safeNumber(v) {
  if (v == null) return 0;
  const n = Number(String(v).replace(/[^0-9.-]+/g, ''));
  return Number.isFinite(n) ? n : 0;
}

function safeString(v) {
  return v ? String(v).trim() : '';
}

// Account type mapping
const ACCOUNT_TYPE_MAP = {
  '10': 'Credit Card',
  '51': 'Personal Loan',
  '52': 'Home Loan',
  '53': 'Auto Loan',
  '54': 'Education Loan',
  '55': 'Business Loan',
};

async function parseExperianXML(xmlBuffer) {
  const xml = xmlBuffer.toString();
  const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });
  const json = await parser.parseStringPromise(xml);

  // Handle INProfileResponse (Real Experian format)
  if (json.INProfileResponse) {
    return parseINProfileResponse(json.INProfileResponse);
  }

  // Handle generic/simplified format (backward compatibility)
  return parseGenericFormat(json);
}

function parseINProfileResponse(root) {
  // Extract basic details from Current_Application
  const currentApp = root.Current_Application?.Current_Application_Details || {};
  const applicant = currentApp.Current_Applicant_Details || {};
  
  const firstName = safeString(applicant.First_Name);
  const lastName = safeString(applicant.Last_Name);
  const name = `${firstName} ${lastName}`.trim() || 'Unknown';
  const mobile = safeString(applicant.MobilePhoneNumber || applicant.Telephone_Number_Applicant_1st);
  
  // Try to get PAN from applicant or from first account holder
  let pan = safeString(applicant.IncomeTaxPan);
  
  // Get credit score from SCORE section
  const score = root.SCORE || {};
  const creditScore = safeNumber(score.BureauScore);
  
  // Get summary from CAIS_Summary
  const cais = root.CAIS_Account || {};
  const caisSummary = cais.CAIS_Summary || {};
  const creditAccount = caisSummary.Credit_Account || {};
  const totalBalance = caisSummary.Total_Outstanding_Balance || {};
  
  const totalAccounts = safeNumber(creditAccount.CreditAccountTotal);
  const activeAccounts = safeNumber(creditAccount.CreditAccountActive);
  const closedAccounts = safeNumber(creditAccount.CreditAccountClosed);
  const currentBalance = safeNumber(totalBalance.Outstanding_Balance_All);
  const securedAmount = safeNumber(totalBalance.Outstanding_Balance_Secured);
  const unsecuredAmount = safeNumber(totalBalance.Outstanding_Balance_UnSecured);
  
  // Get recent enquiries from TotalCAPS_Summary
  const capsSummary = root.TotalCAPS_Summary || {};
  const recentEnquiries = safeNumber(capsSummary.TotalCAPSLast7Days);
  
  // Parse CAIS_Account_DETAILS (credit accounts)
  let accountsList = cais.CAIS_Account_DETAILS || [];
  if (!Array.isArray(accountsList)) {
    accountsList = accountsList ? [accountsList] : [];
  }
  
  const accounts = accountsList.map(acc => {
    // Get PAN from first account if not found in applicant details
    if (!pan && acc.CAIS_Holder_Details) {
      pan = safeString(acc.CAIS_Holder_Details.Income_TAX_PAN);
    }
    
    // Get address details
    const address = acc.CAIS_Holder_Address_Details || {};
    const addressParts = [
      address.First_Line_Of_Address_non_normalized,
      address.Second_Line_Of_Address_non_normalized,
      address.Third_Line_Of_Address_non_normalized,
      address.City_non_normalized,
    ].filter(Boolean);
    const fullAddress = addressParts.join(', ') || '';
    
    const accountType = safeString(acc.Account_Type);
    const typeName = ACCOUNT_TYPE_MAP[accountType] || `Account Type ${accountType}`;
    
    return {
      type: typeName,
      bank: safeString(acc.Subscriber_Name),
      accountNumber: safeString(acc.Account_Number),
      address: fullAddress,
      amountOverdue: safeNumber(acc.Amount_Past_Due),
      currentBalance: safeNumber(acc.Current_Balance),
      accountStatus: safeString(acc.Account_Status),
      openDate: safeString(acc.Open_Date),
      creditLimit: safeNumber(acc.Credit_Limit_Amount),
    };
  });
  
  return {
    basicDetails: { name, mobile, pan, creditScore },
    reportSummary: { totalAccounts, activeAccounts, closedAccounts, currentBalance, securedAmount, unsecuredAmount, recentEnquiries },
    creditAccounts: accounts,
    raw: root,
  };
}

function parseGenericFormat(json) {
  // Backward compatibility for simple formats
  const root = json?.ExperianReport || json || {};
  
  const personal = root.PersonalDetails || root.Subject || {};
  const name = personal.Name || personal.FullName || personal?.NameLine || '';
  const mobile = personal.Mobile || personal.Phone || '';
  const pan = personal.PAN || personal.PANNumber || personal?.Identification || '';
  
  const creditScore = safeNumber(root.CreditScore || root.Score || root?.Summary?.Score);
  
  const summary = root.Summary || {};
  const totalAccounts = safeNumber(summary.TotalAccounts || summary?.Accounts || 0);
  const activeAccounts = safeNumber(summary.ActiveAccounts || summary?.Active || 0);
  const closedAccounts = safeNumber(summary.ClosedAccounts || summary?.Closed || 0);
  const currentBalance = safeNumber(summary.CurrentBalance || summary?.Balance || 0);
  const securedAmount = safeNumber(summary.SecuredAmount || 0);
  const unsecuredAmount = safeNumber(summary.UnsecuredAmount || 0);
  const recentEnquiries = safeNumber(summary.EnquiriesLast7Days || summary?.RecentEnquiries || 0);
  
  const accountsNode = root.Accounts || root.CreditAccounts || {};
  let accounts = [];
  const list = accountsNode.Account || accountsNode.Accounts || accountsNode;
  if (Array.isArray(list)) {
    accounts = list.map(a => ({
      type: a.Type || a.Product || 'Unknown',
      bank: a.Bank || a.Institution || '',
      accountNumber: a.AccountNumber || a.AccountNo || '',
      address: a.Address || a.Branch || '',
      amountOverdue: safeNumber(a.AmountOverdue || a.Overdue || 0),
      currentBalance: safeNumber(a.CurrentBalance || a.Balance || 0),
    }));
  } else if (typeof list === 'object') {
    const a = list;
    accounts = [{
      type: a.Type || a.Product || 'Unknown',
      bank: a.Bank || a.Institution || '',
      accountNumber: a.AccountNumber || a.AccountNo || '',
      address: a.Address || a.Branch || '',
      amountOverdue: safeNumber(a.AmountOverdue || a.Overdue || 0),
      currentBalance: safeNumber(a.CurrentBalance || a.Balance || 0),
    }];
  }
  
  return {
    basicDetails: { name, mobile, pan, creditScore },
    reportSummary: { totalAccounts, activeAccounts, closedAccounts, currentBalance, securedAmount, unsecuredAmount, recentEnquiries },
    creditAccounts: accounts,
    raw: root,
  };
}

module.exports = { parseExperianXML };
