import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import apiService from '@/services/api';

interface ContentItem {
  id: number;
  title: string;
  course_id: string;
  chapter_number: number;
  is_available: boolean;
}

interface QuizQuestion {
  id: number;
  content_id: number;
  question_text: string;
  question_type: string;
  options: string;
  difficulty_level: string;
}

interface QuizResult {
  score: number;
  total: number;
  percentage: number;
  results: Array<{
    question_id: number;
    user_answer: string;
    is_correct: boolean;
    explanation: string;
  }>;
}

const CHAPTER_COLORS = [
  'bg-blue-100 text-blue-800',
  'bg-emerald-100 text-emerald-800',
  'bg-orange-100 text-orange-800',
  'bg-purple-100 text-purple-800',
  'bg-cyan-100 text-cyan-800',
];

const Quizzes: NextPage = () => {
  const [chapters, setChapters] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Active quiz state
  const [activeQuizChapterId, setActiveQuizChapterId] = useState<number | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [quizLoading, setQuizLoading] = useState(false);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await apiService.get<ContentItem[]>('/content/by-course/all');
        setChapters(response.data);
      } catch (err) {
        setError('Failed to load quizzes.');
        console.error('Error loading chapters:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchChapters();
  }, []);

  const startQuiz = async (chapterId: number) => {
    setQuizLoading(true);
    setQuizResult(null);
    setAnswers({});
    try {
      const response = await apiService.post<{ attempt_id: number; questions: QuizQuestion[] }>(
        `/quiz/${chapterId}/start`
      );
      setQuizQuestions(response.data.questions);
      setActiveQuizChapterId(chapterId);
    } catch (err) {
      console.error('Failed to start quiz:', err);
      setError('Failed to start quiz. Please try again.');
    } finally {
      setQuizLoading(false);
    }
  };

  const submitQuiz = async () => {
    if (!activeQuizChapterId) return;
    setQuizLoading(true);
    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
        question_id: parseInt(questionId),
        selected_answer: answer,
      }));
      const response = await apiService.post<QuizResult>(
        `/quiz/${activeQuizChapterId}/submit`,
        { answers: formattedAnswers }
      );
      setQuizResult(response.data);
    } catch (err) {
      console.error('Failed to submit quiz:', err);
      setError('Failed to submit quiz.');
    } finally {
      setQuizLoading(false);
    }
  };

  const closeQuiz = () => {
    setActiveQuizChapterId(null);
    setQuizQuestions([]);
    setAnswers({});
    setQuizResult(null);
  };

  if (loading) {
    return (
      <DashboardLayout title="Quizzes">
        <div className="flex items-center justify-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Quizzes">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">Chapter Quizzes</h2>
        <p className="text-gray-600 mb-6">
          Test your knowledge on each chapter of the Generative AI Fundamentals course.
        </p>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm mb-4">
            {error}
            <button className="ml-2 underline" onClick={() => setError('')}>Dismiss</button>
          </div>
        )}

        <div className="space-y-4">
          {chapters.map((chapter, index) => {
            const colorClass = CHAPTER_COLORS[index % CHAPTER_COLORS.length];
            const isActive = activeQuizChapterId === chapter.id;

            return (
              <Card key={chapter.id} className={`transition-shadow ${isActive ? 'shadow-lg ring-2 ring-blue-300' : 'hover:shadow-md'}`}>
                {/* Chapter Header */}
                <CardContent className="flex items-center justify-between py-5">
                  <div className="flex items-center gap-4">
                    <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold ${colorClass}`}>
                      {chapter.chapter_number}
                    </span>
                    <div>
                      <CardTitle className="text-lg mb-1">{chapter.title}</CardTitle>
                      <p className="text-sm text-gray-500">
                        {chapter.is_available ? '5 questions' : 'Premium content'}
                      </p>
                    </div>
                  </div>
                  {!isActive ? (
                    <Button
                      size="sm"
                      onClick={() => startQuiz(chapter.id)}
                      disabled={quizLoading}
                    >
                      {quizLoading && activeQuizChapterId === null ? 'Loading...' : 'Take Quiz'}
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" onClick={closeQuiz}>
                      Close Quiz
                    </Button>
                  )}
                </CardContent>

                {/* Inline Quiz */}
                {isActive && !quizResult && (
                  <CardContent className="border-t pt-6">
                    <div className="space-y-6">
                      {quizQuestions.map((q, qIndex) => {
                        const options: string[] = JSON.parse(q.options);
                        return (
                          <div key={q.id} className="border rounded-lg p-4 bg-gray-50">
                            <p className="font-medium mb-3">
                              <span className="text-blue-600 mr-2">Q{qIndex + 1}.</span>
                              {q.question_text}
                            </p>
                            <span className="inline-block text-xs px-2 py-0.5 rounded bg-gray-200 text-gray-600 mb-3">
                              {q.difficulty_level}
                            </span>
                            <div className="space-y-2">
                              {options.map((option) => (
                                <label
                                  key={option}
                                  className={`flex items-center gap-3 cursor-pointer p-3 rounded-lg border transition-colors ${
                                    answers[q.id] === option
                                      ? 'bg-blue-50 border-blue-300'
                                      : 'bg-white border-gray-200 hover:bg-gray-50'
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name={`q-${q.id}`}
                                    value={option}
                                    checked={answers[q.id] === option}
                                    onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: option }))}
                                    className="text-blue-600"
                                  />
                                  <span className="text-sm">{option}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        );
                      })}

                      <div className="flex items-center justify-between pt-4">
                        <p className="text-sm text-gray-500">
                          {Object.keys(answers).length} of {quizQuestions.length} answered
                        </p>
                        <Button
                          onClick={submitQuiz}
                          disabled={Object.keys(answers).length < quizQuestions.length || quizLoading}
                        >
                          {quizLoading ? 'Submitting...' : 'Submit Quiz'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                )}

                {/* Quiz Results */}
                {isActive && quizResult && (
                  <CardContent className="border-t pt-6">
                    <div className="text-center mb-6">
                      <div className={`text-5xl font-bold mb-2 ${
                        quizResult.percentage >= 80 ? 'text-green-600' :
                        quizResult.percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {quizResult.score}/{quizResult.total}
                      </div>
                      <p className="text-gray-600">
                        You scored {Math.round(quizResult.percentage)}%
                        {quizResult.percentage >= 80 ? ' — Excellent!' :
                         quizResult.percentage >= 60 ? ' — Good effort!' : ' — Keep studying!'}
                      </p>
                    </div>

                    {/* Show explanations */}
                    <div className="space-y-4 mb-6">
                      {quizResult.results.map((r, i) => {
                        const question = quizQuestions.find((q) => q.id === r.question_id);
                        return (
                          <div
                            key={r.question_id}
                            className={`p-4 rounded-lg border ${
                              r.is_correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <span className={`text-lg ${r.is_correct ? 'text-green-600' : 'text-red-600'}`}>
                                {r.is_correct ? '✓' : '✗'}
                              </span>
                              <div>
                                <p className="font-medium text-sm mb-1">
                                  Q{i + 1}. {question?.question_text}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Your answer: <span className="font-medium">{r.user_answer}</span>
                                </p>
                                <p className="text-sm text-gray-500 mt-1 italic">{r.explanation}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex gap-3 justify-center">
                      <Button variant="outline" onClick={() => startQuiz(chapter.id)}>
                        Retry Quiz
                      </Button>
                      <Button variant="outline" onClick={closeQuiz}>
                        Close
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        {chapters.length === 0 && !error && (
          <p className="text-gray-500 text-center py-12">No quizzes available yet.</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Quizzes;
