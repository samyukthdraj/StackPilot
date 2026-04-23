"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TruncatedTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export const TruncatedText: React.FC<TruncatedTextProps> = ({ text, className = "", delay = 350 }) => {
  const [isTruncated, setIsTruncated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const checkTruncation = useCallback(() => {
    if (textRef.current) {
      // Small buffer to avoid flickering
      setIsTruncated(textRef.current.scrollWidth > textRef.current.clientWidth + 1);
    }
  }, []);

  useEffect(() => {
    checkTruncation();
    // Use ResizeObserver for more robust truncation detection
    if (textRef.current && typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(checkTruncation);
      observer.observe(textRef.current);
      return () => observer.disconnect();
    }
    window.addEventListener('resize', checkTruncation);
    return () => window.removeEventListener('resize', checkTruncation);
  }, [text, checkTruncation]);

  const handleTouchStart = () => {
    if (!isTruncated) return;
    timerRef.current = setTimeout(() => {
      setIsOpen(true);
    }, delay);
  };

  const handleTouchEnd = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsOpen(false);
  };

  return (
    <Tooltip 
      open={isTruncated ? (isOpen || undefined) : false} 
      onOpenChange={(open) => {
        // Only allow Radix to control open state via hover/focus if we aren't in a touch-hold state
        if (!timerRef.current) {
          setIsOpen(open);
        }
      }}
    >
      <TooltipTrigger asChild>
        <div
          ref={textRef}
          className={`truncate select-none md:select-text ${className}`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          onContextMenu={(e) => {
            // Only prevent context menu if we are actually showing the tooltip
            if (isOpen) e.preventDefault();
          }}
        >
          {text}
        </div>
      </TooltipTrigger>
      {isTruncated && (
        <TooltipContent 
          className="max-w-[300px] break-words z-[100]"
          side="top"
        >
          {text}
        </TooltipContent>
      )}
    </Tooltip>
  );
};
