import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { debounce } from "lodash";

/**
 * ChatBox component for displaying chat messages with scroll functionality
 */
const ChatBox = forwardRef(
  (
    {
      children,
      maxHeight = "100%",
      className = "",
      autoscroll = true,
      onScroll,
      showScrollButton = false,
      loadMoreMessages,
      hasMoreMessages = false,
      isLoadingMore = false,
      darkMode = false
    },
    ref
  ) => {
    const containerRef = useRef(null);
    const [isAtBottom, setIsAtBottom] = useState(true);
    const [isNearBottom, setIsNearBottom] = useState(true);
    const [isAtTop, setIsAtTop] = useState(false);
    
    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      scrollToBottom: () => {
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      },
      getScrollPosition: () => {
        if (!containerRef.current) return { top: 0, bottom: 0 };
        return {
          top: containerRef.current.scrollTop,
          bottom:
            containerRef.current.scrollHeight -
            containerRef.current.scrollTop -
            containerRef.current.clientHeight,
        };
      },
    }));

    // Auto-scroll to bottom on initial render and when children change
    useEffect(() => {
      if (autoscroll && isAtBottom && containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    }, [children, autoscroll, isAtBottom]);

    // Create a debounced scroll handler to improve performance
    const debouncedHandleScroll = debounce(() => {
      if (!containerRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const bottomDistance = scrollHeight - scrollTop - clientHeight;
      
      // Check if we're at the bottom (or very close)
      const atBottom = bottomDistance < 20;
      setIsAtBottom(atBottom);
      
      // Check if we're near the bottom (for showing scroll button)
      const nearBottom = bottomDistance < 200;
      setIsNearBottom(nearBottom);
      
      // Check if we're at the top (for loading more messages)
      const atTop = scrollTop < 50;
      setIsAtTop(atTop);
      
      // Call the onScroll callback with scroll data
      if (onScroll) {
        onScroll({
          isAtBottom: atBottom,
          isNearBottom: nearBottom,
          isAtTop: atTop,
          scrollTop,
          scrollHeight,
          clientHeight,
        });
      }
    }, 100);

    // Handle scroll events
    const handleScroll = (e) => {
      // Call the debounced handler
      debouncedHandleScroll();
    };

    // Scroll to bottom function
    const scrollToBottom = () => {
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    };

    return (
      <div className={`relative ${className}`}>
        {/* Loading indicator for more messages */}
        {isLoadingMore && (
          <div className={`absolute top-0 left-0 right-0 z-10 flex justify-center py-2 ${darkMode ? "bg-gray-900/80" : "bg-white/80"}`}>
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-500"></div>
              <span className="text-xs text-gray-500">Loading older messages...</span>
            </div>
          </div>
        )}

        {/* Main chat container */}
        <div
          ref={containerRef}
          className={`overflow-y-auto ${darkMode ? "scrollbar-dark" : "scrollbar-light"}`}
          style={{ maxHeight }}
          onScroll={handleScroll}
        >
          {/* No more messages indicator */}
          {!hasMoreMessages && !isLoadingMore && children && (
            <div className="text-center py-3">
              <span className="text-xs text-gray-400">Beginning of conversation</span>
            </div>
          )}

          {/* Chat content */}
          <div className="p-4">{children}</div>
        </div>

        {/* Scroll to bottom button */}
        <AnimatePresence>
          {showScrollButton && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              onClick={scrollToBottom}
              className={`absolute bottom-4 right-4 p-2 rounded-full shadow-lg ${
                darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
              } z-10`}
            >
              <ChevronDown size={20} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

ChatBox.displayName = "ChatBox";

export default ChatBox;