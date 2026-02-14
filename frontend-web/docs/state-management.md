# State Management Guide

## Overview

The Course Companion Web App uses multiple state management solutions depending on the type of state being managed:
- React hooks for component-level state
- Zustand for global application state
- React Query for server state and caching

## Component-Level State

For state that is local to a specific component, we use React's built-in hooks:
- `useState` for simple state values
- `useReducer` for complex state logic
- `useRef` for mutable values that don't trigger re-renders
- `useEffect` for side effects

Example:
```tsx
const [isLoading, setIsLoading] = useState(false);
const [data, setData] = useState<string[]>([]);

const fetchData = async () => {
  setIsLoading(true);
  try {
    const result = await apiService.getData();
    setData(result);
  } catch (error) {
    setError(error);
  } finally {
    setIsLoading(false);
  }
};
```

## Global State with Zustand

For global state that needs to be shared across multiple components, we use Zustand. Zustand provides a lightweight and intuitive solution for global state management.

### Creating a Store

```tsx
import { create } from 'zustand';

interface UserState {
  user: any | null;
  preferences: UserPreferences;
  updateUser: (userData: any) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  reset: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  preferences: {
    theme: 'light',
    language: 'en',
    notificationsEnabled: true,
    accessibilitySettings: {
      fontSize: 'normal',
      contrast: 'normal',
    },
  },
  updateUser: (userData) => set((state) => ({ ...state, user: userData })),
  updatePreferences: (prefs) =>
    set((state) => ({
      ...state,
      preferences: { ...state.preferences, ...prefs },
    })),
  reset: () => 
    set({
      user: null,
      preferences: {
        theme: 'light',
        language: 'en',
        notificationsEnabled: true,
        accessibilitySettings: {
          fontSize: 'normal',
          contrast: 'normal',
        },
      },
    }),
}));
```

### Using a Store

```tsx
import { useUserStore } from '@/store/useUserStore';

const UserProfile = () => {
  const { user, updateUser } = useUserStore();
  
  return (
    <div>
      <h1>{user?.name}</h1>
      <button onClick={() => updateUser({ name: 'New Name' })}>
        Update Name
      </button>
    </div>
  );
};
```

## Server State with React Query

For server state (data that comes from API calls), we use React Query which provides:
- Caching
- Background data fetching
- Automatic refetching
- Optimistic updates
- Error handling

### Basic Query

```tsx
import { useQuery } from '@tanstack/react-query';
import { contentService } from '@/services/contentService';

const CourseContent = ({ courseId }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['course-content', courseId],
    queryFn: () => contentService.getContentByCourse(courseId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.map(item => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  );
};
```

### Mutations

For operations that modify data, we use mutations:

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { progressService } from '@/services/progressService';

const UpdateProgress = ({ contentId, userId }) => {
  const queryClient = useQueryClient();
  
  const updateProgressMutation = useMutation({
    mutationFn: (progressData: any) => 
      progressService.updateProgress(contentId, userId, progressData),
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['progress', contentId] });
    },
  });

  const handleUpdate = () => {
    updateProgressMutation.mutate({
      status: 'completed',
      completionPercentage: 100,
      timeSpentSeconds: 1200,
    });
  };

  return (
    <button onClick={handleUpdate} disabled={updateProgressMutation.isLoading}>
      {updateProgressMutation.isLoading ? 'Updating...' : 'Mark Complete'}
    </button>
  );
};
```

## Authentication State

Authentication state is managed through the AuthContext, which handles:
- User session management
- Token storage and refresh
- Login/logout functionality
- Protected route handling

```tsx
import { useAuth } from '@/context/AuthContext';

const ProtectedComponent = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return <div>Welcome, {user?.name}!</div>;
};
```

## Best Practices

1. **Use the right tool for the job**: Component state for local, global state for shared, server state for API data
2. **Minimize global state**: Only store data that needs to be shared across components
3. **Normalize data**: Store data in a flat structure when possible
4. **Handle loading and error states**: Always provide feedback to users
5. **Use selectors**: Extract only the data you need from stores
6. **Clean up**: Remove listeners and cancel requests when components unmount