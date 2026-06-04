import React from 'react';
import { ChartUpload } from './components/ChartUpload';
import { AnalysisResult } from './components/AnalysisResult';
import { useAnalysisStore } from './store/analysisStore';

function App() {
  const analysis = useAnalysisStore((state) => state.analysis);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen py-8 px-4">
        <ChartUpload />
        {analysis && <AnalysisResult />}
      </div>
    </div>
  );
}

export default App;
