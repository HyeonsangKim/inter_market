import React from "react";

const ChatListLoading = () => {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold">채팅</h2>
      </div>
      <div className="overflow-y-auto">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex items-center p-3 hover:bg-gray-100">
            <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="ml-3 flex-grow">
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-3/4 mt-2 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatListLoading;
