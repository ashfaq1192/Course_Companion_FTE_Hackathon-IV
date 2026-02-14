import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { QuestionRenderer } from './QuestionRenderer';
import { useRouter } from 'next/router';

interface Question {
  id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer' | 'matching' | 'ordering';
  options?: string[];
  correct_answer: string;
  explanation: string;
  difficulty_level: string;
}

interface QuizSubmissionProps {
  quizId: string;
  questions: Question[];
  title: string;
  description: string;
  timeLimit?: number; // in minutes
  onSubmit: (answers: { [key: string]: string }) => void;
  isSubmitting: boolean;
  submissionError?: string;
}

export const QuizSubmission: React.FC<QuizSubmissionProps> = ({ 
  quizId, 
  questions, 
  title, 
  description, 
  timeLimit, 
  onSubmit, 
  isSubmitting, 
  submissionError 
}) => {
  const router = useRouter();
  const [answers, setAnswers] = useState<{[key: string]: string}>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(timeLimit ? timeLimit * 60 : null); // in seconds

  React.useEffect(() => {
    if (timeRemaining === 0) {
      handleSubmit();
    }
  }, [timeRemaining]);

  React.useEffect(() => {
    if (timeRemaining !== null && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev !== null ? prev - 1 : null);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeRemaining]);

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = () => {
    onSubmit(answers);
  };

  const formatTime = (seconds: number) => {
    if (seconds === null) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const unansweredCount = questions.filter(q => !answers[q.id]).length;

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{title}</CardTitle>
              <p className="text-gray-500 mt-1">{description}</p>
            </div>
            {timeRemaining !== null && (
              <div className={`text-lg font-bold px-4 py-2 rounded-lg ${
                timeRemaining < 60 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {formatTime(timeRemaining)}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>{questions.length} questions</span>
              <span>{unansweredCount} unanswered</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${((questions.length - unansweredCount) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-6">
            {questions.map((question, index) => (
              <div key={question.id} className="border-b pb-6 last:border-0 last:pb-0">
                <div className="flex items-center mb-4">
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mr-3">
                    {index + 1}
                  </span>
                  <h3 className="text-lg font-medium">Question {index + 1}</h3>
                </div>
                
                <QuestionRenderer 
                  question={question} 
                  onAnswer={handleAnswer} 
                  selectedAnswer={answers[question.id]}
                />
              </div>
            ))}
          </div>

          {submissionError && (
            <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg">
              {submissionError}
            </div>
          )}

          <div className="mt-8 flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => router.back()}
            >
              ← Back
            </Button>
            
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting || unansweredCount > 0}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? 'Submitting...' : `Submit Quiz (${questions.length - unansweredCount}/${questions.length})`}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};