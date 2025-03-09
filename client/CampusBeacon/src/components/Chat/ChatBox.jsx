import React, { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const ChatBox = forwardRef(
    (
        {
            children,
            autoscroll = true,
            scrollToBottom,
            showScrollButton,
            onScroll,
            loadMoreMessages, // new function prop for pagination
            maxHeight = "250px",
        },
        ref
    ) => {
        const containerRef = useRef(null);
        // To store scroll height before loading more messages.
        const prevScrollHeightRef = useRef(null);

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
            // If scrollTop is 0, load more messages (pagination).
            if (containerRef.current && containerRef.current.scrollTop === 0 && loadMoreMessages) {
                // Save the current scrollHeight to adjust after messages load.
                prevScrollHeightRef.current = containerRef.current.scrollHeight;
                loadMoreMessages();
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
                className="relative overflow-y-5 p-4"
                ref={containerRef}
                onScroll={handleScroll}
                style={{ maxHeight: maxHeight }}
            >
                {children}
                <AnimatePresence>
                    {showScrollButton && (
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            onClick={() => {
                                if (scrollToBottom) scrollToBottom();
                            }}
                            className="absolute bottom-5 right-4 p-2 bg-purple-500 text-white rounded-full shadow-lg hover:bg-purple-600 transition-colors"
                        >
                            <ChevronDown size={24} />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        );
    }
);

export default ChatBox;