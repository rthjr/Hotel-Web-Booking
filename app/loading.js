import React from 'react';

const Loading = ({ message = "Loading" }) => {
    return (
        <div className="min-h-screen w-full flex justify-center items-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
            <div className="flex flex-col items-center space-y-6 p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                
                {/* Styled spinner with accessibility */}
                <div className="relative" role="status" aria-label="Loading">
                    <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>
                    <div
                        className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-blue-300 rounded-full animate-spin opacity-50"
                        style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
                    ></div>
                </div>

                {/* Message and animated dots */}
                <div className="text-center">
                    <p className="text-muted-foreground dark:text-gray-200 text-lg font-medium">{message}</p>
                    <div className="flex justify-center mt-2 space-x-1">
                        {[0, 150, 300].map((delay, index) => (
                            <div
                                key={index}
                                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                                style={{ animationDelay: `${delay}ms` }}
                            ></div>
                        ))}
                    </div>
                </div>

                {/* Optional background shimmer effect */}
                {/* <div className="absolute w-full h-full bg-gradient-to-br from-gray-50 to-blue-50 animate-pulse opacity-10" /> */}
            </div>
        </div>
    );
};

export default Loading;
