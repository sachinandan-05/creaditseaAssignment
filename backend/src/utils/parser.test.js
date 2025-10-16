const { parseExperianXML } = require('./parser');

const sampleXML = `<?xml version="1.0"?>
<ExperianReport>
  <PersonalDetails>
    <Name>Test User</Name>
    <Mobile>+919999999999</Mobile>
    <PAN>TESTPAN123</PAN>
  </PersonalDetails>
  <CreditScore>700</CreditScore>
  <Summary>
    <TotalAccounts>1</TotalAccounts>
    <ActiveAccounts>1</ActiveAccounts>
    <ClosedAccounts>0</ClosedAccounts>
    <CurrentBalance>5000</CurrentBalance>
    <SecuredAmount>0</SecuredAmount>
    <UnsecuredAmount>5000</UnsecuredAmount>
    <EnquiriesLast7Days>0</EnquiriesLast7Days>
  </Summary>
  <Accounts>
    <Account>
      <Type>Loan</Type>
      <Bank>Test Bank</Bank>
      <AccountNumber>123456</AccountNumber>
      <Address>Test Address</Address>
      <AmountOverdue>0</AmountOverdue>
      <CurrentBalance>5000</CurrentBalance>
    </Account>
  </Accounts>
</ExperianReport>`;

describe('parseExperianXML', () => {
  it('should parse basic details', async () => {
    const result = await parseExperianXML(Buffer.from(sampleXML));
    expect(result.basicDetails.name).toBe('Test User');
    expect(result.basicDetails.mobile).toBe('+919999999999');
    expect(result.basicDetails.pan).toBe('TESTPAN123');
    expect(result.basicDetails.creditScore).toBe(700);
  });

  it('should parse summary', async () => {
    const result = await parseExperianXML(Buffer.from(sampleXML));
    expect(result.reportSummary.totalAccounts).toBe(1);
    expect(result.reportSummary.currentBalance).toBe(5000);
  });

  it('should parse accounts', async () => {
    const result = await parseExperianXML(Buffer.from(sampleXML));
    expect(result.creditAccounts.length).toBe(1);
    expect(result.creditAccounts[0].type).toBe('Loan');
    expect(result.creditAccounts[0].bank).toBe('Test Bank');
  });
});
