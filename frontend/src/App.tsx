import React from 'react';
import { ChartUpload } from './components/ChartUpload';
import { AnalysisResult } from './components/AnalysisResult';
import { useAnalysisStore } from './store/analysisStore';

function App() {
  const analysis = useAnalysisStore((state) => state.analysis);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black">
      <div className="min-h-screen py-8 px-4">
        <ChartUpload />
        {analysis && <AnalysisResult />}
      </div>
    </div>
  );
}

export default App;
