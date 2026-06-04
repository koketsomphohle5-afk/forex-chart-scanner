import React from 'react';
import { useAnalysisStore } from '../store/analysisStore';

export const AnalysisResult: React.FC = () => {
  const analysis = useAnalysisStore((state) => state.analysis);
  const clearAnalysis = useAnalysisStore((state) => state.clearAnalysis);

  if (!analysis) return null;

  const isLong = analysis.signal === 'BUY';
  const signalColor = isLong ? 'text-green-400' : 'text-red-400';
  const signalBg = isLong ? 'from-green-900/30 to-emerald-900/20' : 'from-red-900/30 to-rose-900/20';
  const borderColor = isLong ? 'border-green-700/30' : 'border-red-700/30';
  const accentColor = isLong ? 'text-emerald-400' : 'text-rose-400';

  const downloadReport = () => {
    const report = `
╔════════════════════════════════════════════════════════════╗
║          FOREX CHART ANALYSIS REPORT                      ║
╚════════════════════════════════════════════════════════════╝

📊 CHART INFORMATION
   Pair: ${analysis.pair}
   Timeframe: ${analysis.timeframe}

🎯 TRADING SETUP
   Signal: ${analysis.signal}
   Entry: ${analysis.entry.toFixed(5)}
   Stop Loss: ${analysis.stopLoss.toFixed(5)}
   Risk/Reward: ${analysis.riskReward.toFixed(2)}:1
   Confidence: ${analysis.confidence}%

💎 TAKE PROFIT TARGETS
   TP1: ${analysis.takeProfit[0].toFixed(5)}
   TP2: ${analysis.takeProfit[1].toFixed(5)}
   TP3: ${analysis.takeProfit[2].toFixed(5)}

🎨 PATTERN IDENTIFIED
   ${analysis.pattern}

📝 ANALYSIS REASONING
${analysis.reasoning}

🧠 SMART MONEY CONCEPTS DETECTED
${analysis.patterns.map((p, i) => `${i + 1}. ${p.type.replace('_', ' ').toUpperCase()}
   Level: ${p.level.toFixed(5)}
   Strength: ${p.strength}
   Confirmed: ${p.confirmed ? 'Yes' : 'No'}`).join('\n\n')}

════════════════════════════════════════════════════════════
Generated: ${new Date().toLocaleString()}
════════════════════════════════════════════════════════════
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
───────────────────
Entry: ${analysis.entry.toFixed(5)}
SL: ${analysis.stopLoss.toFixed(5)}
TP1: ${analysis.takeProfit[0].toFixed(5)}
TP2: ${analysis.takeProfit[1].toFixed(5)}
TP3: ${analysis.takeProfit[2].toFixed(5)}
───────────────────
RR: ${analysis.riskReward.toFixed(2)}:1
Confidence: ${analysis.confidence}%`;
    navigator.clipboard.writeText(text);
    alert('✅ Setup copied to clipboard!');
  };

  return (
    <div className={`w-full max-w-5xl mx-auto mt-12 p-8 rounded-3xl glass border-2 ${borderColor} animate-fadeInUp shadow-2xl bg-gradient-to-br ${signalBg}`}>
      {/* Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 pb-8 border-b border-slate-700/30">
        <div className="animate-slideInLeft">
          <p className="text-slate-400 text-sm uppercase tracking-widest mb-2">Signal</p>
          <h2 className="text-3xl font-bold text-slate-100 mb-3">
            {analysis.pair} <span className="text-slate-500 text-2xl">• {analysis.timeframe}</span>
          </h2>
          <div className={`text-7xl font-bold ${signalColor} mb-4 animate-pulse`}>
            {analysis.signal}
          </div>
          <p className="text-slate-300 text-lg font-semibold">{analysis.pattern}</p>
        </div>
        <div className="animate-slideInRight flex flex-col justify-center">
          <p className="text-slate-400 text-sm uppercase tracking-widest mb-2">Confidence Score</p>
          <div className="relative mb-6">
            <div className="text-7xl font-bold text-center">
              <span className={`${signalColor} animate-pulse`}>{analysis.confidence}</span>
              <span className="text-4xl text-slate-400">%</span>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 text-center border border-slate-700/30">
            <p className="text-slate-400 text-xs uppercase mb-2">Risk/Reward Ratio</p>
            <p className="text-3xl font-bold text-blue-400">{analysis.riskReward.toFixed(2)}:1</p>
          </div>
        </div>
      </div>

      {/* Price Levels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        {/* Entry */}
        <div className="card-hover card p-6 text-center border border-slate-700/30 animate-slideInLeft">
          <p className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-widest">Entry Price</p>
          <p className={`text-4xl font-bold ${signalColor} font-mono`}>
            {analysis.entry.toFixed(5)}
          </p>
          <div className="mt-3 h-1 bg-gradient-to-r from-slate-700 to-slate-600 rounded"></div>
        </div>

        {/* Stop Loss */}
        <div className="card-hover card p-6 text-center border border-red-700/20 animate-slideInLeft" style={{animationDelay: '0.1s'}}>
          <p className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-widest">Stop Loss</p>
          <p className="text-4xl font-bold text-orange-400 font-mono">
            {analysis.stopLoss.toFixed(5)}
          </p>
          <div className="mt-3 h-1 bg-gradient-to-r from-orange-700 to-red-600 rounded"></div>
        </div>

        {/* TP1 & TP2 */}
        <div className="card-hover card p-6 text-center border border-blue-700/20 animate-slideInLeft" style={{animationDelay: '0.2s'}}>
          <p className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-widest">Take Profit 1</p>
          <p className="text-3xl font-bold text-blue-400 font-mono mb-2">
            {analysis.takeProfit[0].toFixed(5)}
          </p>
          <p className="text-xs text-slate-500">First target</p>
        </div>

        {/* TP3 */}
        <div className="card-hover card p-6 text-center border border-emerald-700/20 animate-slideInLeft" style={{animationDelay: '0.3s'}}>
          <p className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-widest">Take Profit 3</p>
          <p className="text-3xl font-bold text-emerald-400 font-mono mb-2">
            {analysis.takeProfit[2].toFixed(5)}
          </p>
          <p className="text-xs text-slate-500">Full target</p>
        </div>
      </div>

      {/* All TP Targets */}
      <div className="bg-slate-800/30 border border-slate-700/30 rounded-2xl p-6 mb-10">
        <h3 className="text-lg font-bold text-slate-200 mb-4">🎯 All Take Profit Targets</h3>
        <div className="grid grid-cols-3 gap-4">
          {analysis.takeProfit.map((tp, i) => (
            <div key={i} className="text-center p-4 bg-slate-700/20 rounded-lg border border-slate-600/30">
              <p className="text-sm text-slate-400 mb-2">TP{i + 1}</p>
              <p className="text-2xl font-bold text-blue-400 font-mono">{tp.toFixed(5)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Reasoning */}
      <div className="glass p-8 rounded-2xl mb-10 border border-slate-700/30 animate-slideInLeft">
        <h3 className="text-2xl font-bold text-slate-100 mb-4">💭 Analysis Reasoning</h3>
        <p className="text-slate-300 leading-relaxed text-base">{analysis.reasoning}</p>
      </div>

      {/* SMC Patterns */}
      <div className="glass p-8 rounded-2xl shadow-lg border border-slate-700/30 mb-10 animate-slideInRight">
        <h3 className="text-2xl font-bold text-slate-100 mb-6">🧠 Smart Money Concepts Detected</h3>
        <div className="space-y-4">
          {analysis.patterns.map((pattern, idx) => (
            <div key={idx} className="flex items-start gap-4 p-5 bg-slate-700/20 rounded-xl border border-slate-600/30 hover:border-blue-500/30 transition-smooth">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-100 capitalize text-lg">
                  {pattern.type.replace('_', ' ')}
                </p>
                <p className="text-sm text-slate-400 mt-2">
                  Level: <span className="font-mono font-bold text-slate-200">{pattern.level.toFixed(5)}</span>
                </p>
                <div className="flex gap-3 mt-3 flex-wrap">
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                    pattern.strength === 'high' ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/30' :
                    pattern.strength === 'medium' ? 'bg-yellow-900/40 text-yellow-300 border border-yellow-700/30' :
                    'bg-slate-700/40 text-slate-300 border border-slate-600/30'
                  }`}>
                    💪 Strength: {pattern.strength.toUpperCase()}
                  </span>
                  {pattern.confirmed && (
                    <span className="text-xs px-3 py-1 rounded-full bg-blue-900/40 text-blue-300 font-semibold border border-blue-700/30">
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
      <div className="flex gap-4 flex-wrap justify-center">
        <button
          onClick={downloadReport}
          className="btn-primary flex-1 min-w-[200px] text-white font-bold py-4 px-6 rounded-xl text-lg transition-smooth hover:scale-105"
        >
          📥 Download Report
        </button>
        <button
          onClick={copyToClipboard}
          className="btn-success flex-1 min-w-[200px] text-white font-bold py-4 px-6 rounded-xl text-lg transition-smooth hover:scale-105"
        >
          📋 Copy Setup
        </button>
        <button
          onClick={clearAnalysis}
          className="flex-1 min-w-[200px] bg-gradient-to-br from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white font-bold py-4 px-6 rounded-xl text-lg transition-smooth hover:scale-105 border border-slate-600/30"
        >
          ↻ New Analysis
        </button>
      </div>
    </div>
  );
};
