import React, { useRef, useEffect, forwardRef, useImperativeHandle, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Loader } from "lucide-react";

const ChatBox = forwardRef(
    (
        {
            children,
            autoscroll = true,
            scrollToBottom,
            showScrollButton,
            onScroll,
            loadMoreMessages, // function prop for pagination
            hasMoreMessages = false,
            isLoadingMore = false,
            maxHeight = "250px",
            className = "",
        },
        ref
    ) => {
        const containerRef = useRef(null);
        // To store scroll height before loading more messages.
        const prevScrollHeightRef = useRef(null);
        const [isNearTop, setIsNearTop] = useState(false);
        const [initialScrollComplete, setInitialScrollComplete] = useState(false);
        const scrollTimeoutRef = useRef(null);
        const scrollThresholdRef = useRef(100); // Threshold in pixels to trigger loading more messages

        // Expose the scroll container via ref.
        useImperativeHandle(ref, () => ({
            scrollToBottom: () => {
                if (containerRef.current) {
                    containerRef.current.scrollTop = containerRef.current.scrollHeight;
                }
            },
            element: containerRef.current,
        }));

        // Save current scroll height before triggering pagination.
        const handleScroll = (e) => {
            if (onScroll) {
                onScroll(e);
            }
            
            if (containerRef.current) {
                // Clear any existing timeout to prevent multiple triggers
                if (scrollTimeoutRef.current) {
                    clearTimeout(scrollTimeoutRef.current);
                }
                
                // Set a small timeout to debounce scroll events
                scrollTimeoutRef.current = setTimeout(() => {
                    // Check if we're near the top (within threshold)
                    const isNear = containerRef.current.scrollTop < scrollThresholdRef.current;
                    setIsNearTop(isNear);
                    
                    // If scrollTop is near top and we have more messages to load
                    if (isNear && hasMoreMessages && !isLoadingMore && loadMoreMessages && initialScrollComplete) {
                        // Save the current scrollHeight to adjust after messages load
                        prevScrollHeightRef.current = containerRef.current.scrollHeight;
                        loadMoreMessages();
                    }
                }, 150); // Debounce time in ms
            }
        };

        // Effect to handle autoscroll or adjust scroll position after pagination.
        useEffect(() => {
            if (containerRef.current) {
                if (prevScrollHeightRef.current) {
                    // New messages have been prepended.
                    // Adjust scrollTop to maintain the previous scroll position.
                    const newScrollHeight = containerRef.current.scrollHeight;
                    const heightDifference = newScrollHeight - prevScrollHeightRef.current;
                    
                    // Maintain the same relative position
                    containerRef.current.scrollTop = heightDifference + 10; // Add a small offset to show some new content
                    prevScrollHeightRef.current = null;
                } else if (autoscroll && !initialScrollComplete) {
                    containerRef.current.scrollTop = containerRef.current.scrollHeight;
                    setInitialScrollComplete(true);
                }
            }
        }, [children, autoscroll]);

        // Effect to handle window resize
        useEffect(() => {
            const handleResize = () => {
                // Adjust scroll threshold based on container height
                if (containerRef.current) {
                    scrollThresholdRef.current = Math.max(100, containerRef.current.clientHeight * 0.15);
                }
            };
            
            // Set initial threshold
            handleResize();
            
            // Add resize listener
            window.addEventListener('resize', handleResize);
            
            return () => {
                window.removeEventListener('resize', handleResize);
                if (scrollTimeoutRef.current) {
                    clearTimeout(scrollTimeoutRef.current);
                }
            };
        }, []);

        return (
            <div
                className={`relative overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent ${className}`}
                ref={containerRef}
                onScroll={handleScroll}
                style={{ maxHeight: maxHeight }}
            >
                {/* Loading indicator for pagination */}
                {isLoadingMore && (
                    <div className="flex justify-center py-2 mb-2">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center space-x-2"
                        >
                            <Loader size={16} className="animate-spin text-amber-500" />
                            <span className="text-sm text-gray-400">Loading older messages...</span>
                        </motion.div>
                    </div>
                )}
                
                {/* "Load More" button when near top and has more messages */}
                {isNearTop && hasMoreMessages && !isLoadingMore && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full py-2 mb-2 rounded-md bg-gray-800 hover:bg-gray-700 text-amber-500 hover:text-amber-400 transition-colors"
                        onClick={() => {
                            if (containerRef.current) {
                                prevScrollHeightRef.current = containerRef.current.scrollHeight;
                            }
                            loadMoreMessages();
                        }}
                    >
                        Load older messages
                    </motion.button>
                )}
                
                {children}
                
                {/* Scroll to bottom button */}
                <AnimatePresence>
                    {showScrollButton && (
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            onClick={() => {
                                if (scrollToBottom) scrollToBottom();
                            }}
                            className="absolute bottom-5 right-4 p-3 bg-amber-500 text-white rounded-full shadow-lg hover:bg-amber-600 transition-colors"
                        >
                            <ChevronDown size={20} />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        );
    }
);

export default ChatBox;