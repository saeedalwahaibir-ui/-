
import React, { useState, useEffect } from 'react';
import { FileText, Upload, Brain, Copy, Check, Download, Info, Trash2, History, Compass, Sparkles, BookOpen, GraduationCap, X, ChevronRight, FileDown, Code, FilePlus2 } from 'lucide-react';
import { summarizeContent, summarizeFile, generateInteractiveQuiz } from '../services/geminiService';
import { SummaryResult, Grade, Semester, QuizQuestion } from '../types';
import { OMANI_SUBJECTS } from '../constants';

interface SummaryToolProps {
  grade: Grade;
  currentSemester: Semester;
}

const SummaryTool: React.FC<SummaryToolProps> = ({ grade, currentSemester }) => {
  const [textInput, setTextInput] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [summary, setSummary] = useState<SummaryResult | null>(null);
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<SummaryResult[]>([]);
  const [activeSemester, setActiveSemester] = useState<Semester>(currentSemester);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizResults, setQuizResults] = useState<{ [key: number]: number }>({});
  const [showQuizExplanation, setShowQuizExplanation] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    setActiveSemester(currentSemester);
  }, [currentSemester]);

  useEffect(() => {
    const saved = localStorage.getItem(`mudhakir_history_${grade}`);
    if (saved) setHistory(JSON.parse(saved));
  }, [grade]);

  const saveToHistory = (res: SummaryResult) => {
    const newHistory = [res, ...history].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem(`mudhakir_history_${grade}`, JSON.stringify(newHistory));
  };

  const handleTextSummarize = async () => {
    if (!textInput.trim()) return;
    setLoading(true);
    setQuiz(null);
    try {
      const result = await summarizeContent(textInput, grade, activeSemester, selectedSubject);
      setSummary(result);
      saveToHistory(result);
    } catch (error) {
      console.error(error);
      alert("خطأ في التلخيص.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuiz = async () => {
    if (!summary) return;
    setQuizLoading(true);
    try {
      const questions = await generateInteractiveQuiz(summary.content + " " + summary.keyPoints.join(" "), grade, selectedSubject);
      setQuiz(questions);
      setShowQuizModal(true);
      setQuizResults({});
      setShowQuizExplanation({});
    } catch (error) {
      console.error(error);
      alert("خطأ في إنشاء الاختبار.");
    } finally {
      setQuizLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setQuiz(null);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const result = await summarizeFile(base64, file.type, grade, activeSemester);
        setSummary(result);
        saveToHistory(result);
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
      setLoading(false);
      alert("خطأ في معالجة الملف.");
    }
  };

  const handleExportPDF = () => {
    if (!summary) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const html = `
      <html dir="rtl" lang="ar">
        <head>
          <title>${summary.title}</title>
          <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Tajawal', sans-serif; padding: 40px; line-height: 1.6; color: #334155; }
            h1 { color: #1e40af; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
            .content { margin-top: 20px; font-size: 1.1rem; }
            .key-points { margin-top: 30px; background: #f8fafc; padding: 20px; border-radius: 15px; }
            .key-points h2 { color: #1e40af; font-size: 1.3rem; margin-top: 0; }
            ul { padding-right: 20px; }
            li { margin-bottom: 10px; font-weight: bold; }
            .footer { margin-top: 50px; text-align: center; color: #94a3b8; font-size: 0.8rem; border-top: 1px solid #f1f5f9; padding-top: 20px; }
          </style>
        </head>
        <body>
          <h1>${summary.title}</h1>
          <div class="content">${summary.content}</div>
          <div class="key-points">
            <h2>النقاط الرئيسية:</h2>
            <ul>${summary.keyPoints.map(p => `<li>${p}</li>`).join('')}</ul>
          </div>
          <div class="footer">تم التوليد بواسطة تطبيق مُذاكر - المنهج العماني 2026</div>
          <script>window.print();</script>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const handleExportHTMLQuiz = async () => {
    if (!summary) return;
    setQuizLoading(true);
    try {
      let activeQuiz = quiz || await generateInteractiveQuiz(summary.content + " " + summary.keyPoints.join(" "), grade, selectedSubject);
      const htmlContent = `<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"><title>اختبار: ${summary.title}</title><link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;900&display=swap" rel="stylesheet"><style>:root{--primary:#2563eb;--bg:#f8fafc}body{font-family:'Tajawal',sans-serif;background:var(--bg);padding:20px;color:#1e293b}.container{max-width:800px;margin:0 auto;background:white;padding:40px;border-radius:30px;box-shadow:0 10px 25px rgba(0,0,0,0.05)}h1{color:var(--primary);text-align:center;font-weight:900;margin-bottom:40px;border-bottom:4px solid #eff6ff;padding-bottom:20px}.question{margin-bottom:40px;background:#fafafa;padding:25px;border-radius:20px;border:1px solid #f1f5f9}.options{display:grid;gap:12px;margin-top:20px}.option{padding:15px 20px;border:2px solid #e2e8f0;border-radius:15px;text-align:right;background:white;cursor:pointer;font-size:1rem;font-weight:700;transition:all .2s;outline:0}.option:hover{border-color:var(--primary);background:#f0f7ff}.correct{background:#dcfce7!important;border-color:#22c55e!important;color:#166534!important}.wrong{background:#fee2e2!important;border-color:#ef4444!important;color:#991b1b!important}.explanation{margin-top:15px;padding:15px;background:#eff6ff;border-radius:12px;font-size:.9rem;color:#1e40af;display:none}.footer{text-align:center;margin-top:40px;color:#94a3b8;font-size:.8rem;font-weight:700}</style></head><body><div class="container"><h1>اختبار: ${summary.title}</h1><div id="quiz"></div><div class="footer">تم توليد هذا الاختبار بواسطة منصة مُذاكر الذكية - 2026</div></div><script>const data=${JSON.stringify(activeQuiz)};const container=document.getElementById('quiz');data.forEach((q,qIdx)=>{const div=document.createElement('div');div.className='question';div.innerHTML='<h3>س'+(qIdx+1)+': '+q.question+'</h3>';const opts=document.createElement('div');opts.className='options';q.options.forEach((opt,oIdx)=>{const btn=document.createElement('button');btn.className='option';btn.innerText=opt;btn.onclick=()=>{const all=opts.querySelectorAll('button');all.forEach(b=>b.disabled=true);if(oIdx===q.correctAnswerIndex){btn.classList.add('correct')}else{btn.classList.add('wrong');all[q.correctAnswerIndex].classList.add('correct')}div.querySelector('.explanation').style.display='block'};opts.appendChild(btn)});div.appendChild(opts);const exp=document.createElement('div');exp.className='explanation';exp.innerHTML='<strong>التوضيح:</strong> '+q.explanation;div.appendChild(exp);container.appendChild(div)})</script></body></html>`;
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `اختبار_${summary.title}.html`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    } catch (error) { console.error(error); alert("خطأ في التصدير."); } finally { setQuizLoading(false); }
  };

  const handleOptionSelect = (qIdx: number, oIdx: number) => {
    setQuizResults({ ...quizResults, [qIdx]: oIdx });
    setShowQuizExplanation({ ...showQuizExplanation, [qIdx]: true });
  };

  const copyToClipboard = () => {
    if (!summary) return;
    const fullText = `${summary.title}\n\n${summary.content}\n\nأهم النقاط:\n${summary.keyPoints.map(p => `• ${p}`).join('\n')}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const subjects = OMANI_SUBJECTS[grade];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {showQuizModal && quiz && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar relative p-8 shadow-2xl animate-in zoom-in-95">
            <button onClick={() => setShowQuizModal(false)} className="absolute top-6 left-6 p-3 bg-slate-50 rounded-full hover:bg-slate-100">
              <X className="w-6 h-6 text-slate-400" />
            </button>
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-amber-100 p-3 rounded-2xl"><GraduationCap className="text-amber-600 w-8 h-8" /></div>
              <div>
                <h3 className="text-2xl font-black text-slate-800">اختبار تفاعلي سريع</h3>
                <p className="text-slate-500 font-bold">بناءً على التلخيص الحالي</p>
              </div>
            </div>
            <div className="space-y-10">
              {quiz.map((q, qIdx) => (
                <div key={qIdx} className="space-y-4">
                  <h4 className="text-lg font-black text-slate-800">س{qIdx + 1}: {q.question}</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {q.options.map((opt, oIdx) => (
                      <button 
                        key={oIdx} 
                        disabled={showQuizExplanation[qIdx]} 
                        onClick={() => handleOptionSelect(qIdx, oIdx)}
                        className={`p-4 rounded-2xl border-2 text-right transition-all font-bold ${showQuizExplanation[qIdx] ? (q.correctAnswerIndex === oIdx ? 'bg-green-50 border-green-500 text-green-700' : (quizResults[qIdx] === oIdx ? 'bg-red-50 border-red-500 text-red-700' : 'bg-slate-50 border-slate-100 opacity-50')) : 'bg-white border-slate-100 hover:border-blue-300 hover:bg-blue-50/30'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  {showQuizExplanation[qIdx] && <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 text-blue-800 text-sm leading-relaxed"><span className="font-black">التفسير: </span> {q.explanation}</div>}
                </div>
              ))}
            </div>
            <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-center gap-4">
              <button onClick={handleExportHTMLQuiz} disabled={quizLoading} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2"><Code className="w-5 h-5" /> تصدير HTML</button>
              <button onClick={() => setShowQuizModal(false)} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black">إغلاق الاختبار</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg"><Brain className="w-6 h-6" /></div>
          <div>
            <h2 className="text-2xl font-black text-slate-800">مختبر الملخصات الذكي</h2>
            <p className="text-slate-500 font-medium">الصف {grade} - المنهج العماني</p>
          </div>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-[1.25rem] border border-slate-200">
          <button onClick={() => setActiveSemester(Semester.S1)} className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeSemester === Semester.S1 ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>فصل 1</button>
          <button onClick={() => setActiveSemester(Semester.S2)} className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeSemester === Semester.S2 ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>فصل 2</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 mb-8"><div className="w-1.5 h-6 bg-blue-600 rounded-full" />تحليل المحتوى</h3>
            <div className="space-y-6">
              <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold outline-none">
                <option value="">اختر المادة...</option>
                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <textarea value={textInput} onChange={(e) => setTextInput(e.target.value)} placeholder="الصق نص الدرس هنا لملخص واختبار تفاعلي..." className="w-full h-72 p-6 rounded-[2rem] bg-slate-50/50 border border-slate-200 outline-none resize-none font-medium" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <button onClick={handleTextSummarize} disabled={loading || !textInput.trim()} className="bg-blue-600 text-white py-4.5 rounded-[1.5rem] font-black text-lg shadow-lg shadow-blue-100 transition-all flex justify-center items-center gap-3 disabled:opacity-50">
                  {loading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : <Sparkles className="w-5 h-5" />}
                  تلخيص ذكي
                </button>
                <div className="relative">
                  <input type="file" id="file-upload" className="hidden" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileUpload} />
                  <label htmlFor="file-upload" className="cursor-pointer w-full bg-slate-900 text-white py-4.5 rounded-[1.5rem] font-black text-lg flex justify-center items-center gap-3 hover:bg-slate-800 transition-colors">
                    <FilePlus2 className="w-5 h-5" /> تحميل ملف
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 h-full flex flex-col min-h-[600px] overflow-hidden">
            <div className="pb-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-3"><BookOpen className="w-5 h-5 text-blue-600" /> ملخص الدرس</h3>
              {summary && (
                <div className="flex gap-2">
                  <button onClick={handleExportHTMLQuiz} title="تصدير اختبار HTML" className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-all"><Code className="w-5 h-5" /></button>
                  <button onClick={handleExportPDF} title="تصدير PDF" className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all"><FileDown className="w-5 h-5" /></button>
                  <button onClick={copyToClipboard} className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-blue-50 transition-all">{copied ? <Check className="text-green-500 w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
                </div>
              )}
            </div>
            <div className="flex-1 py-10 overflow-y-auto custom-scrollbar">
              {summary ? (
                <div className="space-y-10 animate-in fade-in slide-in-from-left-4 duration-700">
                  <div className="space-y-4">
                    <h4 className="text-3xl font-black text-slate-900 leading-tight">{summary.title}</h4>
                    <p className="p-6 bg-slate-50 rounded-[2rem] text-slate-600 leading-loose text-lg font-medium border border-slate-100/50">{summary.content}</p>
                  </div>
                  <div className="space-y-6">
                    <h5 className="font-black text-slate-800 text-lg flex items-center gap-2"><Info className="w-5 h-5 text-blue-500" />النقاط الرئيسية:</h5>
                    <div className="space-y-3">
                      {summary.keyPoints.map((point, idx) => (
                        <div key={idx} className="flex gap-4 p-5 bg-white border border-slate-100 rounded-[1.5rem] hover:shadow-md transition-shadow">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-lg text-white font-black flex items-center justify-center text-sm">{idx + 1}</div>
                          <span className="font-bold text-slate-700 leading-relaxed">{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pt-8 border-t border-slate-100">
                    <button onClick={handleCreateQuiz} disabled={quizLoading} className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-5 rounded-[2rem] font-black text-xl shadow-xl shadow-amber-100 flex justify-center items-center gap-3 transition-all hover:scale-[1.02] active:scale-95">
                      {quizLoading ? <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" /> : <GraduationCap className="w-7 h-7" />}
                      إنشاء اختبار تفاعلي ذكي
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 py-20 text-center">
                  <Brain className="w-16 h-16 opacity-10 mb-6" />
                  <h4 className="text-2xl font-black text-slate-800">في انتظار مدخلاتك</h4>
                  <p className="text-slate-400 font-medium">حمل ملفاً أو الصق نصاً للبدء</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryTool;
