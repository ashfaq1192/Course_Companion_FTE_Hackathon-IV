import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useApiQuery } from '@/hooks/useApiQuery';
import { useRouter } from 'next/router';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ContentData {
  id: string;
  title: string;
  content_type: string; // text, video, quiz
  content_data: string; // Could be markdown text, video URL, etc.
  course_id: string;
  chapter_number: number;
  section_number: number;
  is_available: boolean;
}

interface ContentDisplayProps {
  contentId: string;
}

export const ContentDisplay: React.FC<ContentDisplayProps> = ({ contentId }) => {
  const router = useRouter();
  const { data: content, isLoading, error } = useApiQuery<ContentData>(
    ['content', contentId],
    `/content/${contentId}`
  );

  const { data: nextContent, isLoading: nextLoading } = useApiQuery<ContentData>(
    ['next-content', contentId],
    `/content/${contentId}/next`,
    { enabled: !!contentId }
  );

  if (isLoading) {
    return <div>Loading content...</div>;
  }

  if (error) {
    return <div>Error loading content: {(error as Error).message}</div>;
  }

  if (!content) {
    return <div>Content not found</div>;
  }

  const handleComplete = () => {
    // In a real app, this would update progress via API
    console.log(`Marking content ${contentId} as completed`);
    
    // Navigate to next content if available
    if (nextContent) {
      router.push(`/content/${nextContent.id}`);
    } else {
      // If no next content, go back to course
      router.push(`/courses/${content.course_id}`);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{content.title}</CardTitle>
              <p className="text-gray-500 mt-1">
                Chapter {content.chapter_number}, Section {content.section_number}
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => router.push(`/courses/${content.course_id}`)}
            >
              Back to Course
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            {content.content_type === 'text' && (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content.content_data}
              </ReactMarkdown>
            )}
            
            {content.content_type === 'video' && (
              <div className="aspect-video bg-black rounded-lg overflow-hidden mb-6">
                <video 
                  src={content.content_data} 
                  controls 
                  className="w-full h-full"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
            
            {content.content_type === 'quiz' && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <p>This content is a quiz. Navigate to the quiz interface to complete it.</p>
              </div>
            )}
            
            {content.content_type === 'exercise' && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <p>This content is an exercise. Complete the interactive elements below.</p>
              </div>
            )}
          </div>
          
          <div className="flex justify-between mt-8">
            <Button 
              variant="outline"
              onClick={() => {
                // Go back to course
                router.push(`/courses/${content.course_id}`);
              }}
            >
              ← Back to Course
            </Button>
            
            <Button onClick={handleComplete}>
              {nextContent ? `Continue to ${nextContent.title}` : 'Complete & Return to Course'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};