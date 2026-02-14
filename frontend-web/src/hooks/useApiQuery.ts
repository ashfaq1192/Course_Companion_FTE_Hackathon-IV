import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import apiService from '@/services/api';

// Generic hook for API queries
export const useApiQuery = <TData, TError = Error>(
  queryKey: string[],
  endpoint: string,
  options?: Omit<UseQueryOptions<TData, TError, TData, string[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<TData, TError, TData, string[]>({
    queryKey,
    queryFn: () => apiService.get<TData>(endpoint).then(res => res.data),
    ...options,
  });
};

// Generic hook for API mutations
export const useApiMutation = <TData = unknown, TVariables = void, TError = Error>(
  mutationFn: (variables: TVariables) => Promise<any>,
  options?: Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'>
) => {
  return useMutation<TData, TError, TVariables>({
    mutationFn,
    ...options,
  });
};

// Specific hooks for common operations
export const useContent = (contentId: string) => {
  return useApiQuery(
    ['content', contentId],
    `/content/${contentId}`,
    {
      enabled: !!contentId,
    }
  );
};

export const useCourseContent = (courseId: string) => {
  return useApiQuery(
    ['course-content', courseId],
    `/content/by-course/${courseId}`
  );
};

export const useUserProgress = (userId: string) => {
  return useApiQuery(
    ['user-progress', userId],
    `/progress/user/${userId}`
  );
};

export const useQuizQuestions = (contentId: string) => {
  return useApiQuery(
    ['quiz-questions', contentId],
    `/quizzes/${contentId}/questions`
  );
};