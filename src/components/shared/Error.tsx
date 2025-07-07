import React from "react";

interface ErrorProps {
  error: string;
  onRetry?: () => void;
}

const ErrorComponent: React.FC<ErrorProps> = ({ onRetry }) => {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="mb-5">
      <div className="max-w-7xl h-screen flex justify-center items-center mx-auto px-4 lg:px-0">
        <div className="text-center py-8">
          <div className="">
            <h2 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">
              Something went Wrong
            </h2>
            {/* <p className="text-red-600 dark:text-red-300 mb-4">{error}</p> */}
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors duration-200 cursor-pointer"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorComponent;
