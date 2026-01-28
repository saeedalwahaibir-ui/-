
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  CalendarDays, 
  FileText, 
  Settings as SettingsIcon, 
  Bell, 
  GraduationCap,
  ChevronLeft,
  Search,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Grade, Semester, DailySchedule, Notification, AppSettings } from './types';
import Dashboard from './components/Dashboard';
import ScheduleView from './components/ScheduleView';
import SummaryTool from './components/SummaryTool';
import Settings from './components/Settings';
import StudyTimer from './components/StudyTimer';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'schedule' | 'summarize' | 'settings'>('dashboard');
  const [grade, setGrade] = useState<Grade>(Grade.G10);
  const [semester, setSemester] = useState<Semester>(Semester.S1);
  const [schedule, setSchedule] = useState<DailySchedule[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeSession, setActiveSession] = useState<{ subject: string; duration: number } | null>(null);

  // Onboarding state
  const [hasOnboarded, setHasOnboarded] = useState<boolean>(() => {
    return localStorage.getItem('mudhakir_onboarded') === 'true';
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('mudhakir_settings');
    return saved ? JSON.parse(saved) : {
      studentName: '',
      defaultStartTime: '16:00',
      notificationsEnabled: true,
      reminderInterval: 10
    };
  });

  useEffect(() => {
    localStorage.setItem('mudhakir_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (hasOnboarded) {
      localStorage.setItem('mudhakir_onboarded', 'true');
    }
  }, [hasOnboarded]);

  useEffect(() => {
    if (hasOnboarded && settings.studentName) {
      const timer = setTimeout(() => {
        setNotifications([
          { id: '1', message: `تنبيه: حان وقت مراجعة الكيمياء يا ${settings.studentName}!`, time: new Date(), isRead: false },
          { id: '2', message: 'مبارك! تم إنشاء جدولك الذكي لعام 2026', time: new Date(), isRead: false },
          { id: '3', message: 'تذكير: اختبار الأحياء الأسبوع القادم، استعد جيداً', time: new Date(), isRead: false }
        ]);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [hasOnboarded, settings.studentName]);

  const handleOnboardingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (settings.studentName.trim()) {
      setHasOnboarded(true);
    } else {
      alert("يرجى إدخال اسمك للبدء");
    }
  };

  if (!hasOnboarded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-['Tajawal']">
        <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl shadow-blue-200/50 p-10 border border-slate-100 animate-in fade-in zoom-in duration-500">
          <div className="text-center mb-10">
            <div className="inline-block bg-gradient-to-br from-blue-600 to-indigo-700 p-5 rounded-[2rem] shadow-xl shadow-blue-200 mb-6">
              <GraduationCap className="text-white w-12 h-12" />
            </div>
            <h1 className="text-3xl font-black text-slate-800 mb-3">مرحباً بك في "مُذاكر"</h1>
            <p className="text-slate-500 font-bold">لنقم بتجهيز بيئة مذاكرتك الذكية لعام 2026</p>
          </div>
          <form onSubmit={handleOnboardingSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-400 pr-2 uppercase tracking-wider">اسمك الكريم</label>
              <input type="text" required placeholder="أدخل اسمك هنا..." value={settings.studentName} onChange={(e) => setSettings({ ...settings, studentName: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-400 pr-2 uppercase tracking-wider">الصف الدراسي</label>
              <select value={grade} onChange={(e) => setGrade(e.target.value as Grade)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer">
                {Object.values(Grade).map(g => <option key={g} value={g}>الصف {g}</option>)}
              </select>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xl shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group">
              ابدأ رحلة النجاح <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
          <div className="mt-8 flex items-center justify-center gap-2 text-blue-600/50">
            <Sparkles className="w-4 h-4" /> <p className="text-xs font-black">المنهج العماني المعتمد 2026</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#f8fafc]">
      {activeSession && <StudyTimer task={activeSession} onClose={() => setActiveSession(null)} onComplete={() => { setActiveSession(null); alert("أحسنت! لقد أنهيت جلسة المذاكرة بنجاح."); }} />}
      <aside className="w-72 bg-white border-l border-slate-100 fixed h-full z-20 hidden md:block">
        <div className="p-8 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-12">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2.5 rounded-2xl shadow-lg shadow-blue-200/50"><GraduationCap className="text-white w-7 h-7" /></div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">مُذاكر</h1>
          </div>
          <nav className="space-y-2 flex-1">
            {[
              { id: 'dashboard', icon: LayoutDashboard, label: 'لوحة التحكم' },
              { id: 'schedule', icon: CalendarDays, label: 'جدول المذاكرة' },
              { id: 'summarize', icon: FileText, label: 'الملخصات والملفات' },
              { id: 'settings', icon: SettingsIcon, label: 'الإعدادات' },
            ].map((item) => (
              <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${activeTab === item.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' : 'text-slate-500 hover:bg-slate-50'}`}>
                <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'text-slate-400'}`} />
                <span className="font-bold">{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="mt-auto pt-8">
            <div className="bg-slate-900 p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
              <p className="text-xs text-slate-400 mb-1 font-medium">المنهج العماني المعتمد</p>
              <p className="text-white font-black mb-5 text-lg">إصدار 2026</p>
              <div className="space-y-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">الصف الدراسي</span>
                  <select value={grade} onChange={(e) => setGrade(e.target.value as Grade)} className="w-full bg-white/10 backdrop-blur-sm border border-white/10 text-white rounded-xl px-3 py-2 text-sm font-bold outline-none cursor-pointer appearance-none">
                    {Object.values(Grade).map(g => <option key={g} value={g} className="text-slate-800">الصف {g}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 md:mr-72 p-4 md:p-10 pb-24 md:pb-10">
        <header className="flex justify-between items-center mb-10 bg-[#f8fafc]/80 backdrop-blur-xl sticky top-0 z-30 py-4 -mt-4 border-b border-slate-100">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-lg hidden sm:block group">
              <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
              <input type="text" placeholder="ابحث عن مادة، أو ملخص..." className="w-full bg-white border border-slate-200 rounded-[1.25rem] py-4 pr-14 pl-6 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 outline-none transition-all shadow-sm text-sm" />
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className={`p-4 rounded-[1.25rem] border transition-all relative ${showNotifications ? 'bg-blue-600 text-white border-blue-600 shadow-lg' : 'bg-white border-slate-200 text-slate-600'}`}>
                <Bell className="w-5 h-5" />
                {notifications.some(n => !n.isRead) && <span className={`absolute top-4 left-4 w-3 h-3 border-2 rounded-full ${showNotifications ? 'bg-white border-blue-600' : 'bg-red-500 border-white'}`}></span>}
              </button>
              {showNotifications && (
                <div className="absolute left-0 mt-3 w-96 bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-left">
                  <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center"><h4 className="font-black text-slate-800">التنبيهات الذكية</h4></div>
                  <div className="max-h-[30rem] overflow-y-auto">
                    {notifications.length > 0 ? notifications.map(n => (
                      <div key={n.id} className="p-5 border-b border-slate-50 hover:bg-slate-50 transition-colors flex gap-4 cursor-pointer">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0"><Bell className="w-5 h-5 text-blue-600" /></div>
                        <div><p className="text-sm text-slate-800 font-bold mb-1 leading-tight">{n.message}</p><p className="text-[10px] text-slate-400 font-medium">منذ قليل</p></div>
                      </div>
                    )) : <div className="p-10 text-center text-slate-400 font-bold">لا توجد تنبيهات</div>}
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4 pr-5 border-r border-slate-200">
              <div className="text-right hidden sm:block"><p className="text-sm font-black text-slate-800 leading-none">{settings.studentName}</p><p className="text-[11px] font-bold text-blue-600 mt-1 uppercase tracking-tighter">طالب متميز</p></div>
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(settings.studentName)}&background=0D8ABC&color=fff&size=128`} alt="Avatar" className="w-12 h-12 rounded-[1.25rem] border-4 border-white shadow-md" />
            </div>
          </div>
        </header>
        <div className="pb-10">
          {activeTab === 'dashboard' && <Dashboard grade={grade} schedule={schedule} completedTasks={0} />}
          {activeTab === 'schedule' && <ScheduleView grade={grade} semester={semester} onSemesterChange={setSemester} schedule={schedule} onScheduleUpdate={setSchedule} startTime={settings.defaultStartTime} onStartSession={(task) => setActiveSession(task)} />}
          {activeTab === 'summarize' && <SummaryTool grade={grade} currentSemester={semester} />}
          {activeTab === 'settings' && <Settings settings={settings} onSave={(s) => { setSettings(s); setActiveTab('dashboard'); }} />}
        </div>
      </main>
      <nav className="md:hidden fixed bottom-6 left-6 right-6 bg-slate-900/95 backdrop-blur-xl border border-white/10 px-6 py-4 flex justify-between items-center z-50 rounded-[2.5rem] shadow-2xl">
        {[
          { id: 'dashboard', icon: LayoutDashboard },
          { id: 'schedule', icon: CalendarDays },
          { id: 'summarize', icon: FileText },
          { id: 'settings', icon: SettingsIcon },
        ].map((item) => (
          <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={`p-3.5 rounded-2xl transition-all duration-300 ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}><item.icon className="w-6 h-6" /></button>
        ))}
      </nav>
    </div>
  );
};

export default App;
