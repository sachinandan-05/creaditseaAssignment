import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FileText, TrendingUp, AlertCircle, CheckCircle, User, Phone, CreditCard, DollarSign, Calendar, Building2, ChevronRight, Search, Filter } from 'lucide-react';

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [selected, setSelected] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchList(); }, []);

  async function fetchList() {
    try {
      const res = await axios.get('/api/reports');
      setReports(res.data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  }

  async function showDetail(id) {
    try {
      const res = await axios.get('/api/reports/' + id);
      setSelected(res.data);
    } catch (error) {
      console.error('Error fetching report details:', error);
    }
  }

  const filteredReports = reports.filter(r => 
    r.basicDetails?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.basicDetails?.pan?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getScoreColor = (score) => {
    if (score >= 750) return 'text-green-600';
    if (score >= 650) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 750) return 'bg-green-50 border-green-200';
    if (score >= 650) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-600 rounded-lg shadow-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Credit Reports</h2>
        </div>
        <p className="text-gray-600 ml-14">Comprehensive credit analysis and account management</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Reports List Sidebar */}
          <div className="xl:col-span-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Search Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-white">All Reports</h2>
                  <span className="px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-white">
                    {filteredReports.length}
                  </span>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-indigo-300" />
                  <input
                    type="text"
                    placeholder="Search by name or PAN..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                </div>
              </div>

              {/* Reports List */}
              <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="text-gray-500 text-sm mt-3">Loading reports...</p>
                  </div>
                ) : filteredReports.length === 0 ? (
                  <div className="p-8 text-center">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">
                      {searchTerm ? 'No matching reports found' : 'No reports yet. Upload an XML file to get started.'}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {filteredReports.map(r => (
                      <button
                        key={r._id}
                        onClick={() => showDetail(r._id)}
                        className={`w-full text-left p-4 transition-all hover:bg-gray-50 ${
                          selected?._id === r._id ? 'bg-indigo-50 border-l-4 border-indigo-600' : 'border-l-4 border-transparent'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                              <User className="w-4 h-4 text-indigo-600" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{r.basicDetails?.name || 'Unknown'}</div>
                              <div className="text-xs text-gray-500 mt-0.5">PAN: {r.basicDetails?.pan || 'N/A'}</div>
                            </div>
                          </div>
                          <ChevronRight className={`w-5 h-5 transition-transform ${selected?._id === r._id ? 'text-indigo-600 transform rotate-90' : 'text-gray-400'}`} />
                        </div>
                        <div className="flex items-center justify-between mt-3 pl-10">
                          <div className="flex items-center gap-1.5">
                            <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                            <span className="text-sm font-semibold text-gray-700">{r.basicDetails?.creditScore || 'N/A'}</span>
                          </div>
                          <div className="text-xs text-gray-400">
                            <Calendar className="w-3 h-3 inline mr-1" />
                            {new Date(r.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Report Details */}
          <div className="xl:col-span-8">
            {selected ? (
              <div className="space-y-6">
                {/* Basic Details Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Personal Information
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="w-4 h-4 text-blue-600" />
                          <div className="text-xs font-medium text-blue-600 uppercase tracking-wide">Full Name</div>
                        </div>
                        <div className="text-xl font-bold text-gray-900">{selected.basicDetails?.name}</div>
                      </div>
                      
                      <div className={`p-5 rounded-xl border-2 ${getScoreBg(selected.basicDetails?.creditScore)}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className={`w-4 h-4 ${getScoreColor(selected.basicDetails?.creditScore)}`} />
                          <div className={`text-xs font-medium uppercase tracking-wide ${getScoreColor(selected.basicDetails?.creditScore)}`}>Credit Score</div>
                        </div>
                        <div className={`text-3xl font-bold ${getScoreColor(selected.basicDetails?.creditScore)}`}>
                          {selected.basicDetails?.creditScore}
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl border border-purple-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Phone className="w-4 h-4 text-purple-600" />
                          <div className="text-xs font-medium text-purple-600 uppercase tracking-wide">Mobile</div>
                        </div>
                        <div className="text-xl font-bold text-gray-900">{selected.basicDetails?.mobile}</div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-xl border border-orange-200">
                        <div className="flex items-center gap-2 mb-2">
                          <CreditCard className="w-4 h-4 text-orange-600" />
                          <div className="text-xs font-medium text-orange-600 uppercase tracking-wide">PAN Number</div>
                        </div>
                        <div className="text-xl font-bold text-gray-900">{selected.basicDetails?.pan}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Summary Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Account Summary
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-xl border border-indigo-200 text-center">
                        <div className="text-3xl font-bold text-indigo-700 mb-1">{selected.reportSummary?.totalAccounts}</div>
                        <div className="text-xs font-medium text-indigo-600 uppercase tracking-wide">Total Accounts</div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200 text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <div className="text-3xl font-bold text-green-700">{selected.reportSummary?.activeAccounts}</div>
                        </div>
                        <div className="text-xs font-medium text-green-600 uppercase tracking-wide">Active</div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 text-center">
                        <div className="text-3xl font-bold text-gray-700 mb-1">{selected.reportSummary?.closedAccounts}</div>
                        <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">Closed</div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 text-center col-span-2 md:col-span-1">
                        <div className="text-2xl font-bold text-blue-700 mb-1">₹{selected.reportSummary?.currentBalance?.toLocaleString()}</div>
                        <div className="text-xs font-medium text-blue-600 uppercase tracking-wide">Total Balance</div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 rounded-xl border border-teal-200 text-center">
                        <div className="text-2xl font-bold text-teal-700 mb-1">₹{selected.reportSummary?.securedAmount?.toLocaleString()}</div>
                        <div className="text-xs font-medium text-teal-600 uppercase tracking-wide">Secured</div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200 text-center">
                        <div className="text-2xl font-bold text-amber-700 mb-1">₹{selected.reportSummary?.unsecuredAmount?.toLocaleString()}</div>
                        <div className="text-xs font-medium text-amber-600 uppercase tracking-wide">Unsecured</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Credit Accounts Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      Credit Accounts
                    </h2>
                  </div>
                  <div className="p-6">
                    {selected.creditAccounts?.length > 0 ? (
                      <div className="space-y-4">
                        {selected.creditAccounts.map((a, i) => (
                          <div key={i} className="bg-gradient-to-r from-gray-50 to-white p-5 rounded-xl border-l-4 border-indigo-500 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-start gap-3">
                                <div className="p-2 bg-indigo-100 rounded-lg">
                                  <CreditCard className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                  <div className="font-bold text-gray-900 text-lg">{a.type}</div>
                                  <div className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                                    <Building2 className="w-3.5 h-3.5" />
                                    {a.bank}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1 font-mono">{a.accountNumber}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {a.amountOverdue > 0 ? (
                                  <span className="px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-xs font-semibold flex items-center gap-1">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    Overdue
                                  </span>
                                ) : (
                                  <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    Current
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
                              <div className="bg-blue-50 p-3 rounded-lg">
                                <div className="text-xs text-blue-600 font-medium mb-1 uppercase tracking-wide">Current Balance</div>
                                <div className="text-xl font-bold text-blue-700">₹{a.currentBalance?.toLocaleString()}</div>
                              </div>
                              {a.amountOverdue > 0 && (
                                <div className="bg-red-50 p-3 rounded-lg">
                                  <div className="text-xs text-red-600 font-medium mb-1 uppercase tracking-wide">Amount Overdue</div>
                                  <div className="text-xl font-bold text-red-700">₹{a.amountOverdue?.toLocaleString()}</div>
                                </div>
                              )}
                            </div>
                            
                            {a.address && (
                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="flex items-start gap-2 text-sm text-gray-600">
                                  <div className="text-base">📍</div>
                                  <div className="flex-1">{a.address}</div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No credit accounts found</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Report</h3>
                <p className="text-gray-500">Choose a credit report from the list to view detailed information</p>
              </div>
            )}
          </div>
        </div>
      </div>
  );
}