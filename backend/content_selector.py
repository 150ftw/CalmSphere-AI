from typing import List, Dict
import random

def get_assessment_questions(assessment_type: str) -> List[Dict]:
    """
    Return standardized assessment questions
    """
    if assessment_type == 'phq9':
        return [
            {"id": 1, "question": "Little interest or pleasure in doing things?", "options": ["Not at all", "Several days", "More than half the days", "Nearly every day"]},
            {"id": 2, "question": "Feeling down, depressed, or hopeless?", "options": ["Not at all", "Several days", "More than half the days", "Nearly every day"]},
            {"id": 3, "question": "Trouble falling or staying asleep, or sleeping too much?", "options": ["Not at all", "Several days", "More than half the days", "Nearly every day"]},
            {"id": 4, "question": "Feeling tired or having little energy?", "options": ["Not at all", "Several days", "More than half the days", "Nearly every day"]},
            {"id": 5, "question": "Poor appetite or overeating?", "options": ["Not at all", "Several days", "More than half the days", "Nearly every day"]},
            {"id": 6, "question": "Feeling bad about yourself — or that you are a failure or have let yourself or your family down?", "options": ["Not at all", "Several days", "More than half the days", "Nearly every day"]},
            {"id": 7, "question": "Trouble concentrating on things, such as reading or watching TV?", "options": ["Not at all", "Several days", "More than half the days", "Nearly every day"]},
            {"id": 8, "question": "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual?", "options": ["Not at all", "Several days", "More than half the days", "Nearly every day"]},
            {"id": 9, "question": "Thoughts that you would be better off dead, or of hurting yourself in some way?", "options": ["Not at all", "Several days", "More than half the days", "Nearly every day"]}
        ]
    elif assessment_type == 'gad7':
        return [
            {"id": 1, "question": "Feeling nervous, anxious, or on edge?", "options": ["Not at all", "Several days", "More than half the days", "Nearly every day"]},
            {"id": 2, "question": "Not being able to stop or control worrying?", "options": ["Not at all", "Several days", "More than half the days", "Nearly every day"]},
            {"id": 3, "question": "Worrying too much about different things?", "options": ["Not at all", "Several days", "More than half the days", "Nearly every day"]},
            {"id": 4, "question": "Trouble relaxing?", "options": ["Not at all", "Several days", "More than half the days", "Nearly every day"]},
            {"id": 5, "question": "Being so restless that it's hard to sit still?", "options": ["Not at all", "Several days", "More than half the days", "Nearly every day"]},
            {"id": 6, "question": "Becoming easily annoyed or irritable?", "options": ["Not at all", "Several days", "More than half the days", "Nearly every day"]},
            {"id": 7, "question": "Feeling afraid as if something awful might happen?", "options": ["Not at all", "Several days", "More than half the days", "Nearly every day"]}
        ]
    elif assessment_type == 'stress':
        return [
            {"id": 1, "question": "How often have you felt stressed?", "options": ["Never", "Rarely", "Sometimes", "Often", "Very often"]},
            {"id": 2, "question": "How often have you felt overwhelmed by responsibilities?", "options": ["Never", "Rarely", "Sometimes", "Often", "Very often"]},
            {"id": 3, "question": "How often have you had difficulty relaxing?", "options": ["Never", "Rarely", "Sometimes", "Often", "Very often"]},
            {"id": 4, "question": "How often have you felt unable to cope?", "options": ["Never", "Rarely", "Sometimes", "Often", "Very often"]},
            {"id": 5, "question": "How often have you felt irritable or short-tempered?", "options": ["Never", "Rarely", "Sometimes", "Often", "Very often"]}
        ]
    return []

def calculate_assessment_score(assessment_type: str, responses: dict) -> tuple:
    """
    Calculate total score and severity classification
    Returns: (total_score, severity_label)
    """
    total_score = sum(responses.values())
    
    if assessment_type == 'phq9':
        if total_score <= 4:
            severity = "Minimal"
        elif total_score <= 9:
            severity = "Mild"
        elif total_score <= 14:
            severity = "Moderate"
        elif total_score <= 19:
            severity = "Moderately Severe"
        else:
            severity = "Severe"
    elif assessment_type == 'gad7':
        if total_score <= 4:
            severity = "Minimal"
        elif total_score <= 9:
            severity = "Mild"
        elif total_score <= 14:
            severity = "Moderate"
        else:
            severity = "Severe"
    elif assessment_type == 'stress':
        if total_score <= 5:
            severity = "Low"
        elif total_score <= 10:
            severity = "Moderate"
        elif total_score <= 15:
            severity = "High"
        else:
            severity = "Very High"
    else:
        severity = "Unknown"
    
    return (total_score, severity)

def get_self_help_modules() -> List[Dict]:
    """
    Return available self-help modules
    """
    return [
        {
            "id": "breathing-1",
            "title": "4-7-8 Breathing Exercise",
            "module_type": "breathing",
            "description": "A simple breathing technique to reduce anxiety and promote calm",
            "tags": ["anxiety", "stress", "quick"],
            "difficulty": "beginner",
            "content": {
                "steps": [
                    "Find a comfortable seated position",
                    "Breathe in through your nose for 4 counts",
                    "Hold your breath for 7 counts",
                    "Exhale slowly through your mouth for 8 counts",
                    "Repeat 3-4 times"
                ],
                "duration": "2-3 minutes"
            }
        },
        {
            "id": "grounding-1",
            "title": "5-4-3-2-1 Grounding Technique",
            "module_type": "grounding",
            "description": "Use your senses to ground yourself in the present moment",
            "tags": ["anxiety", "panic", "mindfulness"],
            "difficulty": "beginner",
            "content": {
                "steps": [
                    "Name 5 things you can see",
                    "Name 4 things you can touch",
                    "Name 3 things you can hear",
                    "Name 2 things you can smell",
                    "Name 1 thing you can taste"
                ],
                "duration": "3-5 minutes"
            }
        },
        {
            "id": "cbt-1",
            "title": "Thought Record",
            "module_type": "cbt",
            "description": "Challenge negative thoughts using cognitive behavioral techniques",
            "tags": ["depression", "anxiety", "thoughts"],
            "difficulty": "intermediate",
            "content": {
                "steps": [
                    "Write down the negative thought",
                    "What evidence supports this thought?",
                    "What evidence contradicts this thought?",
                    "What would you tell a friend in this situation?",
                    "Write a more balanced thought"
                ],
                "duration": "10-15 minutes"
            }
        },
        {
            "id": "journaling-1",
            "title": "Gratitude Journaling",
            "module_type": "journaling",
            "description": "Shift focus to positive aspects of your life",
            "tags": ["depression", "mood", "daily"],
            "difficulty": "beginner",
            "content": {
                "steps": [
                    "Write down 3 things you're grateful for today",
                    "Describe why each one matters to you",
                    "Notice how this makes you feel"
                ],
                "duration": "5 minutes"
            }
        },
        {
            "id": "sleep-1",
            "title": "Sleep Hygiene Routine",
            "module_type": "sleep",
            "description": "Improve sleep quality with healthy habits",
            "tags": ["sleep", "routine", "wellness"],
            "difficulty": "beginner",
            "content": {
                "steps": [
                    "Set a consistent bedtime",
                    "Avoid screens 1 hour before bed",
                    "Keep bedroom cool and dark",
                    "Try light reading or meditation",
                    "Avoid caffeine after 2 PM"
                ],
                "duration": "Ongoing practice"
            }
        }
    ]

def select_modules_for_user(latest_scores: dict, mood_trend: str, risk_level: str) -> List[Dict]:
    """
    Recommend self-help modules based on user context
    """
    modules = get_self_help_modules()
    recommendations = []
    
    # Crisis or high risk - return calming techniques
    if risk_level in ['crisis', 'high']:
        recommendations = [m for m in modules if m['module_type'] in ['breathing', 'grounding']]
        return recommendations[:2]
    
    # Based on assessment scores
    if latest_scores.get('gad7', 0) > 10:
        recommendations.extend([m for m in modules if 'anxiety' in m['tags']])
    
    if latest_scores.get('phq9', 0) > 10:
        recommendations.extend([m for m in modules if 'depression' in m['tags']])
    
    if latest_scores.get('stress', 0) > 10:
        recommendations.extend([m for m in modules if 'stress' in m['tags']])
    
    # Remove duplicates and limit
    seen = set()
    unique_recs = []
    for m in recommendations:
        if m['id'] not in seen:
            seen.add(m['id'])
            unique_recs.append(m)
    
    # If no specific recommendations, return random selection
    if not unique_recs:
        return random.sample(modules, min(2, len(modules)))
    
    return unique_recs[:3]