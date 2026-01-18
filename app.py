from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import logging
from logic.scorer import analyze_content

# ============================================================
# LOGGING CONFIGURATION - Best Practices
# ============================================================
# Format: timestamp | level | module | message
LOG_FORMAT = "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s"
LOG_DATE_FORMAT = "%Y-%m-%d %H:%M:%S"

# Configure root logger (affects all modules)
logging.basicConfig(
    level=logging.DEBUG,       # Set to INFO in production
    format=LOG_FORMAT,
    datefmt=LOG_DATE_FORMAT,
    handlers=[
        logging.StreamHandler()  # Console output
        # Add FileHandler for production: logging.FileHandler('app.log')
    ]
)

# Create logger for this module
logger = logging.getLogger(__name__)

# Reduce noise from third-party libraries
logging.getLogger("werkzeug").setLevel(logging.WARNING)
logging.getLogger("urllib3").setLevel(logging.WARNING)

app = Flask(__name__)
CORS(app)  # Enable CORS for React dev server

# ============================================================
# API ENDPOINTS (for React frontend)
# ============================================================

@app.route('/api/analyze', methods=['POST'])
def api_analyze():
    """JSON API endpoint for React frontend"""
    data = request.get_json()
    
    content_text = data.get('content_text', '')
    mode = data.get('analysis_mode', 'ticket')
    criteria = data.get('criteria_data', [])
    
    logger.info(f"📋 API request | mode={mode} | text_length={len(content_text)} chars")
    
    # Call the AI Logic
    raw_response = analyze_content(content_text, mode=mode, criteria=criteria)
    
    try:
        result = json.loads(raw_response)
        logger.info(f"✅ Analysis complete | score={result.get('score', 'N/A')} | risk={result.get('risk_level', 'N/A')}")
        return jsonify(result)
    except json.JSONDecodeError:
        logger.error("❌ Failed to parse AI response as JSON")
        return jsonify({"error": "AI failed to format JSON. Try again."}), 500

if __name__ == '__main__':
    app.run(debug=True)
