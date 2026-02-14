import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useApiQuery } from '@/hooks/useApiQuery';
import { useRouter } from 'next/router';

interface CourseContent {
  id: string;
  title: string;
  contentType: string; // text, video, quiz
  duration: string;
  isCompleted: boolean;
}

interface CourseDetailProps {
  courseId: string;
}

export const CourseDetail: React.FC<CourseDetailProps> = ({ courseId }) => {
  const router = useRouter();
  const { data: course, isLoading, error } = useApiQuery<any>(
    ['course', courseId],
    `/content/by-course/${courseId}`
  );

  const { data: contentList, isLoading: contentLoading, error: contentError } = useApiQuery<CourseContent[]>(
    ['course-content', courseId],
    `/content/by-course/${courseId}`
  );

  if (isLoading || contentLoading) {
    return <div>Loading course details...</div>;
  }

  if (error || contentError) {
    return <div>Error loading course: {error?.message || contentError?.message}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="mb-4"
        >
          ← Back to Catalog
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{course?.title}</CardTitle>
            <div className="flex items-center text-sm text-gray-500 mt-2">
              <span className="mr-4">Duration: {course?.duration}</span>
              <span>Level: {course?.level}</span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">{course?.description}</p>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Course Content</h2>
              <div className="space-y-4">
                {contentList?.map((content) => (
                  <Card key={content.id}>
                    <CardContent className="py-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{content.title}</h3>
                        <p className="text-sm text-gray-500">{content.contentType} • {content.duration}</p>
                      </div>
                      <div className="flex space-x-2">
                        {content.isCompleted ? (
                          <span className="text-green-600 text-sm">✓ Completed</span>
                        ) : (
                          <Button 
                            onClick={() => router.push(`/content/${content.id}`)}
                          >
                            {content.contentType === 'quiz' ? 'Take Quiz' : 'Start'}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-4">
              <Button 
                className="flex-1"
                onClick={() => {
                  // Start the first content item
                  if (contentList && contentList.length > 0) {
                    router.push(`/content/${contentList[0].id}`);
                  }
                }}
              >
                Start Course
              </Button>
              <Button variant="outline" className="flex-1">
                Bookmark
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};