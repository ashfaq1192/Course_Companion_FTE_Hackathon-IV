import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useApiQuery } from '@/hooks/useApiQuery';
import { useRouter } from 'next/router';

interface QuizQuestion {
  id: string;
  content_id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer' | 'matching' | 'ordering';
  options?: string[]; // For multiple choice questions
  correct_answer: string;
  explanation: string;
  difficulty_level: string;
}

interface QuizAttempt {
  id: string;
  user_id: string;
  content_id: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  attempt_date: string;
  time_taken_seconds: number;
  answers: string; // JSON string of user's answers
}

interface QuizData {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
}

interface QuizSubmission {
  question_id: string;
  answer: string;
}

export const QuizInterface: React.FC<{ contentId: string }> = ({ contentId }) => {
  const router = useRouter();
  const { data: quizData, isLoading, error } = useApiQuery<QuizData>(
    ['quiz', contentId],
    `/quizzes/${contentId}/questions` // Hypothetical endpoint
  );

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{[key: string]: string}>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null); // null means no time limit
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizAttempt | null>(null);

  useEffect(() => {
    if (timeRemaining === 0) {
      handleSubmit();
    }
  }, [timeRemaining]);

  useEffect(() => {
    if (timeRemaining !== null && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev !== null ? prev - 1 : null);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeRemaining]);

  if (isLoading) {
    return <div>Loading quiz...</div>;
  }

  if (error) {
    return <div>Error loading quiz: {(error as Error).message}</div>;
  }

  if (!quizData || quizData.questions.length === 0) {
    return <div>No questions available for this quiz.</div>;
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];

  const handleAnswerChange = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Prepare submission data
      const submissionData: QuizSubmission[] = quizData.questions.map(q => ({
        question_id: q.id,
        answer: answers[q.id] || ''
      }));

      // In a real app, this would submit to the backend
      console.log('Submitting quiz answers:', submissionData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, just set a mock result
      const mockResult: QuizAttempt = {
        id: 'mock-result-id',
        user_id: 'current-user-id',
        content_id: contentId,
        score: 85,
        total_questions: quizData.questions.length,
        correct_answers: 5, // This would be calculated based on actual answers
        attempt_date: new Date().toISOString(),
        time_taken_seconds: 300, // 5 minutes
        answers: JSON.stringify(submissionData)
      };
      
      setQuizResult(mockResult);
    } catch (err) {
      console.error('Error submitting quiz:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (quizResult) {
    return (
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Quiz Result</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
            <p className="text-lg mb-2">Your score: <span className="font-bold">{quizResult.score}%</span></p>
            <p className="text-gray-600 mb-6">
              {quizResult.correct_answers} out of {quizResult.total_questions} questions correct
            </p>
            
            <div className="space-y-4">
              <Button 
                onClick={() => router.push(`/content/${contentId}`)}
                className="w-full max-w-xs mx-auto"
              >
                Return to Content
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/courses')}
                className="w-full max-w-xs mx-auto"
              >
                Browse Courses
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{quizData.title}</CardTitle>
            <p className="text-gray-500 mt-1">{quizData.description}</p>
          </div>
          {timeRemaining !== null && (
            <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
              {formatTime(timeRemaining)}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Question {currentQuestionIndex + 1} of {quizData.questions.length}</span>
            <span>Difficulty: {currentQuestion.difficulty_level}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${((currentQuestionIndex + 1) / quizData.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">{currentQuestion.question_text}</h3>
            
            {currentQuestion.question_type === 'multiple_choice' && (
              <div className="space-y-2">
                {currentQuestion.options?.map((option, idx) => (
                  <div key={idx} className="flex items-center">
                    <input
                      type="radio"
                      id={`option-${idx}`}
                      name={`question-${currentQuestion.id}`}
                      value={option}
                      checked={answers[currentQuestion.id] === option}
                      onChange={() => handleAnswerChange(option)}
                      className="mr-2"
                    />
                    <label htmlFor={`option-${idx}`} className="text-gray-700">
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            )}
            
            {currentQuestion.question_type === 'true_false' && (
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="true-option"
                    name={`question-${currentQuestion.id}`}
                    value="True"
                    checked={answers[currentQuestion.id] === 'True'}
                    onChange={() => handleAnswerChange('True')}
                    className="mr-2"
                  />
                  <label htmlFor="true-option" className="text-gray-700">
                    True
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="false-option"
                    name={`question-${currentQuestion.id}`}
                    value="False"
                    checked={answers[currentQuestion.id] === 'False'}
                    onChange={() => handleAnswerChange('False')}
                    className="mr-2"
                  />
                  <label htmlFor="false-option" className="text-gray-700">
                    False
                  </label>
                </div>
              </div>
            )}
            
            {(currentQuestion.question_type === 'short_answer' || 
              currentQuestion.question_type === 'matching' || 
              currentQuestion.question_type === 'ordering') && (
              <textarea
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswerChange(e.target.value)}
                className="w-full p-3 border rounded-md"
                rows={4}
                placeholder="Enter your answer here..."
              />
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
          >
            ← Previous
          </Button>
          
          {currentQuestionIndex < quizData.questions.length - 1 ? (
            <Button onClick={handleNextQuestion}>
              Next →
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};