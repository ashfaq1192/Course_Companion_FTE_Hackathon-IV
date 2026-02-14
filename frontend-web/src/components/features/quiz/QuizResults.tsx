import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { QuestionRenderer } from './QuestionRenderer';
import { useRouter } from 'next/router';

interface QuizResult {
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

interface Question {
  id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer' | 'matching' | 'ordering';
  options?: string[];
  correct_answer: string;
  explanation: string;
  difficulty_level: string;
}

interface QuizResultsProps {
  result: QuizResult;
  questions: Question[];
  quizTitle: string;
  onRetake?: () => void;
  onReview?: () => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({ 
  result, 
  questions, 
  quizTitle, 
  onRetake, 
  onReview 
}) => {
  const router = useRouter();
  
  // Parse the user's answers from the result
  const userAnswers: { [key: string]: string } = JSON.parse(result.answers || '{}');
  
  // Calculate correct answers
  const calculateCorrectAnswers = () => {
    let correct = 0;
    questions.forEach(q => {
      if (userAnswers[q.id] === q.correct_answer) {
        correct++;
      }
    });
    return correct;
  };
  
  const correctCount = calculateCorrectAnswers();
  const percentage = Math.round((correctCount / questions.length) * 100);

  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-blue-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90) return 'Excellent work!';
    if (percentage >= 70) return 'Good job!';
    if (percentage >= 50) return 'You passed!';
    return 'Keep studying!';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <div className="text-center">
            <CardTitle className="text-2xl">{quizTitle} - Results</CardTitle>
            <p className="text-gray-500 mt-1">Quiz completed on {new Date(result.attempt_date).toLocaleString()}</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-8">
            <div className={`text-5xl font-bold ${getScoreColor(percentage)}`}>
              {percentage}%
            </div>
            <div className="text-xl font-medium mt-2">{getScoreMessage(percentage)}</div>
            <div className="text-gray-600 mt-1">
              {correctCount} of {questions.length} questions correct
            </div>
            <div className="text-gray-500 text-sm mt-2">
              Time taken: {Math.floor(result.time_taken_seconds / 60)}m {result.time_taken_seconds % 60}s
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{questions.length}</div>
                <div className="text-sm text-gray-500">Total Questions</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{correctCount}</div>
                <div className="text-sm text-gray-500">Correct Answers</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{questions.length - correctCount}</div>
                <div className="text-sm text-gray-500">Incorrect Answers</div>
              </CardContent>
            </Card>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Question Review</h3>
            <div className="space-y-6">
              {questions.map((question, index) => {
                const isCorrect = userAnswers[question.id] === question.correct_answer;
                return (
                  <Card key={question.id} className={`${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">
                          Question {index + 1}: {question.question_text}
                        </CardTitle>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <QuestionRenderer 
                        question={question} 
                        onAnswer={() => {}} 
                        selectedAnswer={userAnswers[question.id]}
                        isReviewMode={true}
                      />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button 
              onClick={() => onRetake ? onRetake() : router.push(`/quizzes/${result.content_id}/take`)}
              className="w-full sm:w-auto"
            >
              Retake Quiz
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push('/courses')}
              className="w-full sm:w-auto"
            >
              Browse Courses
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.back()}
              className="w-full sm:w-auto"
            >
              Back to Content
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};