import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAssessmentQuestions, submitAssessment } from '../api';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Assessment() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  const [result, setResult] = useState(null);

  const assessmentTypes = [
    { id: 'phq9', name: 'PHQ-9', description: 'Depression Screening', color: 'bg-chart-1' },
    { id: 'gad7', name: 'GAD-7', description: 'Anxiety Assessment', color: 'bg-chart-2' },
    { id: 'stress', name: 'Stress Scale', description: 'Stress Level Check', color: 'bg-chart-3' }
  ];

  const startAssessment = async (type) => {
    try {
      const response = await getAssessmentQuestions(type);
      setQuestions(response.data.questions);
      setSelectedType(type);
      setCurrentQuestion(0);
      setResponses({});
    } catch (error) {
      toast.error('Failed to load assessment');
    }
  };

  const handleAnswer = (value) => {
    const newResponses = { ...responses, [currentQuestion + 1]: value };
    setResponses(newResponses);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitResults(newResponses);
    }
  };

  const submitResults = async (finalResponses) => {
    try {
      const response = await submitAssessment(selectedType, finalResponses);
      setResult(response.data);
    } catch (error) {
      toast.error('Failed to submit assessment');
    }
  };

  if (result) {
    return (
      <div className="min-h-screen bg-background bg-noise flex items-center justify-center px-6">
        <div className="w-full max-w-2xl">
          <div data-testid="assessment-result" className="bg-card rounded-2xl shadow-float p-8 md:p-12 border border-border/40 text-center">
            <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="font-fraunces text-3xl font-normal mb-4">Assessment Complete</h2>
            
            <div className="bg-muted/30 rounded-xl p-6 mb-6">
              <p className="text-sm text-muted-foreground mb-2">Your Score</p>
              <p className="text-6xl font-bold text-primary mb-2">{result.total_score}</p>
              <p className="text-lg font-medium">{result.severity}</p>
            </div>

            <p className="text-muted-foreground mb-6 leading-relaxed">
              Your assessment has been recorded. Remember, this is a screening tool and not a diagnosis. 
              If you're concerned about your results, please consider speaking with a mental health professional or contact KIRAN helpline: 1800-599-0019.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                data-testid="view-progress-btn"
                onClick={() => navigate('/progress')}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full py-6 font-medium"
              >
                View Progress
              </Button>
              <Button
                data-testid="back-to-dashboard-btn"
                onClick={() => navigate('/dashboard')}
                variant="outline"
                className="flex-1 rounded-full py-6 font-medium"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedType && questions.length > 0) {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    const question = questions[currentQuestion];

    return (
      <div className="min-h-screen bg-background bg-noise flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          <div className="mb-6">
            <Button
              data-testid="back-btn"
              onClick={() => setSelectedType(null)}
              variant="ghost"
              className="hover:bg-muted/50 rounded-full"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
          </div>

          <div className="bg-card rounded-2xl shadow-float p-8 md:p-12 border border-border/40">
            <div className="mb-8">
              <p className="text-sm text-muted-foreground mb-2">
                Question {currentQuestion + 1} of {questions.length}
              </p>
              <Progress value={progress} className="h-2" />
            </div>

            <h2 data-testid="assessment-question" className="font-fraunces text-2xl md:text-3xl font-normal mb-8 leading-relaxed">
              {question.question}
            </h2>

            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  data-testid={`answer-option-${index}`}
                  onClick={() => handleAnswer(index)}
                  className="w-full p-4 rounded-xl border-2 border-border/40 hover:border-primary/50 hover:bg-primary/5 transition-all text-left font-medium"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-noise">
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4">
          <Button
            data-testid="back-to-dashboard-btn"
            onClick={() => navigate('/dashboard')}
            variant="ghost"
            className="hover:bg-muted/50 rounded-full"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <div data-testid="assessment-selection" className="max-w-4xl mx-auto px-6 md:px-12 py-16">
        <h1 className="font-fraunces text-4xl md:text-5xl font-normal mb-4">Mental Health Assessments</h1>
        <p className="text-lg text-muted-foreground mb-12">
          These validated screening tools help you understand your mental health. Select one to begin.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {assessmentTypes.map((type) => (
            <button
              key={type.id}
              data-testid={`start-${type.id}-btn`}
              onClick={() => startAssessment(type.id)}
              className="bg-card rounded-2xl p-8 border border-border/40 shadow-soft hover:shadow-float hover:-translate-y-1 transition-all text-left group"
            >
              <div className={`w-12 h-12 rounded-full ${type.color} opacity-20 mb-4 group-hover:opacity-30 transition-opacity`}></div>
              <h3 className="font-fraunces text-2xl font-medium mb-2">{type.name}</h3>
              <p className="text-muted-foreground">{type.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}