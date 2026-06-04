import cv2
import numpy as np
from typing import Dict, List, Tuple

class ChartAnalyzer:
    """
    Analyzes Forex chart images to extract price data and patterns
    """
    
    def __init__(self):
        self.min_candle_width = 5
        self.min_candle_height = 10
    
    def analyze(self, image_path: str) -> Dict:
        """
        Analyze chart image and extract candle data
        """
        # Read image
        img = cv2.imread(image_path)
        if img is None:
            raise ValueError(f"Could not read image: {image_path}")
        
        # Convert to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Detect candles
        candles = self._detect_candles(gray)
        
        # Extract high/low/open/close
        ohlc_data = self._extract_ohlc(candles, img.shape)
        
        return {
            "image_shape": img.shape,
            "candles": candles,
            "ohlc_data": ohlc_data
        }
    
    def _detect_candles(self, gray_img: np.ndarray) -> List[Dict]:
        """
        Detect candlesticks in the image
        """
        # Apply edge detection
        edges = cv2.Canny(gray_img, 100, 200)
        
        # Find contours
        contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        candles = []
        for contour in contours:
            x, y, w, h = cv2.boundingRect(contour)
            if w >= self.min_candle_width and h >= self.min_candle_height:
                candles.append({"x": x, "y": y, "width": w, "height": h})
        
        return sorted(candles, key=lambda c: c["x"])
    
    def extract_price_levels(self, chart_data: Dict) -> Dict:
        """
        Extract price levels from detected candles
        """
        candles = chart_data.get("candles", [])
        img_height = chart_data["image_shape"][0]
        
        # Simplified: assume pixel height maps linearly to price
        # In production, would need to detect axis labels
        
        price_data = []
        for candle in candles:
            high = img_height - candle["y"]
            low = img_height - (candle["y"] + candle["height"])
            
            price_data.append({
                "high": high,
                "low": low,
                "x": candle["x"]
            })
        
        return price_data
