const mongoose = require('mongoose');

const CreditAccountSchema = new mongoose.Schema({
  type: String,
  bank: String,
  accountNumber: String,
  address: String,
  amountOverdue: Number,
  currentBalance: Number,
});

const ReportSchema = new mongoose.Schema({
  basicDetails: {
    name: String,
    mobile: String,
    pan: String,
    creditScore: Number,
  },
  reportSummary: {
    totalAccounts: Number,
    activeAccounts: Number,
    closedAccounts: Number,
    currentBalance: Number,
    securedAmount: Number,
    unsecuredAmount: Number,
    recentEnquiries: Number,
  },
  creditAccounts: [CreditAccountSchema],
  raw: Object,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Report', ReportSchema);
