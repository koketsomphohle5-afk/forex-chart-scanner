import anthropic
from typing import Dict, List
import json
from app.config import Config

class ClaudeService:
    """
    Uses Claude AI to analyze trading setups and generate recommendations
    """
    
    def __init__(self):
        self.client = anthropic.Anthropic(api_key=Config.CLAUDE_API_KEY)
    
    async def analyze_setup(self, pair: str, timeframe: str, price_levels: List, 
                           patterns: List, analysis_type: str) -> Dict:
        """
        Analyze chart data and generate trading setup using Claude
        """
        
        # Format patterns for Claude
        patterns_text = "\n".join([
            f"- {p['type']}: Level {p.get('level', 'N/A')}, Strength: {p.get('strength', 'unknown')}"
            for p in patterns
        ])
        
        # Create analysis prompt
        prompt = f"""You are an expert Forex trader specializing in Smart Money Concepts (SMC) price action analysis.

Analyze the following chart data and provide a trading setup:

Currency Pair: {pair}
Timeframe: {timeframe}
Analysis Type: {analysis_type} (scalp = tight stops 1-5 pips, swing = wider stops 20+ pips)

Detected SMC Patterns:
{patterns_text}

Price Levels (approximate from chart):
{str(price_levels[:5])}

Based on this analysis, provide a JSON response with exactly this structure (no markdown, pure JSON):
{{
    "signal": "BUY" or "SELL",
    "entry": <price level as float>,
    "stopLoss": <stop loss price as float>,
    "takeProfit": [<tp1>, <tp2>, <tp3>],
    "riskReward": <ratio as float>,
    "confidence": <0-100 score>,
    "pattern": "<main pattern identified>",
    "reasoning": "<detailed explanation of why you chose BUY/SELL>"
}}

IMPORTANT:
- Confidence should be 0-100 based on number of SMC confluences
- Entry should align with order blocks or FVG
- Stop loss should be below/above key SMC levels with 10-20 pip buffer for scalps, 50+ for swings
- Take profit should follow 1:2 or 1:3 risk reward ratios
- Reasoning should explain which SMC patterns led to the decision

Respond ONLY with the JSON object, no additional text.
"""
        
        try:
            response = self.client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=500,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            
            # Parse response
            response_text = response.content[0].text
            
            # Clean up response (remove markdown if present)
            response_text = response_text.replace("```json", "").replace("```", "").strip()
            
            analysis = json.loads(response_text)
            
            # Ensure confidence is within bounds
            analysis["confidence"] = max(0, min(100, analysis.get("confidence", 50)))
            
            # Add metadata
            analysis["pair"] = pair
            analysis["timeframe"] = timeframe
            analysis["patterns"] = patterns
            
            return analysis
            
        except json.JSONDecodeError as e:
            # Fallback response if Claude doesn't return valid JSON
            return {
                "signal": "NEUTRAL",
                "entry": 0,
                "stopLoss": 0,
                "takeProfit": [0, 0, 0],
                "riskReward": 1.0,
                "confidence": 30,
                "pattern": "Unable to determine",
                "reasoning": f"Error parsing response: {str(e)}",
                "pair": pair,
                "timeframe": timeframe,
                "patterns": patterns
            }
        except Exception as e:
            raise Exception(f"Claude API error: {str(e)}")
