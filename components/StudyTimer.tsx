
import React, { useState, useEffect } from 'react';
import { Play, Pause, X, RotateCcw, CheckCircle } from 'lucide-react';

interface StudyTimerProps {
  task: { subject: string; duration: number };
  onClose: () => void;
  onComplete: () => void;
}

const StudyTimer: React.FC<StudyTimerProps> = ({ task, onClose, onComplete }) => {
  const [seconds, setSeconds] = useState(task.duration * 60);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: any = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((s) => s - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      onComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, onComplete]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((task.duration * 60 - seconds) / (task.duration * 60)) * 100;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-[3rem] p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-black text-slate-800">جلسة مذاكرة</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="text-center space-y-4 mb-10">
          <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-bold border border-blue-100 mb-2">
            {task.subject}
          </div>
          <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
            {/* Simple circular progress via SVG */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="96" cy="96" r="88"
                fill="transparent"
                stroke="#f1f5f9"
                strokeWidth="8"
              />
              <circle
                cx="96" cy="96" r="88"
                fill="transparent"
                stroke="#3b82f6"
                strokeWidth="8"
                strokeDasharray={552.92}
                strokeDashoffset={552.92 - (552.92 * progress) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="text-5xl font-black text-slate-800 font-mono tracking-tighter">
              {formatTime(seconds)}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6">
          <button 
            onClick={() => setSeconds(task.duration * 60)}
            className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:text-slate-600 transition-all"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
          
          <button 
            onClick={() => setIsActive(!isActive)}
            className={`w-20 h-20 flex items-center justify-center rounded-[2rem] text-white shadow-xl transition-all ${isActive ? 'bg-amber-500 shadow-amber-200 rotate-180' : 'bg-blue-600 shadow-blue-200'}`}
          >
            {isActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 fill-current" />}
          </button>

          <button 
            onClick={onComplete}
            className="p-4 bg-green-50 text-green-500 rounded-2xl hover:bg-green-100 transition-all"
          >
            <CheckCircle className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudyTimer;
