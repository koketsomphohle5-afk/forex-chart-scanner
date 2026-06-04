import React from 'react';
import { useAnalysisStore } from '../store/analysisStore';

export const AnalysisResult: React.FC = () => {
  const analysis = useAnalysisStore((state) => state.analysis);
  const clearAnalysis = useAnalysisStore((state) => state.clearAnalysis);

  if (!analysis) return null;

  const isLong = analysis.signal === 'BUY';
  const signalColor = isLong ? 'text-green-400' : 'text-red-400';
  const bgColor = isLong ? 'bg-green-900 bg-opacity-20' : 'bg-red-900 bg-opacity-20';
  const borderColor = isLong ? 'border-green-700' : 'border-red-700';

  const downloadReport = () => {
    const report = `
FOREX CHART ANALYSIS REPORT
============================
Pair: ${analysis.pair}
Timeframe: ${analysis.timeframe}
Signal: ${analysis.signal}
Entry: ${analysis.entry.toFixed(5)}
Stop Loss: ${analysis.stopLoss.toFixed(5)}
Take Profit: ${analysis.takeProfit.map(tp => tp.toFixed(5)).join(', ')}
Risk/Reward: ${analysis.riskReward.toFixed(2)}:1
Confidence: ${analysis.confidence}%
Pattern: ${analysis.pattern}

REASONING:
${analysis.reasoning}

SMC PATTERNS DETECTED:
${analysis.patterns.map((p, i) => `${i + 1}. ${p.type.replace('_', ' ').toUpperCase()}
   Level: ${p.level.toFixed(5)}
   Strength: ${p.strength}
   Confirmed: ${p.confirmed ? 'Yes' : 'No'}`).join('\n\n')}
    `;
    
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(report));
    element.setAttribute('download', `${analysis.pair}_${new Date().toISOString().split('T')[0]}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const copyToClipboard = () => {
    const text = `${analysis.signal} ${analysis.pair}
Entry: ${analysis.entry.toFixed(5)}
SL: ${analysis.stopLoss.toFixed(5)}
TP: ${analysis.takeProfit.map(tp => tp.toFixed(5)).join(', ')}
Confidence: ${analysis.confidence}%
RR: ${analysis.riskReward.toFixed(2)}:1`;
    navigator.clipboard.writeText(text);
    alert('Setup copied to clipboard!');
  };

  return (
    <div className={`w-full max-w-4xl mx-auto mt-8 p-8 rounded-xl shadow-2xl border-2 ${bgColor} ${borderColor}`}>
      {/* Header */}
      <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b-2 border-gray-700">
        <div>
          <h2 className="text-2xl font-bold text-gray-200 mb-2">
            {analysis.pair} - {analysis.timeframe}
          </h2>
          <div className={`text-6xl font-bold ${signalColor}`}>
            {analysis.signal}
          </div>
          <p className="text-gray-400 mt-2 text-lg font-semibold">{analysis.pattern}</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold text-gray-300 mb-4">Confidence Score</div>
          <div className={`text-6xl font-bold ${signalColor}`}>
            {analysis.confidence}%
          </div>
          <p className="text-sm text-gray-400 mt-2">Risk/Reward: {analysis.riskReward.toFixed(2)}:1</p>
        </div>
      </div>

      {/* Price Levels */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 p-4 rounded-lg shadow border border-gray-700">
          <p className="text-xs font-bold text-gray-400 uppercase mb-2">Entry</p>
          <p className={`text-2xl font-bold ${signalColor}`}>
            {analysis.entry.toFixed(5)}
          </p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow border border-gray-700">
          <p className="text-xs font-bold text-gray-400 uppercase mb-2">Stop Loss</p>
          <p className="text-2xl font-bold text-orange-400">
            {analysis.stopLoss.toFixed(5)}
          </p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow border border-gray-700 col-span-2">
          <p className="text-xs font-bold text-gray-400 uppercase mb-2">Take Profit Targets</p>
          <div className="flex gap-2">
            {analysis.takeProfit.map((tp, i) => (
              <div key={i} className="flex-1">
                <p className="text-xs text-gray-500">TP{i + 1}</p>
                <p className="text-lg font-bold text-blue-400">
                  {tp.toFixed(5)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reasoning */}
      <div className="bg-gray-800 p-6 rounded-lg mb-8 shadow border border-gray-700">
        <h3 className="text-lg font-bold text-gray-200 mb-4">📊 Analysis Reasoning</h3>
        <p className="text-gray-300 leading-relaxed text-sm">{analysis.reasoning}</p>
      </div>

      {/* SMC Patterns */}
      <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700 mb-8">
        <h3 className="text-lg font-bold text-gray-200 mb-4">🎯 Smart Money Concepts Detected</h3>
        <div className="space-y-3">
          {analysis.patterns.map((pattern, idx) => (
            <div key={idx} className="flex items-start gap-4 p-3 bg-gray-700 rounded border border-gray-600">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-200 capitalize">
                  {pattern.type.replace('_', ' ')}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Level: <span className="font-mono font-bold text-gray-300">{pattern.level.toFixed(5)}</span>
                </p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    pattern.strength === 'high' ? 'bg-green-900 text-green-300' :
                    pattern.strength === 'medium' ? 'bg-yellow-900 text-yellow-300' :
                    'bg-gray-600 text-gray-300'
                  }`}>
                    Strength: {pattern.strength}
                  </span>
                  {pattern.confirmed && (
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-900 text-blue-300 font-semibold">
                      ✓ Confirmed
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 flex-wrap">
        <button
          onClick={downloadReport}
          className="flex-1 min-w-[200px] bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition"
        >
          📥 Download Report
        </button>
        <button
          onClick={copyToClipboard}
          className="flex-1 min-w-[200px] bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition"
        >
          📋 Copy Setup
        </button>
        <button
          onClick={clearAnalysis}
          className="flex-1 min-w-[200px] bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition"
        >
          ↻ New Analysis
        </button>
      </div>
    </div>
  );
};
