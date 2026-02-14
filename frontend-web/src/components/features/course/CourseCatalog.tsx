import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useApiQuery } from '@/hooks/useApiQuery';

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

// Chapter color gradients for visual thumbnails
const CHAPTER_COLORS = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-orange-500 to-red-600',
  'from-purple-500 to-pink-600',
  'from-cyan-500 to-blue-600',
];

const CHAPTER_ICONS = ['🧠', '✍️', '🔍', '🔧', '🤖'];

interface CourseCatalogProps {
  onCourseSelect?: (courseId: string) => void;
}

export const CourseCatalog: React.FC<CourseCatalogProps> = () => {
  const { data: chapters, isLoading, error } = useApiQuery<ContentItem[]>(
    ['courses'],
    '/content/by-course/all'
  );

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Course Catalog</h1>
        <p className="text-gray-500">Loading courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Course Catalog</h1>
        <p className="text-red-500">Error loading courses: {(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Course Catalog</h1>
      <p className="text-gray-600 mb-6">Generative AI Fundamentals &mdash; {chapters?.length || 0} chapters available</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chapters?.map((chapter, index) => {
          const colorClass = CHAPTER_COLORS[index % CHAPTER_COLORS.length];
          const icon = CHAPTER_ICONS[index % CHAPTER_ICONS.length];
          const preview = chapter.content_data
            ? chapter.content_data.replace(/^#.*\n/gm, '').replace(/[#*`]/g, '').trim().substring(0, 120) + '...'
            : 'Course content available.';

          return (
            <Card key={chapter.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className={`h-40 bg-gradient-to-br ${colorClass} relative flex items-center justify-center`}>
                <span className="text-6xl">{icon}</span>
                <div className="absolute top-2 right-2 bg-white/20 backdrop-blur text-white text-xs px-2 py-1 rounded">
                  Chapter {chapter.chapter_number}
                </div>
                {!chapter.is_available && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                    Premium
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{chapter.title}</CardTitle>
                <CardDescription>{chapter.course_id}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">{preview}</p>

                <Link href={`/courses/${chapter.id}`}>
                  <Button className="w-full mb-2">
                    Start Chapter
                  </Button>
                </Link>
                <Link href={`/courses/${chapter.id}`}>
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {(!chapters || chapters.length === 0) && (
        <p className="text-gray-500 text-center py-12">No courses available yet.</p>
      )}
    </div>
  );
};
