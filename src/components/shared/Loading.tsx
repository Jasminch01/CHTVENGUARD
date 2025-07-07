import React from "react";

interface LoadingProps {
  loading: boolean;
}

const Loading: React.FC<LoadingProps> = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="max-w-7xl mx-auto p-4 h-screen flex justify-center items-center">
      <div className="text-center">
        <div className="animate-spin rounded-full size-8 md:size-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p>Loading news...</p>
      </div>
    </div>
  );
};

export default Loading;
