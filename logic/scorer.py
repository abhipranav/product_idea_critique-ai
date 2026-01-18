import os
import json
import logging
import time
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

# Configure logger for this module
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

def analyze_content(text, mode="ticket", criteria=None):
    """
    Analyzes content based on mode.
    - mode: "ticket" for JIRA/Spec analysis, "business" for business idea analysis.
    - criteria: List of dicts for business mode, e.g., [{"name": "Market Fit", "priority": "Critical"}, ...]
    """
    logger.info(f"🚀 Starting analysis | mode={mode} | text_length={len(text)} chars | criteria_count={len(criteria) if criteria else 0}")
    
    api_key = os.getenv("GEMINI_API_KEY")
    model_name = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

    if not api_key:
        logger.error("❌ GEMINI_API_KEY not found in environment")
        return json.dumps({
            "score": 0,
            "risk_level": "Error",
            "critiques": ["API Key Missing"],
            "blind_spots": ["Please add GEMINI_API_KEY to your .env file"]
        })

    try:
        logger.debug(f"📡 Initializing Gemini client | model={model_name}")
        client = genai.Client(api_key=api_key)

        if mode == "ticket":
            prompt = _build_ticket_prompt(text)
        else:
            prompt = _build_business_prompt(text, criteria or [])
        
        logger.debug(f"📝 Prompt built | length={len(prompt)} chars")
        logger.info(f"⏳ Calling Gemini API...")
        
        start_time = time.time()
        response = client.models.generate_content(
            model=model_name,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )
        elapsed = time.time() - start_time
        
        logger.info(f"✅ Gemini API response received | elapsed={elapsed:.2f}s | response_length={len(response.text)} chars")
        logger.debug(f"📤 Response preview: {response.text[:200]}...")
        
        return response.text
    except Exception as e:
        logger.error(f"❌ Gemini API error: {str(e)}", exc_info=True)
        return json.dumps({
            "score": 0,
            "risk_level": "Error",
            "critiques": [f"Error calling Gemini API: {str(e)}"],
            "blind_spots": ["Check your API key and connection."]
        })


def _build_ticket_prompt(text):
    """Builds the prompt for JIRA/Spec ticket analysis."""
    return f"""
You are a Senior QA Engineer and Technical Architect known for finding edge cases that break systems.
Review the following JIRA Ticket or Technical Specification.

Content: "{text}"

Your goal is to find AMBIGUITY and RISK. Do not be helpful. Be brutally critical.
Imagine you are the developer who has to implement this. What will make you fail?

Output a JSON response with this exact structure:
{{
    "score": (integer 1-100, where 100 is perfectly clear and actionable, 0 is vague disaster),
    "risk_level": "High/Medium/Low",
    "critiques": [
        "List 3-5 specific phrases or sections that are ambiguous or risky.",
        "Explain WHY a developer might misinterpret them or fail during implementation."
    ],
    "blind_spots": [
        "List 2-4 scenarios, edge cases, or requirements the author forgot to define.",
        "Think about error handling, permissions, performance, and edge user behavior."
    ]
}}
"""


def _build_business_prompt(text, criteria):
    """Builds the prompt for business idea analysis with user-defined criteria."""
    base_persona = """
You are a battle-hardened Venture Capitalist and Industry Architect. You've seen 10,000 pitches.
90% of them failed because founders were blinded by their own optimism.
Your job is to be the voice of brutal, market-aware reality.
Do NOT be encouraging. Find the holes. Find the delusion. Find the overlooked competitor.
"""

    criteria_section = ""
    if criteria:
        criteria_lines = []
        for c in criteria:
            name = c.get("name", "Unknown Criterion")
            priority = c.get("priority", "Normal")
            description = c.get("description", "")
            if description:
                criteria_lines.append(f"- **{name}** (Importance: {priority}): User defines this as '{description}'")
            else:
                criteria_lines.append(f"- **{name}** (Importance: {priority})")
        
        criteria_section = f"""
The user has specifically asked you to evaluate the following dimensions. Weight your critique accordingly:
{chr(10).join(criteria_lines)}

For 'Critical' items, be EXTRA harsh. For 'Low' items, a brief mention is fine.
"""
    else:
        criteria_section = """
Evaluate on general business viability: Market Fit, Monetization Potential, Scalability, and Competitive Moat.
"""

    output_schema = """
Output a JSON response with this exact structure:
{
    "score": (integer 1-100, where 100 is a rare, investable idea, 0 is a delusional fantasy),
    "risk_level": "High/Medium/Low",
    "critiques": [
        "List 3-5 sharp, direct criticisms of the idea based on the criteria.",
        "For each, explain the business or market reality the founder is ignoring."
    ],
    "blind_spots": [
        "List 2-4 things the founder clearly hasn't thought about.",
        "Competitors, regulations, unit economics, customer acquisition cost, etc."
    ]
}
"""

    return f"""
{base_persona}

Review the following business idea or concept:
"{text}"

{criteria_section}

{output_schema}
"""
