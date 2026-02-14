import React, { ReactNode } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface ResponsiveLayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  hideSidebarOnMobile?: boolean;
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ 
  children, 
  sidebar, 
  header, 
  footer,
  hideSidebarOnMobile = true
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      {header && <header className="bg-white shadow-sm z-10">{header}</header>}

      <div className="flex flex-1">
        {/* Sidebar - hidden on mobile if specified */}
        {sidebar && (!hideSidebarOnMobile || !isMobile) && (
          <aside 
            className={`bg-gray-800 text-white ${
              isMobile ? 'fixed inset-y-0 left-0 z-20 w-64' : 
              isTablet ? 'w-16' : 'w-64'
            } transition-all duration-300`}
          >
            {sidebar}
          </aside>
        )}

        {/* Main Content */}
        <main className={`flex-1 ${sidebar && (!hideSidebarOnMobile || !isMobile) ? (isMobile ? 'ml-0' : isTablet ? 'ml-16' : 'ml-64') : 'ml-0'} transition-all duration-300`}>
          <div className="p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      {footer && <footer className="bg-gray-100 border-t">{footer}</footer>}
    </div>
  );
};

// Responsive Grid Component
interface ResponsiveGridProps {
  children: ReactNode;
  cols?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'sm' | 'md' | 'lg' | 'xl';
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({ 
  children, 
  cols = { sm: 1, md: 2, lg: 3, xl: 4 }, 
  gap = 'md' 
}) => {
  const gapClass = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  }[gap];

  const colClass = `grid grid-cols-1 ${
    cols.sm && cols.sm > 1 ? `sm:grid-cols-${cols.sm}` : ''
  } ${
    cols.md && cols.md > 1 ? `md:grid-cols-${cols.md}` : ''
  } ${
    cols.lg && cols.lg > 1 ? `lg:grid-cols-${cols.lg}` : ''
  } ${
    cols.xl && cols.xl > 1 ? `xl:grid-cols-${cols.xl}` : ''
  }`;

  return (
    <div className={`${colClass} ${gapClass}`}>
      {children}
    </div>
  );
};

// Responsive Container Component
interface ResponsiveContainerProps {
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({ 
  children, 
  maxWidth = '2xl', 
  padding = 'md' 
}) => {
  const maxWClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full'
  }[maxWidth];

  const paddingClass = {
    sm: 'px-4 py-2',
    md: 'px-6 py-4',
    lg: 'px-8 py-6',
    xl: 'px-10 py-8'
  }[padding];

  return (
    <div className={`mx-auto ${maxWClass} w-full ${paddingClass}`}>
      {children}
    </div>
  );
};