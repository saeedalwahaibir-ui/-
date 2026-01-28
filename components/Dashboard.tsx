
import React from 'react';
import { BookOpen, Calendar, Clock, CheckCircle2, Zap, Target } from 'lucide-react';
import { DailySchedule, Grade } from '../types';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface DashboardProps {
  grade: Grade;
  schedule: DailySchedule[];
  completedTasks: number;
}

const Dashboard: React.FC<DashboardProps> = ({ grade, schedule, completedTasks }) => {
  const currentPlan = schedule[0];
  const totalTasks = currentPlan ? currentPlan.tasks.length : 0;
  
  const progressData = [
    { name: '٨ صباحاً', progress: 0 },
    { name: '١٢ مساءً', progress: 35 },
    { name: '٤ مساءً', progress: 85 },
    { name: '٨ مساءً', progress: 100 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-6 group hover:shadow-xl transition-all duration-500">
          <div className="bg-blue-100 p-4 rounded-2xl">
            <BookOpen className="text-blue-600 w-8 h-8" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">المستوى</p>
            <p className="text-2xl font-black text-slate-800">الصف {grade}</p>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-6 group hover:shadow-xl transition-all duration-500">
          <div className="bg-green-100 p-4 rounded-2xl">
            <CheckCircle2 className="text-green-600 w-8 h-8" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">جلسات اليوم</p>
            <p className="text-2xl font-black text-slate-800">{completedTasks} / {totalTasks}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-6 group hover:shadow-xl transition-all duration-500">
          <div className="bg-purple-100 p-4 rounded-2xl">
            <Target className="text-purple-600 w-8 h-8" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">الوضع</p>
            <p className="text-2xl font-black text-slate-800">مذاكرة شاملة</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-6 group hover:shadow-xl transition-all duration-500">
          <div className="bg-amber-100 p-4 rounded-2xl">
            <Clock className="text-amber-600 w-8 h-8" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">الإنجاز</p>
            <p className="text-2xl font-black text-slate-800">{Math.round((completedTasks / (totalTasks || 1)) * 100)}%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
          <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">تطور الإنجاز اليومي</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressData}>
                <defs>
                  <linearGradient id="colorProg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} dy={10} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 800, color: '#3b82f6' }}
                />
                <Area type="monotone" dataKey="progress" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorProg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 bg-slate-900 p-10 rounded-[3rem] shadow-xl text-white">
          <h3 className="text-xl font-black mb-8 flex items-center gap-3">
            <Zap className="text-amber-400 w-6 h-6" /> نصائح اليوم
          </h3>
          <div className="space-y-6">
            <div className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-2">
              <p className="text-amber-400 font-black text-sm uppercase tracking-tighter">تذكير المنهج</p>
              <p className="text-slate-300 text-sm font-medium leading-relaxed">ركز على حل الاختبارات التفاعلية بعد كل تلخيص لضمان ثبات المعلومة.</p>
            </div>
            <div className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-2">
              <p className="text-blue-400 font-black text-sm uppercase tracking-tighter">تنظيم الوقت</p>
              <p className="text-slate-300 text-sm font-medium leading-relaxed">جدول اليوم يغطي جميع المواد بانتظام، ابدأ بالمواد العلمية أولاً.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
