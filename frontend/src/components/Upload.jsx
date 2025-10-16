import React, { useState } from 'react';
import axios from 'axios';
import { Upload, FileText, CheckCircle, AlertCircle, X, CloudUpload } from 'lucide-react';

export default function UploadComponent({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (selectedFile) => {
    if (selectedFile && selectedFile.name.endsWith('.xml')) {
      setFile(selectedFile);
      setMessage('');
    } else {
      setMessage('Please select a valid XML file');
      setFile(null);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return setMessage('Please select a file');
    
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    
    try {
      const res = await axios.post('/api/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      
      setMessage(`✓ Uploaded: ${res.data.message} (ID: ${res.data.id})`);
      setFile(null);
      
      // Notify parent component to refresh reports
      if (onUploadSuccess) {
        setTimeout(() => onUploadSuccess(), 500);
      }
    } catch (err) {
      setMessage(err?.response?.data?.error || err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setMessage('');
  };

  return (
    <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-lg border border-indigo-100 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
            <CloudUpload className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Upload Credit Report</h2>
            <p className="text-indigo-100 text-sm mt-1">Import Experian XML format reports</p>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="space-y-6">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-xl transition-all ${
              dragActive
                ? 'border-indigo-500 bg-indigo-50'
                : file
                ? 'border-green-300 bg-green-50'
                : 'border-gray-300 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50/50'
            }`}
          >
            <input
              type="file"
              accept=".xml"
              onChange={(e) => handleFileSelect(e.target.files[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              disabled={uploading}
            />
            
            <div className="p-12 text-center">
              {file ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <div className="p-4 bg-green-100 rounded-full">
                      <FileText className="w-12 h-12 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                  >
                    <X className="w-4 h-4" />
                    Remove File
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <div className="p-4 bg-indigo-100 rounded-full">
                      <Upload className="w-12 h-12 text-indigo-600" />
                    </div>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      Drop your XML file here
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      or <span className="text-indigo-600 font-medium">browse</span> to choose a file
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                    <FileText className="w-4 h-4" />
                    <span>Supports: .xml files only</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Secure upload with encryption</span>
            </div>
            <button
              onClick={submit}
              disabled={!file || uploading}
              className={`px-8 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg ${
                !file || uploading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 hover:shadow-xl transform hover:-translate-y-0.5'
              }`}
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CloudUpload className="w-5 h-5" />
                  <span>Upload Report</span>
                </>
              )}
            </button>
          </div>
        </div>

        {message && (
          <div
            className={`mt-6 p-4 rounded-xl border-l-4 flex items-start gap-3 ${
              message.includes('✓') || message.includes('Uploaded')
                ? 'bg-green-50 border-green-500 text-green-800'
                : 'bg-red-50 border-red-500 text-red-800'
            }`}
          >
            {message.includes('✓') || message.includes('Uploaded') ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="font-medium">{message}</p>
            </div>
            <button
              onClick={() => setMessage('')}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 text-sm">
              <p className="font-semibold text-blue-900 mb-1">Supported Format</p>
              <p className="text-blue-700">
                Upload Experian credit reports in XML format. The system will automatically parse and extract credit information, account details, and generate comprehensive reports.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}