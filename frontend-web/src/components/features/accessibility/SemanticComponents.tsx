import React, { ReactNode } from 'react';

// Semantic Article Component
interface ArticleProps {
  children: ReactNode;
  title?: string;
  publishedDate?: string;
  author?: string;
  className?: string;
}

export const Article: React.FC<ArticleProps> = ({ 
  children, 
  title, 
  publishedDate, 
  author, 
  className = '' 
}) => {
  return (
    <article className={`prose max-w-none ${className}`}>
      {title && (
        <header>
          <h1 className="text-2xl font-bold">{title}</h1>
        </header>
      )}
      {(publishedDate || author) && (
        <address className="not-italic text-gray-600">
          {author && <span>By {author}</span>}
          {publishedDate && (
            <time dateTime={publishedDate} className="ml-2">
              {new Date(publishedDate).toLocaleDateString()}
            </time>
          )}
        </address>
      )}
      <div>{children}</div>
    </article>
  );
};

// Semantic Section Component
interface SectionProps {
  children: ReactNode;
  title?: string;
  ariaLabelledBy?: string;
  className?: string;
}

export const Section: React.FC<SectionProps> = ({ 
  children, 
  title, 
  ariaLabelledBy, 
  className = '' 
}) => {
  return (
    <section 
      className={className}
      aria-labelledby={ariaLabelledBy}
    >
      {title && <h2 id={ariaLabelledBy}>{title}</h2>}
      {children}
    </section>
  );
};

// Semantic Navigation Component
interface NavProps {
  children: ReactNode;
  ariaLabel: string;
  className?: string;
}

export const Nav: React.FC<NavProps> = ({ children, ariaLabel, className = '' }) => {
  return (
    <nav aria-label={ariaLabel} className={className}>
      <ul className="flex space-x-4">
        {React.Children.map(children, (child, index) => (
          <li key={index}>{child}</li>
        ))}
      </ul>
    </nav>
  );
};

// Semantic Aside Component
interface AsideProps {
  children: ReactNode;
  title?: string;
  ariaLabel?: string;
  className?: string;
}

export const Aside: React.FC<AsideProps> = ({ 
  children, 
  title, 
  ariaLabel, 
  className = '' 
}) => {
  return (
    <aside 
      className={className}
      aria-label={ariaLabel}
    >
      {title && <h3>{title}</h3>}
      {children}
    </aside>
  );
};

// Semantic Figure Component
interface FigureProps {
  children: ReactNode;
  caption: string;
  className?: string;
}

export const Figure: React.FC<FigureProps> = ({ children, caption, className = '' }) => {
  return (
    <figure className={className}>
      {children}
      <figcaption className="text-sm text-gray-500 mt-2">{caption}</figcaption>
    </figure>
  );
};

// Semantic Header Component
interface HeaderProps {
  children: ReactNode;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ children, className = '' }) => {
  return <header className={className}>{children}</header>;
};

// Semantic Footer Component
interface FooterProps {
  children: ReactNode;
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ children, className = '' }) => {
  return <footer className={className}>{children}</footer>;
};

// Semantic Main Component
interface MainProps {
  children: ReactNode;
  id?: string;
  className?: string;
}

export const Main: React.FC<MainProps> = ({ children, id = 'main-content', className = '' }) => {
  return (
    <main id={id} className={className} tabIndex={-1}>
      {children}
    </main>
  );
};

// Semantic Form Components
interface FormFieldProps {
  label: string;
  id: string;
  children: ReactNode;
  required?: boolean;
  error?: string;
  helpText?: string;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({ 
  label, 
  id, 
  children, 
  required, 
  error, 
  helpText, 
  className = '' 
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label 
        htmlFor={id} 
        className={`block text-sm font-medium mb-1 ${
          error ? 'text-red-700' : 'text-gray-700'
        }`}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {helpText && (
        <p id={`${id}-help`} className="mt-1 text-sm text-gray-500">
          {helpText}
        </p>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

// Semantic Alert Component
interface AlertProps {
  children: ReactNode;
  type?: 'success' | 'error' | 'warning' | 'info';
  ariaLive?: 'polite' | 'assertive';
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({ 
  children, 
  type = 'info', 
  ariaLive = 'polite', 
  className = '' 
}) => {
  const typeClasses = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200'
  };

  return (
    <div 
      role="alert"
      aria-live={ariaLive}
      className={`p-4 rounded border ${typeClasses[type]} ${className}`}
    >
      {children}
    </div>
  );
};

// Semantic Loading Component
interface LoadingSpinnerProps {
  ariaLabel?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  ariaLabel = 'Loading...', 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div 
      className={`inline-block ${sizeClasses[size]} animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] ${className}`}
      role="status"
      aria-label={ariaLabel}
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        {ariaLabel}
      </span>
    </div>
  );
};

// Semantic Empty State Component
interface EmptyStateProps {
  title: string;
  message: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  message, 
  action, 
  icon, 
  className = '' 
}) => {
  return (
    <div 
      className={`text-center py-12 px-4 ${className}`}
      role="status"
      aria-label="Empty state"
    >
      {icon && <div className="flex justify-center mb-4">{icon}</div>}
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-500 mb-6">{message}</p>
      {action && <div>{action}</div>}
    </div>
  );
};