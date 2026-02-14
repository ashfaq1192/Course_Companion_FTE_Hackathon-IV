import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import apiService from '@/services/api';

interface ContentItem {
  id: number;
  title: string;
  content_type: string;
  content_data: string;
  course_id: string;
  chapter_number: number;
  section_number: number;
  is_available: boolean;
}

interface QuizQuestion {
  id: number;
  content_id: number;
  question_text: string;
  question_type: string;
  options: string;
  correct_answer: string;
  explanation: string;
  difficulty_level: string;
}

const CourseDetail: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [content, setContent] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [quizResult, setQuizResult] = useState<{ score: number; total: number; results: Record<string, unknown>[] } | null>(null);

  useEffect(() => {
    if (!id) return;
    // Reset all quiz state when chapter changes
    setQuizStarted(false);
    setQuizQuestions([]);
    setAnswers({});
    setQuizResult(null);
    setError('');
    setLoading(true);

    const fetchContent = async () => {
      try {
        const response = await apiService.get<ContentItem>(`/content/${id}`);
        setContent(response.data);
      } catch (err) {
        setError('Failed to load content. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [id]);

  const startQuiz = async () => {
    if (!id) return;
    try {
      const response = await apiService.post<{ attempt_id: number; questions: QuizQuestion[] }>(`/quiz/${id}/start`);
      setQuizQuestions(response.data.questions);
      setQuizStarted(true);
      setQuizResult(null);
      setAnswers({});
    } catch (err) {
      console.error('Failed to start quiz:', err);
      setError('Failed to start quiz.');
    }
  };

  const submitQuiz = async () => {
    if (!id) return;
    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
        question_id: parseInt(questionId),
        selected_answer: answer,
      }));
      const response = await apiService.post(`/quiz/${id}/submit`, { answers: formattedAnswers });
      setQuizResult(response.data as { score: number; total: number; results: Record<string, unknown>[] });
    } catch (err) {
      console.error('Failed to submit quiz:', err);
      setError('Failed to submit quiz.');
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Loading...">
        <div className="flex items-center justify-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !content) {
    return (
      <DashboardLayout title="Error">
        <Card className="max-w-lg mx-auto mt-8">
          <CardContent className="py-8 text-center">
            <p className="text-red-500 mb-4">{error || 'Content not found.'}</p>
            <Link href="/courses">
              <Button>Back to Courses</Button>
            </Link>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  // Simple markdown-to-HTML renderer for course content
  const renderContent = (text: string) => {
    return text
      .split('\n')
      .map((line, i) => {
        if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-semibold mt-4 mb-2">{line.replace('### ', '')}</h3>;
        if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold mt-6 mb-3">{line.replace('## ', '')}</h2>;
        if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold mt-6 mb-3">{line.replace('# ', '')}</h1>;
        if (line.startsWith('- ')) return <li key={i} className="ml-6 list-disc">{line.replace('- ', '')}</li>;
        if (line.startsWith('```')) return null;
        if (line.trim() === '') return <br key={i} />;
        // Bold text
        const boldProcessed = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        return <p key={i} className="mb-1" dangerouslySetInnerHTML={{ __html: boldProcessed }} />;
      });
  };

  return (
    <DashboardLayout title={content.title}>
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/courses">
            <Button variant="outline" size="sm">&larr; Back to Courses</Button>
          </Link>
          <div className="flex gap-2">
            {content.chapter_number > 1 && (
              <Link href={`/courses/${content.id - 1}`}>
                <Button variant="outline" size="sm">&larr; Previous</Button>
              </Link>
            )}
            <Link href={`/courses/${content.id + 1}`}>
              <Button variant="outline" size="sm">Next &rarr;</Button>
            </Link>
          </div>
        </div>

        {/* Content */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <span>Chapter {content.chapter_number}</span>
              <span>&bull;</span>
              <span>{content.course_id}</span>
            </div>
            <CardTitle className="text-2xl">{content.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              {renderContent(content.content_data)}
            </div>
          </CardContent>
        </Card>

        {/* Quiz Section */}
        <Card>
          <CardHeader>
            <CardTitle>Chapter Quiz</CardTitle>
          </CardHeader>
          <CardContent>
            {!quizStarted && !quizResult && (
              <div className="text-center py-4">
                <p className="text-gray-600 mb-4">Test your understanding of this chapter.</p>
                <Button onClick={startQuiz}>Start Quiz</Button>
              </div>
            )}

            {quizStarted && !quizResult && (
              <div className="space-y-6">
                {quizQuestions.map((q, index) => {
                  const options: string[] = JSON.parse(q.options);
                  return (
                    <div key={q.id} className="border rounded-lg p-4">
                      <p className="font-medium mb-3">
                        {index + 1}. {q.question_text}
                      </p>
                      <div className="space-y-2">
                        {options.map((option) => (
                          <label key={option} className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-50">
                            <input
                              type="radio"
                              name={`q-${q.id}`}
                              value={option}
                              checked={answers[q.id] === option}
                              onChange={() => setAnswers(prev => ({ ...prev, [q.id]: option }))}
                              className="text-blue-600"
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
                <div className="flex justify-end">
                  <Button
                    onClick={submitQuiz}
                    disabled={Object.keys(answers).length < quizQuestions.length}
                  >
                    Submit Quiz ({Object.keys(answers).length}/{quizQuestions.length} answered)
                  </Button>
                </div>
              </div>
            )}

            {quizResult && (
              <div className="text-center py-4">
                <div className="text-4xl font-bold mb-2">
                  {quizResult.score}/{quizResult.total}
                </div>
                <p className="text-gray-600 mb-4">
                  You scored {Math.round((quizResult.score / quizResult.total) * 100)}%
                </p>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" onClick={() => { setQuizStarted(false); setQuizResult(null); }}>
                    Try Again
                  </Button>
                  {content.chapter_number < 5 && (
                    <Link href={`/courses/${content.id + 1}`}>
                      <Button>Next Chapter &rarr;</Button>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CourseDetail;
