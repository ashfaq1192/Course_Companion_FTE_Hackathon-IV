import { Alert } from '@/components/features/accessibility/SemanticComponents';

interface ApiError {
  status: number;
  message: string;
  details?: string;
}

class ErrorHandler {
  /**
   * Handle API errors and return a user-friendly message
   */
  public handleApiError(error: any): ApiError {
    console.error('API Error:', error);

    // Check if it's an Axios error
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const message = error.response.data?.message || error.response.statusText || 'An error occurred';
      const details = error.response.data?.details;

      return { status, message, details };
    } else if (error.request) {
      // Request was made but no response received
      return {
        status: 0,
        message: 'Network error: Unable to reach the server',
        details: 'Please check your internet connection and try again'
      };
    } else {
      // Something else happened
      return {
        status: 0,
        message: error.message || 'An unexpected error occurred',
        details: error.stack
      };
    }
  }

  /**
   * Render an error message component
   */
  public renderErrorMessage(error: ApiError, onRetry?: () => void) {
    const getErrorType = (status: number): 'error' | 'warning' | 'info' => {
      if (status >= 500) return 'error'; // Server errors
      if (status >= 400) return 'warning'; // Client errors
      return 'info'; // Other errors
    };

    const errorType = getErrorType(error.status);
    const errorMessage = this.formatErrorMessage(error);

    return (
      <Alert type={errorType} ariaLive="assertive">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold">Error {error.status}</h3>
            <p>{errorMessage}</p>
            {error.details && (
              <details className="mt-2">
                <summary className="cursor-pointer text-sm text-gray-600">Show details</summary>
                <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                  {error.details}
                </pre>
              </details>
            )}
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="ml-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Retry
            </button>
          )}
        </div>
      </Alert>
    );
  }

  /**
   * Format error message for user display
   */
  private formatErrorMessage(error: ApiError): string {
    switch (error.status) {
      case 400:
        return error.message || 'Bad request: Please check your input and try again';
      case 401:
        return 'Unauthorized: Please log in to continue';
      case 403:
        return 'Forbidden: You do not have permission to access this resource';
      case 404:
        return 'Not found: The requested resource could not be found';
      case 429:
        return 'Too many requests: Please wait before trying again';
      case 500:
        return 'Internal server error: Please try again later';
      case 502:
        return 'Gateway error: Service temporarily unavailable';
      case 503:
        return 'Service unavailable: Please try again later';
      case 504:
        return 'Gateway timeout: Request took too long to process';
      default:
        if (error.status === 0) {
          return error.message || 'Network error: Unable to connect to the server';
        }
        return error.message || 'An error occurred';
    }
  }

  /**
   * Log error for monitoring
   */
  public logError(error: any, context?: string) {
    // In a real application, this would send the error to a monitoring service
    console.group('Error Log');
    console.error('Context:', context || 'General');
    console.error('Error:', error);
    console.error('Timestamp:', new Date().toISOString());
    console.groupEnd();
  }

  /**
   * Handle authentication errors specifically
   */
  public handleAuthError(error: any) {
    const apiError = this.handleApiError(error);
    
    if (apiError.status === 401) {
      // Clear auth tokens and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    
    return apiError;
  }

  /**
   * Validate response data
   */
  public validateResponseData(response: any, requiredFields: string[]): boolean {
    if (!response) {
      throw new Error('Response is null or undefined');
    }

    for (const field of requiredFields) {
      if (!(field in response)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    return true;
  }

  /**
   * Handle validation errors from form submissions
   */
  public handleValidationErrors(errors: { [key: string]: string[] }): string[] {
    const errorMessages: string[] = [];
    
    Object.entries(errors).forEach(([field, fieldErrors]) => {
      fieldErrors.forEach(error => {
        errorMessages.push(`${field}: ${error}`);
      });
    });
    
    return errorMessages;
  }
}

export default new ErrorHandler();