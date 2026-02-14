import React, { useEffect } from 'react';

// Focus management and skip links for accessibility

/**
 * Component to manage focus management and skip links
 */
export const FocusManager: React.FC = () => {
  useEffect(() => {
    // Set up focus management for accessibility
    const handleFirstTab = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        document.body.classList.add('user-is-tabbing');
        window.removeEventListener('keydown', handleFirstTab);
      }
    };

    window.addEventListener('keydown', handleFirstTab);

    // Clean up event listener
    return () => {
      window.removeEventListener('keydown', handleFirstTab);
    };
  }, []);

  return (
    <>
      {/* Skip to main content link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Skip to main content
      </a>
      
      {/* Skip to navigation link */}
      <a 
        href="#navigation" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Skip to navigation
      </a>
      
      {/* Skip to search link */}
      <a 
        href="#search" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Skip to search
      </a>
    </>
  );
};

/**
 * Component to manage focus restoration after modal closes
 */
interface FocusRestorationProps {
  children: React.ReactNode;
  restoreFocusTo?: HTMLElement | null;
}

export const FocusRestoration: React.FC<FocusRestorationProps> = ({ 
  children, 
  restoreFocusTo 
}) => {
  useEffect(() => {
    // Store the currently focused element
    const previousActiveElement = document.activeElement as HTMLElement;

    // Clean up function to restore focus
    return () => {
      if (restoreFocusTo && restoreFocusTo.focus) {
        restoreFocusTo.focus();
      } else if (previousActiveElement && previousActiveElement.focus) {
        previousActiveElement.focus();
      }
    };
  }, [restoreFocusTo]);

  return <>{children}</>;
};

/**
 * Component to manage focus traps for modals and dialogs
 */
interface FocusTrapProps {
  children: React.ReactNode;
  isActive: boolean;
  initialFocusRef?: React.RefObject<HTMLElement>;
}

export const FocusTrap: React.FC<FocusTrapProps> = ({ 
  children, 
  isActive, 
  initialFocusRef 
}) => {
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isActive || !wrapperRef.current) return;

    const focusableElements = wrapperRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey && document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    };

    document.addEventListener('keydown', handleTabKey);

    // Focus the initial element if provided
    if (initialFocusRef?.current) {
      initialFocusRef.current.focus();
    } else if (firstElement) {
      firstElement.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isActive, initialFocusRef]);

  return <div ref={wrapperRef}>{children}</div>;
};

/**
 * Component to highlight focused elements for better visibility
 */
export const FocusIndicator: React.FC = () => {
  useEffect(() => {
    const handleMouseDown = () => {
      document.body.classList.remove('user-is-tabbing');
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        document.body.classList.add('user-is-tabbing');
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return null;
};

/**
 * Utility function to programmatically focus an element
 */
export const focusElement = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.focus();
  }
};

/**
 * Utility function to focus the first focusable element in a container
 */
export const focusFirstElement = (containerId: string) => {
  const container = document.getElementById(containerId);
  if (container) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;
    
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }
};

/**
 * Component to manage focus for error messages
 */
interface ErrorFocusProps {
  hasError: boolean;
  elementId: string;
}

export const ErrorFocus: React.FC<ErrorFocusProps> = ({ hasError, elementId }) => {
  React.useEffect(() => {
    if (hasError) {
      const element = document.getElementById(elementId);
      if (element) {
        element.setAttribute('tabindex', '-1');
        element.focus();
        
        // Remove tabindex after focusing to maintain semantic structure
        const removeTabIndex = () => {
          element.removeAttribute('tabindex');
          element.removeEventListener('blur', removeTabIndex);
        };
        
        element.addEventListener('blur', removeTabIndex);
      }
    }
  }, [hasError, elementId]);

  return null;
};