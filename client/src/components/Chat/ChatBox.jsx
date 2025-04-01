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
                // Check if we're near the top (within 50px)
                const isNear = containerRef.current.scrollTop < 50;
                setIsNearTop(isNear);
                
                // If scrollTop is near 0 and we have more messages to load
                if (isNear && hasMoreMessages && !isLoadingMore && loadMoreMessages) {
                    // Save the current scrollHeight to adjust after messages load
                    prevScrollHeightRef.current = containerRef.current.scrollHeight;
                    loadMoreMessages();
                }
            }
        };

        // Effect to handle autoscroll or adjust scroll position after pagination.
        useEffect(() => {
            if (containerRef.current) {
                if (prevScrollHeightRef.current) {
                    // New messages have been prepended.
                    // Adjust scrollTop to maintain the previous scroll position.
                    const newScrollHeight = containerRef.current.scrollHeight;
                    containerRef.current.scrollTop =
                        newScrollHeight - prevScrollHeightRef.current;
                    prevScrollHeightRef.current = null;
                } else if (autoscroll) {
                    containerRef.current.scrollTop = containerRef.current.scrollHeight;
                }
            }
        }, [children, autoscroll]);

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
                        className="w-full py-2 mb-2 text-sm text-amber-500 hover:text-amber-400 transition-colors"
                        onClick={loadMoreMessages}
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
                            className="absolute bottom-5 right-4 p-2 bg-amber-500 text-white rounded-full shadow-lg hover:bg-amber-600 transition-colors"
                        >
                            <ChevronDown size={24} />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        );
    }
);

// Display name for debugging
ChatBox.displayName = "ChatBox";

export default ChatBox;