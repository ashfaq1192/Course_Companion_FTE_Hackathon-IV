import React, { useEffect } from 'react';

// Accessibility utility functions and components

/**
 * Hook to manage focus trap for modal dialogs
 */
export const useFocusTrap = (isActive: boolean, dialogRef: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    if (!isActive || !dialogRef.current) return;

    const focusableElements = dialogRef.current.querySelectorAll(
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

    // Focus the first element when dialog opens
    firstElement?.focus();

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isActive, dialogRef]);
};

/**
 * Component to announce screen reader messages
 */
interface ScreenReaderAnnouncerProps {
  message: string;
  isVisible?: boolean;
}

export const ScreenReaderAnnouncer: React.FC<ScreenReaderAnnouncerProps> = ({ 
  message, 
  isVisible = true 
}) => {
  if (!isVisible) return null;

  return (
    <div 
      className="sr-only" 
      aria-live="polite" 
      aria-atomic="true"
    >
      {message}
    </div>
  );
};

/**
 * Skip link component for keyboard navigation
 */
export const SkipLink: React.FC = () => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a 
      href="#main-content" 
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded focus:shadow-lg"
      onClick={handleClick}
    >
      Skip to main content
    </a>
  );
};

/**
 * Accessible modal component
 */
interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  ariaDescribedBy?: string;
}

export const AccessibleModal: React.FC<AccessibleModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  ariaDescribedBy 
}) => {
  const dialogRef = React.useRef<HTMLDivElement>(null);
  useFocusTrap(isOpen, dialogRef);

  // Close modal on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
      aria-describedby={ariaDescribedBy}
    >
      <div 
        ref={dialogRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden"
        tabIndex={-1}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 
            id="modal-title" 
            className="text-lg font-semibold"
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
          >
            <span className="text-xl">×</span>
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * Accessible toggle switch component
 */
interface AccessibleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  id?: string;
  disabled?: boolean;
}

export const AccessibleSwitch: React.FC<AccessibleSwitchProps> = ({ 
  checked, 
  onChange, 
  label, 
  id, 
  disabled = false 
}) => {
  const switchId = id || `switch-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="flex items-center">
      <label 
        htmlFor={switchId}
        className="relative inline-flex items-center cursor-pointer"
      >
        <input
          type="checkbox"
          id={switchId}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
          role="switch"
          aria-checked={checked}
        />
        <span 
          className={`w-11 h-6 rounded-full transition-colors ease-in-out duration-200 ${
            checked 
              ? 'bg-blue-600' 
              : 'bg-gray-300'
          } ${disabled ? 'opacity-50' : 'cursor-pointer'}`}
        ></span>
        <span 
          className={`absolute left-1 top-1 bg-white border rounded-full w-4 h-4 transition-transform ease-in-out duration-200 ${
            checked ? 'transform translate-x-5' : ''
          }`}
        ></span>
      </label>
      <label 
        htmlFor={switchId}
        className={`ml-3 text-sm font-medium ${
          disabled ? 'text-gray-400' : 'text-gray-700'
        }`}
      >
        {label}
      </label>
    </div>
  );
};

/**
 * Accessible data table component
 */
interface AccessibleTableProps {
  headers: string[];
  rows: any[][];
  caption?: string;
  className?: string;
}

export const AccessibleTable: React.FC<AccessibleTableProps> = ({ 
  headers, 
  rows, 
  caption, 
  className = '' 
}) => {
  return (
    <div className="overflow-x-auto">
      <table 
        className={`min-w-full divide-y divide-gray-200 ${className}`}
        role="table"
      >
        {caption && (
          <caption className="sr-only">
            {caption}
          </caption>
        )}
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header, index) => (
              <th 
                key={index}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                role="columnheader"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} role="row">
              {row.map((cell, cellIndex) => (
                <td 
                  key={cellIndex}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  role="cell"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};