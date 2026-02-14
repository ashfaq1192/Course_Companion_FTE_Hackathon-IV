import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface Question {
  id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer' | 'matching' | 'ordering';
  options?: string[]; // For multiple choice questions
  correct_answer: string;
  explanation: string;
  difficulty_level: string;
}

interface QuestionRendererProps {
  question: Question;
  onAnswer: (questionId: string, answer: string) => void;
  selectedAnswer?: string;
  isReviewMode?: boolean; // Show correct answer/explanation
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({ 
  question, 
  onAnswer, 
  selectedAnswer, 
  isReviewMode = false 
}) => {
  const [userAnswer, setUserAnswer] = useState<string>(selectedAnswer || '');

  const handleAnswerChange = (value: string) => {
    setUserAnswer(value);
    onAnswer(question.id, value);
  };

  const renderQuestionContent = () => {
    switch (question.question_type) {
      case 'multiple_choice':
        return (
          <div className="space-y-2">
            {question.options?.map((option, idx) => (
              <div key={idx} className="flex items-center">
                <input
                  type="radio"
                  id={`option-${question.id}-${idx}`}
                  name={`question-${question.id}`}
                  value={option}
                  checked={userAnswer === option}
                  onChange={() => handleAnswerChange(option)}
                  disabled={isReviewMode}
                  className="mr-2"
                />
                <label 
                  htmlFor={`option-${question.id}-${idx}`} 
                  className={`text-gray-700 ${isReviewMode && option === question.correct_answer ? 'font-bold text-green-600' : ''}`}
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        );

      case 'true_false':
        return (
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="radio"
                id={`true-${question.id}`}
                name={`question-${question.id}`}
                value="True"
                checked={userAnswer === 'True'}
                onChange={() => handleAnswerChange('True')}
                disabled={isReviewMode}
                className="mr-2"
              />
              <label 
                htmlFor={`true-${question.id}`} 
                className={`text-gray-700 ${isReviewMode && question.correct_answer === 'True' ? 'font-bold text-green-600' : ''}`}
              >
                True
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id={`false-${question.id}`}
                name={`question-${question.id}`}
                value="False"
                checked={userAnswer === 'False'}
                onChange={() => handleAnswerChange('False')}
                disabled={isReviewMode}
                className="mr-2"
              />
              <label 
                htmlFor={`false-${question.id}`} 
                className={`text-gray-700 ${isReviewMode && question.correct_answer === 'False' ? 'font-bold text-green-600' : ''}`}
              >
                False
              </label>
            </div>
          </div>
        );

      case 'short_answer':
        return (
          <textarea
            value={userAnswer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            className="w-full p-3 border rounded-md"
            rows={4}
            placeholder="Enter your answer here..."
            disabled={isReviewMode}
          />
        );

      case 'matching':
        return (
          <div className="space-y-4">
            <p className="text-gray-600">Match the items on the left with the correct items on the right.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Terms</h4>
                {question.options?.slice(0, question.options.length / 2).map((term, idx) => (
                  <div key={idx} className="mb-2 p-2 bg-gray-100 rounded">
                    <span>{term}</span>
                  </div>
                ))}
              </div>
              <div>
                <h4 className="font-medium mb-2">Definitions</h4>
                {question.options?.slice(question.options.length / 2).map((def, idx) => (
                  <div key={idx} className="mb-2">
                    <select
                      value={userAnswer.split(',')[idx] || ''}
                      onChange={(e) => {
                        const newAnswers = userAnswer.split(',');
                        newAnswers[idx] = e.target.value;
                        handleAnswerChange(newAnswers.join(','));
                      }}
                      disabled={isReviewMode}
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Select...</option>
                      {question.options?.slice(0, question.options.length / 2).map((term, termIdx) => (
                        <option key={termIdx} value={term}>{term}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'ordering':
        return (
          <div className="space-y-4">
            <p className="text-gray-600">Arrange the following items in the correct order.</p>
            <div className="space-y-2">
              {question.options?.map((item, idx) => (
                <div key={idx} className="flex items-center">
                  <span className="mr-3 font-medium">{idx + 1}.</span>
                  <select
                    value={userAnswer.split(',')[idx] || ''}
                    onChange={(e) => {
                      const newAnswers = userAnswer.split(',');
                      newAnswers[idx] = e.target.value;
                      handleAnswerChange(newAnswers.join(','));
                    }}
                    disabled={isReviewMode}
                    className="flex-1 p-2 border rounded"
                  >
                    <option value="">Select position...</option>
                    {question.options?.map((opt, optIdx) => (
                      <option key={optIdx} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return <p>Unsupported question type</p>;
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-medium">{question.question_text}</h3>
          <span className={`px-2 py-1 rounded-full text-xs ${
            question.difficulty_level === 'beginner' ? 'bg-green-100 text-green-800' :
            question.difficulty_level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {question.difficulty_level}
          </span>
        </div>

        {renderQuestionContent()}

        {isReviewMode && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium mb-2">Explanation:</h4>
            <p className="text-gray-700">{question.explanation}</p>
            <div className="mt-3">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Correct answer:</span> {question.correct_answer}
              </p>
              {userAnswer && userAnswer !== question.correct_answer && (
                <p className="text-sm text-red-600 mt-1">
                  Your answer: {userAnswer}
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};