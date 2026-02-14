import React from 'react';
import { Button } from '@/components/ui/Button';
import { useApiQuery } from '@/hooks/useApiQuery';
import Link from 'next/link';

interface CourseNavigationProps {
  courseId: string;
  currentContentId: string;
}

interface ContentItem {
  id: string;
  title: string;
  chapter_number: number;
  section_number: number;
  is_completed: boolean;
}

export const CourseNavigation: React.FC<CourseNavigationProps> = ({ 
  courseId, 
  currentContentId 
}) => {
  const { data: contentList, isLoading, error } = useApiQuery<ContentItem[]>(
    ['course-content-nav', courseId],
    `/content/by-course/${courseId}`
  );

  if (isLoading) {
    return <div>Loading navigation...</div>;
  }

  if (error) {
    return <div>Error loading navigation: {(error as Error).message}</div>;
  }

  // Find current content index
  const currentIndex = contentList?.findIndex(c => c.id === currentContentId) || -1;
  const prevContent = currentIndex > 0 ? contentList?.[currentIndex - 1] : null;
  const nextContent = currentIndex < (contentList?.length || 0) - 1 ? contentList?.[currentIndex + 1] : null;

  return (
    <div className="bg-white border rounded-lg p-4 mb-6">
      <h3 className="font-semibold mb-3">Course Navigation</h3>
      
      <div className="space-y-2">
        {contentList?.map((content, index) => (
          <Link 
            key={content.id} 
            href={`/content/${content.id}`}
            className={`block p-2 rounded ${
              content.id === currentContentId 
                ? 'bg-blue-100 border-l-4 border-blue-500' 
                : 'hover:bg-gray-100'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className={`truncate ${content.id === currentContentId ? 'font-bold' : ''}`}>
                {content.chapter_number}.{content.section_number} {content.title}
              </span>
              {content.is_completed && (
                <span className="text-green-500 ml-2">✓</span>
              )}
            </div>
          </Link>
        ))}
      </div>
      
      <div className="flex justify-between mt-4">
        {prevContent ? (
          <Link href={`/content/${prevContent.id}`}>
            <Button variant="outline">
              ← Previous: {prevContent.title}
            </Button>
          </Link>
        ) : (
          <div></div> // Spacer
        )}
        
        {nextContent ? (
          <Link href={`/content/${nextContent.id}`}>
            <Button>
              Next: {nextContent.title} →
            </Button>
          </Link>
        ) : (
          <div></div> // Spacer
        )}
      </div>
    </div>
  );
};