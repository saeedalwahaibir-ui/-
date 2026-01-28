
import React, { useState } from 'react';
import { User, Bell, Clock, Save, LogOut, QrCode, Share2, Download, Copy, Check } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsProps {
  settings: AppSettings;
  onSave: (s: AppSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [copiedLink, setCopiedLink] = useState(false);

  const appLink = "https://mudhakir-app.om"; // رابط افتراضي للتطبيق

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-slate-100">
        <h2 className="text-3xl font-black text-slate-800 mb-10">إعدادات الحساب</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* User Profile */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-blue-600 mb-2">
              <User className="w-5 h-5" />
              <h3 className="font-black">الملف الشخصي</h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 pr-2">اسم الطالب</label>
                <input 
                  type="text" 
                  value={localSettings.studentName}
                  onChange={(e) => setLocalSettings({...localSettings, studentName: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-4 focus:ring-blue-500/5 outline-none font-bold"
                />
              </div>
            </div>
          </section>

          {/* Schedule Prefs */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-blue-600 mb-2">
              <Clock className="w-5 h-5" />
              <h3 className="font-black">تفضيلات المذاكرة</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 pr-2">وقت البدء المفضل</label>
                <input 
                  type="time" 
                  value={localSettings.defaultStartTime}
                  onChange={(e) => setLocalSettings({...localSettings, defaultStartTime: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-4 focus:ring-blue-500/5 outline-none font-bold"
                />
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section className="space-y-6 md:col-span-2 border-t border-slate-50 pt-10">
            <div className="flex items-center gap-3 text-blue-600 mb-2">
              <Bell className="w-5 h-5" />
              <h3 className="font-black">التنبيهات والإشعارات</h3>
            </div>

            <div className="flex flex-col sm:flex-row gap-8">
              <label className="flex items-center gap-4 cursor-pointer group">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    checked={localSettings.notificationsEnabled}
                    onChange={(e) => setLocalSettings({...localSettings, notificationsEnabled: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-8 bg-slate-200 rounded-full peer peer-checked:bg-blue-600 transition-all after:content-[''] after:absolute after:top-1 after:right-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:-translate-x-6"></div>
                </div>
                <span className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors">تفعيل إشعارات وقت المذاكرة</span>
              </label>

              <div className="flex-1 flex items-center gap-4 bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100">
                <span className="text-sm font-bold text-slate-500">التذكير قبل:</span>
                <select 
                  value={localSettings.reminderInterval}
                  onChange={(e) => setLocalSettings({...localSettings, reminderInterval: parseInt(e.target.value)})}
                  className="bg-transparent border-none font-black text-blue-600 focus:ring-0 outline-none"
                >
                  <option value="5">٥ دقائق</option>
                  <option value="10">١٠ دقائق</option>
                  <option value="15">١٥ دقيقة</option>
                  <option value="30">٣٠ دقيقة</option>
                </select>
              </div>
            </div>
          </section>

          {/* QR Code Section */}
          <section className="md:col-span-2 border-t border-slate-50 pt-10">
            <div className="flex items-center gap-3 text-blue-600 mb-6">
              <QrCode className="w-5 h-5" />
              <h3 className="font-black">باركود التطبيق</h3>
            </div>

            <div className="bg-slate-50 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center gap-10 border border-slate-100">
              <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-blue-500/5 border border-slate-200 group transition-transform hover:scale-105 duration-500">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(appLink)}&bgcolor=ffffff&color=1e293b`} 
                  alt="App QR Code" 
                  className="w-40 h-40"
                />
              </div>

              <div className="flex-1 text-center md:text-right space-y-4">
                <h4 className="text-xl font-black text-slate-800">شارك "مُذاكر" مع زملائك</h4>
                <p className="text-slate-500 font-medium leading-relaxed">
                  امسح الرمز أعلاه لفتح التطبيق بسرعة على هاتفك أو شارك الرابط المباشر مع أصدقائك في الصف لتنظيم مذاكرتكم معاً.
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                  <button 
                    onClick={handleCopyLink}
                    className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-700 hover:bg-slate-100 transition-all"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-blue-500" />}
                    {copiedLink ? "تم النسخ" : "نسخ الرابط"}
                  </button>
                  <button className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                    <Share2 className="w-4 h-4" />
                    مشاركة سريعة
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row gap-4 pt-8 border-t border-slate-50">
          <button 
            onClick={() => onSave(localSettings)}
            className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200 transition-all flex justify-center items-center gap-3"
          >
            <Save className="w-5 h-5" />
            حفظ التغييرات
          </button>
          
          <button className="flex items-center justify-center gap-2 text-red-500 font-bold px-8 py-4 rounded-2xl border border-red-100 hover:bg-red-50 transition-all">
            <LogOut className="w-5 h-5" />
            تسجيل الخروج
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
