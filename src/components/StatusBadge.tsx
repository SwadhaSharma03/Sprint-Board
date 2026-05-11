import React from 'react';
import { Zap } from 'lucide-react';

interface StatusBadgeProps {
  text?: string;
  imageSrc?: string;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  text = "Mock API Engine v2.4 Active",
  imageSrc,
  className = ""
}) => {
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-400 text-sm backdrop-blur-sm ${className}`}>
      {imageSrc ? (
        <img src={imageSrc} alt="Status" className="h-7 w-auto object-contain" />
      ) : (
        <>
          <Zap size={14} className="text-violet-400" />
          <span>{text}</span>
        </>
      )}
    </div>
  );
};

export default StatusBadge;
