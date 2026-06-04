import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { useAnalysisStore } from '../store/analysisStore';

export const ChartUpload: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [pair, setPair] = useState('EURUSD');
  const [timeframe, setTimeframe] = useState('4H');
  const [analysisType, setAnalysisType] = useState<'scalp' | 'swing'>('swing');
  const [error, setError] = useState<string | null>(null);
  const setAnalysis = useAnalysisStore((state) => state.setAnalysis);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setError(null);
    setLoading(true);
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('image', file);
    formData.append('pair', pair);
    formData.append('timeframe', timeframe);
    formData.append('analysisType', analysisType);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(
        `${apiUrl}/api/analyze`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setAnalysis(response.data);
    } catch (error: any) {
      console.error('Upload error:', error);
      setError(error.response?.data?.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [pair, timeframe, analysisType, setAnalysis]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg'] },
    disabled: loading,
  });

  return (
    <div className="w-full max-w-3xl mx-auto p-6 animate-fadeInUp">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <div className="text-6xl">📈</div>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          <span className="gradient-text">Forex Chart Scanner</span>
        </h1>
        <p className="text-xl text-slate-300 mb-2">
          AI-Powered Smart Money Concepts Analysis
        </p>
        <p className="text-sm text-slate-400">
          Upload any Forex chart and get instant trading setups
        </p>
      </div>

      {/* Configuration Panel */}
      <div className="glass p-8 rounded-2xl mb-8 border border-slate-700/30">
        <h2 className="text-xl font-bold text-slate-200 mb-6">⚙️ Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="animate-slideInLeft">
            <label className="block text-sm font-bold text-slate-300 mb-3">Currency Pair</label>
            <input
              type="text"
              value={pair}
              onChange={(e) => setPair(e.target.value.toUpperCase())}
              className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-smooth"
              placeholder="EURUSD"
            />
          </div>
          <div className="animate-slideInLeft" style={{animationDelay: '0.1s'}}>
            <label className="block text-sm font-bold text-slate-300 mb-3">Timeframe</label>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-smooth"
            >
              <option>M5</option>
              <option>M15</option>
              <option>M30</option>
              <option>1H</option>
              <option>4H</option>
              <option>D</option>
              <option>W</option>
            </select>
          </div>
          <div className="animate-slideInLeft" style={{animationDelay: '0.2s'}}>
            <label className="block text-sm font-bold text-slate-300 mb-3">Entry Type</label>
            <select
              value={analysisType}
              onChange={(e) => setAnalysisType(e.target.value as 'scalp' | 'swing')}
              className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-smooth"
            >
              <option value="scalp">Scalp (1-5 pips)</option>
              <option value="swing">Swing (20+ pips)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-8 p-4 rounded-lg bg-red-900/20 border border-red-700/30 animate-slideInRight">
          <p className="font-semibold text-red-300">⚠️ Error</p>
          <p className="text-sm text-red-200 mt-1">{error}</p>
        </div>
      )}

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-3 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? 'border-blue-400 bg-blue-900/20 glow'
            : 'border-slate-600 hover:border-blue-400 hover:bg-blue-900/10'
        } ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <input {...getInputProps()} />
        {loading ? (
          <>
            <div className="text-6xl mb-4 animate-spin-slow">⏳</div>
            <p className="text-slate-200 font-bold text-xl">Analyzing chart...</p>
            <p className="text-sm text-slate-400 mt-3">
              This may take 30-60 seconds for AI analysis
            </p>
          </>
        ) : isDragActive ? (
          <>
            <div className="text-6xl mb-4 animate-bounce">📊</div>
            <p className="text-2xl font-bold text-blue-300">Drop your chart here!</p>
          </>
        ) : (
          <>
            <div className="text-7xl mb-6">📤</div>
            <p className="text-2xl font-bold text-slate-100 mb-2">
              Upload Your Forex Chart
            </p>
            <p className="text-slate-400 mb-4">Drag and drop or click to select</p>
            <p className="text-xs text-slate-500">Supported: PNG, JPG • Maximum 10MB</p>
          </>
        )}
      </div>

      {/* Footer info */}
      <div className="mt-8 text-center text-slate-400 text-sm">
        <p>🔐 Your charts are analyzed securely • No data stored • 🚀 Instant results</p>
      </div>
    </div>
  );
};
