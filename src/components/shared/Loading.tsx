import React from "react";
import { LineSpinner } from "ldrs/react";
import "ldrs/react/LineSpinner.css";

interface LoadingProps {
  loading: boolean;
}

const Loading: React.FC<LoadingProps> = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="max-w-7xl mx-auto h-screen flex justify-center items-center">
      <div className="text-center">
        {/* Light mode spinner */}
        <div className="block dark:hidden">
          <LineSpinner size="40" stroke="3" speed="1" color="black" />
        </div>

        {/* Dark mode spinner */}
        <div className="hidden dark:block">
          <LineSpinner size="40" stroke="3" speed="1" color="white" />
        </div>
      </div>
    </div>
  );
};

export default Loading;
