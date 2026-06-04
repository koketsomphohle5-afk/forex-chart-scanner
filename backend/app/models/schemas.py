from pydantic import BaseModel
from typing import List, Optional

class SMCPattern(BaseModel):
    type: str  # order_block, fvg, liquidity_sweep, market_structure, supply_demand
    level: float
    strength: str  # low, medium, high
    confirmed: bool

class AnalysisResponse(BaseModel):
    pair: str
    timeframe: str
    signal: str  # BUY, SELL
    entry: float
    stopLoss: float
    takeProfit: List[float]
    riskReward: float
    confidence: int  # 0-100
    pattern: str
    reasoning: str
    patterns: List[SMCPattern]
