from typing import Dict, List
import numpy as np

class SMCAnalyzer:
    """
    Analyzes Smart Money Concepts patterns from price data
    """
    
    def __init__(self):
        self.min_ob_size = 50  # Minimum order block size
        self.fvg_threshold = 0.0001  # Gap threshold
    
    def detect_patterns(self, price_levels: List[Dict], timeframe: str) -> List[Dict]:
        """
        Detect SMC patterns from price levels
        """
        patterns = []
        
        # Detect Order Blocks
        order_blocks = self._detect_order_blocks(price_levels)
        patterns.extend(order_blocks)
        
        # Detect Fair Value Gaps
        fvgs = self._detect_fvg(price_levels)
        patterns.extend(fvgs)
        
        # Detect Liquidity Sweeps
        sweeps = self._detect_liquidity_sweeps(price_levels)
        patterns.extend(sweeps)
        
        # Detect Market Structure
        structure = self._detect_market_structure(price_levels)
        patterns.extend(structure)
        
        return patterns
    
    def _detect_order_blocks(self, price_levels: List[Dict]) -> List[Dict]:
        """
        Detect order blocks (institutional buy/sell zones)
        """
        obs = []
        
        if len(price_levels) < 3:
            return obs
        
        # Look for strong rejection candles
        for i in range(2, len(price_levels)):
            prev_high = price_levels[i-1].get("high", 0)
            curr_low = price_levels[i].get("low", 0)
            curr_high = price_levels[i].get("high", 0)
            
            # Strong bearish candle (sell OB)
            if curr_high > prev_high and price_levels[i].get("high", 0) > price_levels[i-1].get("high", 0):
                obs.append({
                    "type": "order_block",
                    "level": prev_high,
                    "strength": "high" if abs(curr_high - curr_low) > self.min_ob_size else "medium",
                    "confirmed": False
                })
        
        return obs
    
    def _detect_fvg(self, price_levels: List[Dict]) -> List[Dict]:
        """
        Detect Fair Value Gaps (FVG)
        """
        fvgs = []
        
        if len(price_levels) < 2:
            return fvgs
        
        # Look for gaps between consecutive candles
        for i in range(1, len(price_levels)):
            prev_high = price_levels[i-1].get("high", 0)
            curr_low = price_levels[i].get("low", 0)
            
            gap = abs(prev_high - curr_low)
            if gap > self.fvg_threshold:
                fvgs.append({
                    "type": "fvg",
                    "level": (prev_high + curr_low) / 2,
                    "strength": "high" if gap > self.fvg_threshold * 2 else "medium",
                    "confirmed": False
                })
        
        return fvgs
    
    def _detect_liquidity_sweeps(self, price_levels: List[Dict]) -> List[Dict]:
        """
        Detect liquidity sweeps (false breaks)
        """
        sweeps = []
        
        if len(price_levels) < 3:
            return sweeps
        
        # Simplified: look for new highs/lows followed by reversals
        for i in range(2, len(price_levels)):
            prev_high = max([p.get("high", 0) for p in price_levels[max(0, i-5):i]])
            curr_high = price_levels[i].get("high", 0)
            
            if curr_high > prev_high:
                sweeps.append({
                    "type": "liquidity_sweep",
                    "level": curr_high,
                    "strength": "medium",
                    "confirmed": False
                })
        
        return sweeps
    
    def _detect_market_structure(self, price_levels: List[Dict]) -> List[Dict]:
        """
        Detect market structure breaks
        """
        structure = []
        
        if len(price_levels) < 3:
            return structure
        
        # Detect higher highs/lows or breaks
        for i in range(2, len(price_levels)):
            prev_high = price_levels[i-1].get("high", 0)
            curr_high = price_levels[i].get("high", 0)
            
            if curr_high > prev_high:
                structure.append({
                    "type": "market_structure",
                    "level": curr_high,
                    "strength": "medium",
                    "confirmed": False
                })
        
        return structure
