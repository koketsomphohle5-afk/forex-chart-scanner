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
    <div className="w-full max-w-2xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-400">
        🎯 Forex Chart Scanner
      </h1>
      <p className="text-center text-gray-300 mb-8 text-lg">
        AI-Powered Smart Money Concepts Analysis
      </p>

      {/* Configuration Panel */}
      <div className="bg-gray-800 p-6 rounded-lg mb-8 grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2">Currency Pair</label>
          <input
            type="text"
            value={pair}
            onChange={(e) => setPair(e.target.value.toUpperCase())}
            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:border-blue-500"
            placeholder="EURUSD"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2">Timeframe</label>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:border-blue-500"
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
        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2">Entry Type</label>
          <select
            value={analysisType}
            onChange={(e) => setAnalysisType(e.target.value as 'scalp' | 'swing')}
            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:border-blue-500"
          >
            <option value="scalp">Scalp (1-5 pips)</option>
            <option value="swing">Swing (20+ pips)</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-8 p-4 bg-red-900 border border-red-700 text-red-100 rounded-lg">
          <p className="font-semibold">❌ Error</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-4 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all ${
          isDragActive
            ? 'border-blue-400 bg-blue-900 bg-opacity-30'
            : 'border-gray-600 hover:border-blue-400'
        } ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <input {...getInputProps()} />
        {loading ? (
          <>
            <div className="animate-spin text-5xl mb-4">⏳</div>
            <p className="text-gray-200 font-semibold text-lg">Analyzing chart...</p>
            <p className="text-sm text-gray-400 mt-2">(This may take 30-60 seconds)</p>
          </>
        ) : isDragActive ? (
          <>
            <div className="text-5xl mb-4">📊</div>
            <p className="text-lg font-semibold text-blue-300">Drop chart here...</p>
          </>
        ) : (
          <>
            <div className="text-5xl mb-4">📤</div>
            <p className="text-lg font-semibold text-gray-200">
              Drag & drop your Forex chart here
            </p>
            <p className="text-sm text-gray-400 mt-2">or click to select a file</p>
            <p className="text-xs text-gray-500 mt-4">PNG, JPG up to 10MB</p>
          </>
        )}
      </div>
    </div>
  );
};
