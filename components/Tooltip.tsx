import React, { useState } from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  text,
  children,
  position = 'top',
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
  };

  const arrowClasses = {
    top: 'bottom-[-4px] left-1/2 -translate-x-1/2 border-t-white/80 border-l-transparent border-r-transparent border-b-transparent',
    right: 'left-[-4px] top-1/2 -translate-y-1/2 border-r-white/80 border-t-transparent border-b-transparent border-l-transparent',
    bottom: 'top-[-4px] left-1/2 -translate-x-1/2 border-b-white/80 border-l-transparent border-r-transparent border-t-transparent',
    left: 'right-[-4px] top-1/2 -translate-y-1/2 border-l-white/80 border-t-transparent border-b-transparent border-r-transparent',
  };

  return (
    <div className={`relative group inline-block ${className}`}>
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>

      {isVisible && (
        <div className={`absolute z-50 px-3 py-2 bg-white/80 text-black text-xs font-medium rounded-lg whitespace-nowrap pointer-events-none ${positionClasses[position]}`}>
          {text}
          <div className={`absolute w-1 h-1 bg-white/80 border-4 ${arrowClasses[position]}`} />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
