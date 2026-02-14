import { useEffect, useCallback } from 'react';

interface KeyboardNavigationOptions {
  enabled?: boolean;
  onEscape?: () => void;
  onEnter?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onSpace?: () => void;
  onTab?: () => void;
}

/**
 * Custom hook to handle keyboard navigation
 */
export const useKeyboardNavigation = (options: KeyboardNavigationOptions = {}) => {
  const {
    enabled = true,
    onEscape,
    onEnter,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onSpace,
    onTab
  } = options;

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        onEscape?.();
        break;
      case 'Enter':
        event.preventDefault();
        onEnter?.();
        break;
      case 'ArrowUp':
        event.preventDefault();
        onArrowUp?.();
        break;
      case 'ArrowDown':
        event.preventDefault();
        onArrowDown?.();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        onArrowLeft?.();
        break;
      case 'ArrowRight':
        event.preventDefault();
        onArrowRight?.();
        break;
      case ' ':
        event.preventDefault();
        onSpace?.();
        break;
      case 'Tab':
        event.preventDefault();
        onTab?.();
        break;
      default:
        break;
    }
  }, [enabled, onEscape, onEnter, onArrowUp, onArrowDown, onArrowLeft, onArrowRight, onSpace, onTab]);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, handleKeyDown]);
};

/**
 * Hook to manage focus within a component
 */
export const useFocusWithin = (ref: React.RefObject<HTMLElement>, callback?: () => void) => {
  useEffect(() => {
    const element = ref.current;
    if (!element || !callback) return;

    const handleFocusIn = () => {
      callback();
    };

    element.addEventListener('focusin', handleFocusIn);
    return () => {
      element.removeEventListener('focusin', handleFocusIn);
    };
  }, [ref, callback]);
};

/**
 * Hook to manage focus outside a component
 */
export const useFocusOutside = (ref: React.RefObject<HTMLElement>, callback: () => void) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
};

/**
 * Hook to manage keyboard shortcuts
 */
export const useKeyboardShortcuts = (shortcuts: { [key: string]: () => void }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Create a key combination string
      const keys = [];
      if (event.ctrlKey) keys.push('Ctrl');
      if (event.shiftKey) keys.push('Shift');
      if (event.altKey) keys.push('Alt');
      if (event.metaKey) keys.push('Meta');
      
      // Add the actual key
      keys.push(event.key);
      
      const keyCombo = keys.join('+').toLowerCase();
      
      // Check if this combo is registered
      const handler = shortcuts[keyCombo];
      if (handler) {
        event.preventDefault();
        handler();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);
};

/**
 * Hook to manage focus order in a list
 */
export const useListFocus = (count: number, currentIndex: number, setCurrentIndex: (index: number) => void) => {
  useExtendedKeyboardNavigation({
    onArrowUp: () => {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    },
    onArrowDown: () => {
      if (currentIndex < count - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    },
    onHome: () => {
      setCurrentIndex(0);
    },
    onEnd: () => {
      setCurrentIndex(count - 1);
    }
  });
};

// Additional keyboard event handlers
interface ExtendedKeyboardNavigationOptions extends KeyboardNavigationOptions {
  onHome?: () => void;
  onEnd?: () => void;
  onPageUp?: () => void;
  onPageDown?: () => void;
}

/**
 * Extended keyboard navigation hook with additional keys
 */
export const useExtendedKeyboardNavigation = (options: ExtendedKeyboardNavigationOptions = {}) => {
  const {
    enabled = true,
    onEscape,
    onEnter,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onSpace,
    onTab,
    onHome,
    onEnd,
    onPageUp,
    onPageDown
  } = options;

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        onEscape?.();
        break;
      case 'Enter':
        event.preventDefault();
        onEnter?.();
        break;
      case 'ArrowUp':
        event.preventDefault();
        onArrowUp?.();
        break;
      case 'ArrowDown':
        event.preventDefault();
        onArrowDown?.();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        onArrowLeft?.();
        break;
      case 'ArrowRight':
        event.preventDefault();
        onArrowRight?.();
        break;
      case ' ':
        event.preventDefault();
        onSpace?.();
        break;
      case 'Tab':
        event.preventDefault();
        onTab?.();
        break;
      case 'Home':
        event.preventDefault();
        onHome?.();
        break;
      case 'End':
        event.preventDefault();
        onEnd?.();
        break;
      case 'PageUp':
        event.preventDefault();
        onPageUp?.();
        break;
      case 'PageDown':
        event.preventDefault();
        onPageDown?.();
        break;
      default:
        break;
    }
  }, [enabled, onEscape, onEnter, onArrowUp, onArrowDown, onArrowLeft, onArrowRight, onSpace, onTab, onHome, onEnd, onPageUp, onPageDown]);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, handleKeyDown]);
};