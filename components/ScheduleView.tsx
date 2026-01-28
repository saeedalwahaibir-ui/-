
import React, { useState } from 'react';
import { Sparkles, Plus, Clock as ClockIcon, Calendar as CalendarIcon, Play, Timer, BookOpen, RotateCcw, RefreshCw } from 'lucide-react';
import { DailySchedule, Grade, Semester, StudyTask } from '../types';
import { generateStudySchedule } from '../services/geminiService';
import { OMANI_SUBJECTS } from '../constants';

interface ScheduleViewProps {
  grade: Grade;
  semester: Semester;
  startTime: string;
  onSemesterChange: (s: Semester) => void;
  onScheduleUpdate: (newSchedule: DailySchedule[]) => void;
  onStartSession: (task: { subject: string; duration: number }) => void;
  schedule: DailySchedule[];
}

const ScheduleView: React.FC<ScheduleViewProps> = ({ grade, semester, startTime, onSemesterChange, onScheduleUpdate, onStartSession, schedule }) => {
  const [loading, setLoading] = useState(false);
  const [hoursPerDay, setHoursPerDay] = useState(5);
  const [selectedSubject, setSelectedSubject] = useState('all');

  const handleGenerateAI = async () => {
    setLoading(true);
    try {
      const subjects = OMANI_SUBJECTS[grade];
      const newSchedule = await generateStudySchedule(grade, semester, subjects, hoursPerDay, startTime);
      onScheduleUpdate(newSchedule);
    } catch (error) {
      console.error("Error generating schedule:", error);
      alert("حدث خطأ أثناء توليد الجدول. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const currentDayPlan = schedule[0];
  const subjects = OMANI_SUBJECTS[grade];
  const tasksToDisplay = currentDayPlan 
    ? (selectedSubject === 'all' ? currentDayPlan.tasks : currentDayPlan.tasks.filter(t => t.subject === selectedSubject))
    : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-800">خطة المذاكرة اليومية</h2>
            <p className="text-lg font-medium text-slate-500">جدول ذكي يشمل كافة مواد الصف {grade} لعام 2026</p>
          </div>

          <div className="flex flex-wrap items-center gap-6 xl:gap-8">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-200">
                <BookOpen className="w-5 h-5 text-indigo-500" />
                <span className="text-sm font-bold text-slate-600">المادة:</span>
                <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="bg-transparent text-sm font-black text-indigo-600 outline-none cursor-pointer pr-2">
                  <option value="all">جميع المواد</option>
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <button onClick={handleGenerateAI} disabled={loading} title="تحديث الجدول لهذه المادة" className="flex items-center justify-center bg-indigo-50 text-indigo-600 w-12 h-12 rounded-2xl border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all active:scale-95 disabled:opacity-50">
                {loading ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" /> : <RotateCcw className="w-5 h-5" />}
              </button>
            </div>

            <div className="hidden lg:block w-px h-10 bg-slate-100"></div>

            <div className="flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-200">
              <Timer className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-bold text-slate-600">الساعات:</span>
              <input type="number" value={hoursPerDay} onChange={(e) => setHoursPerDay(Number(e.target.value))} className="w-12 bg-transparent text-center font-black text-blue-600 outline-none" min="1" max="18" />
            </div>

            <button onClick={handleGenerateAI} disabled={loading} className="flex items-center gap-4 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-lg transition-all shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95 disabled:opacity-50">
              {loading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : <RefreshCw className="w-6 h-6" />}
              تحديث الخطة
            </button>
          </div>
        </div>
      </div>

      {currentDayPlan ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3"><div className="w-2 h-8 bg-blue-600 rounded-full" />تسلسل الجلسات</h3>
                {selectedSubject !== 'all' && <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-1 rounded-full border border-indigo-100">عرض: {selectedSubject}</span>}
              </div>
              <div className="relative space-y-8 pr-4">
                <div className="absolute top-0 bottom-0 right-3.5 w-0.5 bg-slate-100" />
                {tasksToDisplay.length > 0 ? tasksToDisplay.map((task, tidx) => (
                  <div key={tidx} className="relative group pr-12">
                    <div className={`absolute right-1.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-4 border-white shadow-sm z-10 ${task.isPriority ? 'bg-amber-500' : 'bg-blue-500'}`} />
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-[2rem] border bg-slate-50/50 border-slate-100 hover:bg-white hover:border-blue-200 transition-all">
                      <div className="flex items-center gap-6">
                        <div className="text-center min-w-[70px]"><span className="block text-xs font-black text-slate-400 uppercase tracking-tighter mb-1">يبدأ</span><span className="text-lg font-black text-slate-700 font-mono">{task.time}</span></div>
                        <div className="h-10 w-px bg-slate-200 hidden md:block" />
                        <div>
                          <span className="text-[10px] font-black px-2.5 py-1 rounded-lg border bg-blue-100 text-blue-700 border-blue-200 mb-1 inline-block">{task.subject}</span>
                          <h4 className="text-lg font-black text-slate-800">{task.topic}</h4>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 w-full md:w-auto border-t md:border-t-0 border-slate-100 mt-4 md:mt-0 pt-4 md:pt-0">
                        <span className="flex items-center gap-2 text-slate-400 font-bold text-sm"><ClockIcon className="w-4 h-4" /> {task.duration} دقيقة</span>
                        <button onClick={() => onStartSession({ subject: task.subject, duration: task.duration })} className="flex-1 md:flex-none flex items-center justify-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-xl font-black text-sm shadow-md hover:bg-blue-700"><Play className="w-4 h-4 fill-current" /> ابدأ</button>
                      </div>
                    </div>
                  </div>
                )) : <div className="py-20 text-center text-slate-400 font-bold">لا توجد جلسات لهذه المادة اليوم</div>}
              </div>
            </div>
          </div>
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white h-fit shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
             <h3 className="text-xl font-black mb-6 flex items-center gap-3"><BookOpen className="w-6 h-6 text-blue-400" /> إحصاءات الخطة</h3>
             <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex justify-between"><span className="text-slate-400">عدد المواد</span><span className="font-black">{OMANI_SUBJECTS[grade].length} مواد</span></div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex justify-between"><span className="text-slate-400">إجمالي الساعات</span><span className="font-black">{hoursPerDay} ساعات</span></div>
             </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[3rem] p-32 text-center border border-slate-100 shadow-sm">
          <CalendarIcon className="w-32 h-32 text-blue-100 mx-auto mb-8" />
          <h3 className="text-3xl font-black text-slate-400">لا توجد خطة مفعلة</h3>
          <p className="text-slate-400 mt-4 text-xl">حدث الخطة للحصول على جدول يومي</p>
        </div>
      )}
    </div>
  );
};

export default ScheduleView;
