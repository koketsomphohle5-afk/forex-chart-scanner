# 🎯 Forex Chart Scanner - AI Smart Money Concepts Analysis

A production-ready web application that analyzes Forex chart images using AI-powered Smart Money Concepts (SMC) price action analysis. Upload any Forex chart, and get instant trading setups with entry, stop loss, take profit, and confidence scores.

## 🌟 Features

✅ **Drag & Drop Chart Upload** - Intuitive interface for any Forex chart image
✅ **AI-Powered SMC Analysis** - Computer vision + Deep learning for pattern recognition
✅ **Smart Money Concepts Framework:**
   - Order blocks identification & validation
   - Liquidity sweeps & mitigations
   - Supply & demand zones
   - Fair value gaps (FVG) detection
   - Market structure breaks (MSB)
   - Premium/Discount zones

✅ **Automated Trading Setups:**
   - BUY/SELL signals based on SMC confluence
   - Entry levels with multiple confluence points
   - Stop loss placement (below/above key levels)
   - Take profit targets (TP1, TP2, TP3 cascaded)
   - Risk/Reward ratio calculation
   - Confidence scores (0-100%) with reasoning

✅ **Entry Type Selection:**
   - Scalp entries (tight stops, 1-5 pips target)
   - Swing entries (wider stops, 20-100+ pips target)

✅ **Detailed Analysis Report:**
   - SMC pattern identification with probability
   - Why buy/sell decision made
   - Price levels derived from chart
   - Confluence zones highlighted
   - Volume profile analysis
   - Volatility-adjusted stops

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for lightning-fast development
- **Tailwind CSS** for responsive design
- **Axios** for API calls
- **React Dropzone** for drag-and-drop
- **Zustand** for state management

### Backend
- **Node.js + Express** API server
- **Python FastAPI** for AI analysis
- **OpenCV** for image processing
- **NumPy/Pandas** for technical analysis
- **Claude AI API** for intelligent reasoning
- **SQLite** for persistent storage

### Deployment
- **Vercel/Netlify** - Frontend
- **Railway/Render** - Backend
- **AWS S3** - Image storage

## 📦 Installation

### Prerequisites
- Node.js 18+
- Python 3.10+
- pip, npm

### Quick Start

```bash
# Clone repository
git clone https://github.com/koketsomphohle5-afk/forex-chart-scanner.git
cd forex-chart-scanner

# Setup frontend
cd frontend
npm install
npm run dev

# Setup backend (in new terminal)
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

## 🔑 Environment Variables

Create `.env` files:

**Frontend** (`frontend/.env`)
```
VITE_API_URL=http://localhost:5000
```

**Backend** (`backend/.env`)
```
CLAUDE_API_KEY=your_claude_key_here
DATABASE_URL=sqlite:///./forex_scanner.db
CORS_ORIGINS=http://localhost:5173,https://yourdomain.com
MAX_FILE_SIZE=10485760
```

## 📡 API Endpoints

### POST `/api/analyze`
Upload and analyze a chart image
```json
Request:
{
  "image": "multipart file",
  "pair": "EURUSD",
  "timeframe": "4H",
  "analysisType": "scalp|swing"
}

Response:
{
  "pair": "EURUSD",
  "signal": "BUY|SELL",
  "entry": 1.0950,
  "stopLoss": 1.0920,
  "takeProfit": [1.0980, 1.1010, 1.1050],
  "riskReward": 1.5,
  "confidence": 87,
  "pattern": "Order Block + FVG Confluence",
  "reasoning": "Strong SMC confluence at demand zone...",
  "patterns": [
    {
      "type": "order_block",
      "level": 1.0945,
      "strength": "high",
      "confirmed": true
    }
  ]
}
```

### GET `/api/history`
Retrieve analysis history with pagination

### GET `/api/analysis/:id`
Get specific analysis with details

## 📁 Project Structure

```
forex-chart-scanner/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChartUpload.tsx
│   │   │   ├── AnalysisResult.tsx
│   │   │   └── History.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   └── Dashboard.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── store/
│   │   │   └── analysisStore.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── package.json
│   └── tsconfig.json
│
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   │   ├── analysis.py
│   │   │   └── __init__.py
│   │   ├── services/
│   │   │   ├── chart_analyzer.py
│   │   │   ├── smc_analyzer.py
│   │   │   ├── claude_service.py
│   │   │   └── __init__.py
│   │   ├── models/
│   │   │   ├── schemas.py
│   │   │   └── __init__.py
│   │   ├── main.py
│   │   └── config.py
│   ├── requirements.txt
│   ├── .env.example
│   └── Dockerfile
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

## 🚀 Usage

1. **Open App** - Navigate to `http://localhost:5173`
2. **Upload Chart** - Drag & drop or click to select Forex chart image
3. **Configure** - Pair, timeframe, and entry type (auto-filled)
4. **Analyze** - Wait for AI to process (30-60 seconds)
5. **Review** - See trading setup with confidence reasoning
6. **Export** - Download or copy analysis

## 🧠 Smart Money Concepts Analysis

The AI engine identifies:

**Order Blocks**
- Institutional buy/sell zones from previous candles
- Used for entry and invalidation levels
- Strength based on candle size and volume

**Fair Value Gaps (FVG)**
- Imbalances between candles
- Price must return to close gaps
- Premium (resistance) and discount (support) zones

**Liquidity Sweeps**
- False breaks above/below key levels
- Traps retail traders
- Creates momentum into direction

**Market Structure**
- Higher highs/higher lows (uptrend)
- Lower lows/lower highs (downtrend)
- Structure breaks = potential reversals

**Supply & Demand**
- Confluence zones with multiple SMC elements
- Highest probability setups

## 📊 Confidence Score Breakdown

```
Base Score: 50%
+ Order Block Identified (+15%)
+ FVG Alignment (+10%)
+ Liquidity Sweep Validated (+8%)
+ Volume Profile Strength (+7%)
+ Trend Alignment (+5%)
+ Price Action Confirmation (+5%)
+ Multiple Timeframe Confluence (+3%)
```

**Score Interpretation:**
- 80-100%: Highest probability setup (multiple SMC confluences)
- 60-79%: Good setup (2-3 SMC elements aligned)
- 40-59%: Moderate setup (1-2 SMC elements)
- <40%: Lower probability (wait for better confluence)

## 🔐 Security

✅ Input validation on all uploads
✅ Image size limits (max 10MB)
✅ File type verification
✅ Rate limiting on API endpoints
✅ CORS enabled for specific domains
✅ Environment variables for secrets
✅ Sanitized output to prevent injection

## 📈 Performance

- **Image Upload**: <5 seconds
- **AI Analysis**: 30-60 seconds
- **API Response**: <100ms
- **UI Render**: <2 seconds

## 🐛 Troubleshooting

**Image upload fails?**
- Check file size (<10MB)
- Use JPG/PNG format
- Ensure chart is clear and readable

**Analysis taking long?**
- Check Claude API rate limits
- Monitor backend logs
- Verify API key is valid

**Can't auto-detect pair?**
- Manually enter pair name
- Ensure chart label is visible

**Backend won't start?**
- Check Python version (3.10+)
- Verify all dependencies installed
- Check .env variables

## 🚢 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Push to Vercel
```

### Backend (Railway/Render)
```bash
cd backend
# Connect GitHub repo
# Set environment variables
# Deploy from main branch
```

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please fork and submit PRs.

## 📞 Support

For issues or feature requests, open a GitHub issue.
