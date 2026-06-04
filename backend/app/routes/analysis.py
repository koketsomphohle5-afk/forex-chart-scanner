from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.services.chart_analyzer import ChartAnalyzer
from app.services.smc_analyzer import SMCAnalyzer
from app.services.claude_service import ClaudeService
import tempfile
import os

router = APIRouter()

chart_analyzer = ChartAnalyzer()
smc_analyzer = SMCAnalyzer()
claude_service = ClaudeService()

@router.post("/analyze")
async def analyze_chart(
    image: UploadFile = File(...),
    pair: str = Form(...),
    timeframe: str = Form(...),
    analysisType: str = Form("swing")
):
    """
    Analyze a Forex chart image and return SMC-based trading setup
    """
    try:
        # Validate file
        if not image.filename:
            raise HTTPException(status_code=400, detail="No file provided")
        
        if not image.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Save temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp_file:
            content = await image.read()
            tmp_file.write(content)
            tmp_path = tmp_file.name
        
        # Analyze chart
        chart_data = chart_analyzer.analyze(tmp_path)
        
        # Extract price levels
        price_levels = chart_analyzer.extract_price_levels(chart_data)
        
        # Analyze SMC patterns
        smc_patterns = smc_analyzer.detect_patterns(
            price_levels=price_levels,
            timeframe=timeframe
        )
        
        # Get Claude analysis
        analysis = await claude_service.analyze_setup(
            pair=pair,
            timeframe=timeframe,
            price_levels=price_levels,
            patterns=smc_patterns,
            analysis_type=analysisType
        )
        
        # Cleanup
        os.unlink(tmp_path)
        
        return analysis
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history")
async def get_history(skip: int = 0, limit: int = 10):
    """
    Get analysis history
    """
    # TODO: Implement database queries
    return {"analyses": [], "total": 0}

@router.get("/analysis/{analysis_id}")
async def get_analysis(analysis_id: str):
    """
    Get specific analysis
    """
    # TODO: Implement database query
    return {"message": "Analysis not found"}
