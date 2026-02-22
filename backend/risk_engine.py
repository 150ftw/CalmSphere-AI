import re
from typing import Tuple

CRISIS_KEYWORDS = [
    r'\bkill myself\b', r'\bsuicide\b', r'\bend my life\b', r'\bwant to die\b',
    r'\bno reason to live\b', r'\bhurt myself\b', r'\bself harm\b',
    r'\bcut myself\b', r'\bbetter off dead\b', r'\bno point in living\b',
    r'\bआत्महत्या\b', r'\bमर जाना\b', r'\bजान देना\b'
]

HIGH_RISK_KEYWORDS = [
    r'\bhopeless\b', r'\bworthless\b', r'\bburden\b', r'\balone forever\b',
    r'\bcan\'?t go on\b', r'\bgiving up\b', r'\bno future\b',
    r'\bextremely depressed\b', r'\bsevere anxiety\b',
    r'\bनिराश\b', r'\bबेकार\b', r'\bबोझ\b'
]

MEDIUM_RISK_KEYWORDS = [
    r'\boverwhelmed\b', r'\bstressed\b', r'\banxious\b', r'\bdepressed\b',
    r'\bsad\b', r'\bworried\b', r'\bscared\b', r'\blonely\b',
    r'\bतनाव\b', r'\bचिंता\b', r'\bउदास\b', r'\bअकेला\b'
]

def detect_risk_level(message: str) -> Tuple[str, int]:
    """
    Analyze message for risk indicators.
    Returns: (risk_level, risk_score)
    risk_level: 'crisis', 'high', 'medium', 'low'
    """
    message_lower = message.lower()
    risk_score = 0
    
    # Crisis detection
    for pattern in CRISIS_KEYWORDS:
        if re.search(pattern, message_lower):
            return ('crisis', 100)
    
    # High risk detection
    for pattern in HIGH_RISK_KEYWORDS:
        if re.search(pattern, message_lower):
            risk_score += 15
    
    # Medium risk detection
    for pattern in MEDIUM_RISK_KEYWORDS:
        if re.search(pattern, message_lower):
            risk_score += 5
    
    # Classify based on score
    if risk_score >= 20:
        return ('high', risk_score)
    elif risk_score >= 10:
        return ('medium', risk_score)
    else:
        return ('low', risk_score)

def get_crisis_response(config) -> str:
    """
    Generate immediate crisis intervention response for Indian context.
    """
    return f"""I'm deeply concerned about what you've shared. Your safety is the most important thing right now.

Please reach out for immediate support:

📞 KIRAN Mental Health Helpline: {config.get('crisis_hotline', '1800-599-0019')}
📞 Vandrevala Foundation: 1860-2662-345 / 9999 666 555
📞 iCall Psychosocial Helpline: 9152987821
📧 Campus Counselor: {config.get('campus_counselor_email', 'Available through campus resources')}

You don't have to face this alone. Professional counselors are available and want to help.

If you're in immediate danger, please call emergency services (112) or visit your nearest hospital emergency room.

I'm here to listen, but I'm not equipped to provide the crisis support you need right now. Please reach out to one of these resources."""

def get_high_risk_response() -> str:
    return """I hear that you're going through a really difficult time. What you're feeling is valid, and I'm glad you're talking about it.

While I'm here to support you, I want to make sure you have access to professional help. Have you considered speaking with a counselor or therapist? They can provide more comprehensive support.

In the meantime, let's talk about what's been happening. I'm here to listen."""