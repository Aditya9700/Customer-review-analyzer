import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  FileText, 
  Smile, 
  MinusCircle, 
  Frown, 
  Star, 
  AlertTriangle, 
  Upload, 
  Download, 
  Sparkles, 
  Brain,
  Clock,
  CheckCircle2,
  X,
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
  ShieldCheck,
  TrendingDown,
  Activity,
  Layers,
  Heart,
  Sun,
  Moon
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Legend, 
  AreaChart, 
  Area,
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from 'recharts';

import { ReviewData, DashboardStats, CategoryFeedback, TrendPoint, AIInsights } from './types';
import { parseCSV } from './utils/csvParser';
import { demoReviews } from './utils/demoData';
import { 
  computeDashboardStats, 
  computeCategoryFeedback, 
  computeMonthlyTrends, 
  generateAIInsights 
} from './utils/insightsEngine';

import { KpiCard } from './components/KpiCard';
import { EmptyState } from './components/EmptyState';
import { ReviewExplorer } from './components/ReviewExplorer';
import { AiInsightsWorkspace } from './components/AiInsightsWorkspace';
import { PowerBiSection } from './components/PowerBiSection';

// Custom Toast System
interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

export default function App() {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiInsights, setAiInsights] = useState<AIInsights | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      return savedMode === 'true';
    }
    return true; // Default to dark mode
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  // Live clock trigger
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleString('default', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Toast helper
  const triggerToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Load demo data
  const handleLoadDemoData = () => {
    setReviews(demoReviews);
    const calculatedInsights = generateAIInsights(demoReviews);
    setAiInsights(calculatedInsights);
    
    // Fireworks/Confetti Celebration
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
    
    triggerToast("Loaded 100 enterprise product reviews successfully!", "success");
  };

  // Handle uploaded CSV text
  const handleCSVLoaded = (csvText: string) => {
    try {
      const parsed = parseCSV(csvText);
      if (parsed.length === 0) {
        triggerToast("Failed to parse reviews. Check file format.", "error");
        return;
      }
      
      setReviews(parsed);
      const calculatedInsights = generateAIInsights(parsed);
      setAiInsights(calculatedInsights);
      
      // Standard Confetti Burst
      confetti({
        particleCount: 80,
        spread: 60,
        colors: ['#6366f1', '#10b981', '#3b82f6']
      });

      triggerToast(`Successfully parsed and loaded ${parsed.length} reviews!`, "success");
    } catch (err) {
      triggerToast("Error processing CSV file content.", "error");
      console.error(err);
    }
  };

  // CSV file click router
  const triggerNavFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleNavFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) handleCSVLoaded(text);
      };
      reader.readAsText(file);
    }
  };

  // Re-generate AI Insights
  const handleRegenerateAi = () => {
    if (reviews.length === 0) return;
    
    setIsGeneratingAi(true);
    triggerToast("AI Co-pilot is reading reviews and compiling strategic insights...", "info");

    setTimeout(() => {
      const refreshed = generateAIInsights(reviews);
      setAiInsights(refreshed);
      setIsGeneratingAi(false);
      
      // Dual side confetti explosion
      confetti({ particleCount: 40, angle: 60, spread: 50, origin: { x: 0 } });
      confetti({ particleCount: 40, angle: 120, spread: 50, origin: { x: 1 } });
      
      triggerToast("AI analysis updated with latest data distributions!", "success");
    }, 1800);
  };

  // Export report
  const handleExportReport = () => {
    if (reviews.length === 0) {
      triggerToast("No data available to export.", "error");
      return;
    }

    try {
      // Build a basic clean CSV string of the analyzed data
      const headers = ['ID', 'Product', 'Review Text', 'Sentiment', 'Category', 'Confidence Score', 'Date'];
      const rows = reviews.map(r => [
        r.id,
        r.productName || 'General',
        `"${r.reviewText.replace(/"/g, '""')}"`,
        r.sentiment,
        r.category,
        r.confidenceScore,
        r.date
      ]);

      const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `AI_Sentiment_Report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      triggerToast("Sentiment report downloaded successfully!", "success");
    } catch {
      triggerToast("Failed to compile CSV export report.", "error");
    }
  };

  // Clear active dataset
  const handleClearDataset = () => {
    setReviews([]);
    setAiInsights(null);
    triggerToast("Active reviews list cleared.", "info");
  };

  // Stats derivations
  const stats: DashboardStats = computeDashboardStats(reviews);
  const categoriesFeedback: CategoryFeedback[] = computeCategoryFeedback(reviews);
  const monthlyTrends: TrendPoint[] = computeMonthlyTrends(reviews);

  // Chart Color mapping
  const sentimentColors = ['#10b981', '#64748b', '#ef4444']; // Positive, Neutral, Negative
  const pieData = [
    { name: 'Positive', value: reviews.filter(r => r.sentiment === 'Positive').length },
    { name: 'Neutral', value: reviews.filter(r => r.sentiment === 'Neutral').length },
    { name: 'Negative', value: reviews.filter(r => r.sentiment === 'Negative').length }
  ].filter(d => d.value > 0);

  // Radar data mapping
  const radarData = categoriesFeedback.map(cat => ({
    subject: cat.category,
    Score: cat.healthScore,
    Volume: Math.round((cat.totalCount / reviews.length) * 100)
  })).slice(0, 6); // Max 6 categories for radar display

  return (
    <div className="min-h-screen relative flex flex-col pb-16 font-sans">
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 glass border-b border-slate-200/50 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-xl bg-slate-950 dark:bg-white flex items-center justify-center shadow-md border border-slate-900/10 dark:border-white/10 transition-colors">
            <svg className="w-5 h-5 text-white dark:text-slate-950" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 9.5L12 17L22 9.5L12 2Z" fill="currentColor" fillOpacity="0.9" />
              <path d="M2 14.5L12 22L22 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-extrabold text-slate-900 font-display flex items-center gap-1.5 leading-none">
              AI Customer Reviews Sentiment Analyzer
            </h1>
          </div>
        </div>

        {/* Action Controls & Live Clock */}
        <div className="flex flex-wrap items-center justify-end gap-3 w-full md:w-auto">
          {/* Live Date display */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100/80 border border-slate-200/20 text-xs font-mono font-bold text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {currentTime || 'Loading date...'}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200/20 text-slate-700 dark:text-slate-300 transition-colors shadow-sm"
            title="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-500" />}
          </button>

          {reviews.length > 0 && (
            <>
              {/* File upload connector */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleNavFileChange}
                accept=".csv"
                className="hidden"
              />
              <button
                onClick={triggerNavFileSelect}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl transition-all shadow-sm"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload CSV
              </button>

              <button
                onClick={handleExportReport}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl transition-all shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                Export Report
              </button>

              <button
                onClick={handleRegenerateAi}
                disabled={isGeneratingAi}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-slate-900 to-indigo-950 hover:from-slate-800 hover:to-indigo-900 rounded-xl transition-all shadow-md disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                Generate AI Insights
              </button>

              {/* Clear button */}
              <button
                onClick={handleClearDataset}
                title="Clear current data"
                className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main Grid Viewport */}
      <main className="flex-grow max-w-[1400px] w-full mx-auto px-6 pt-6 md:pt-8 mt-0">
        <AnimatePresence mode="wait">
          {reviews.length === 0 ? (
            <EmptyState 
              onDataLoaded={handleCSVLoaded} 
              onLoadDemo={handleLoadDemoData} 
            />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              
              {/* Executive KPI Section */}
              <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                <KpiCard
                  title="Total Reviews"
                  value={stats.totalReviews.toLocaleString()}
                  icon={<FileText className="w-5 h-5" />}
                  trend={{ value: "+24%", direction: 'up', label: 'vs last quarter' }}
                  delayIndex={0}
                />
                
                <KpiCard
                  title="Positive %"
                  value={`${stats.positivePercentage}%`}
                  icon={<Smile className="w-5 h-5 text-emerald-500" />}
                  trend={{ value: "+3%", direction: 'up', label: 'vs last month' }}
                  delayIndex={1}
                />
                
                <KpiCard
                  title="Neutral %"
                  value={`${stats.neutralPercentage}%`}
                  icon={<MinusCircle className="w-5 h-5 text-slate-400" />}
                  trend={{ value: "-1%", direction: 'neutral', label: 'vs last month' }}
                  delayIndex={2}
                />
                
                <KpiCard
                  title="Negative %"
                  value={`${stats.negativePercentage}%`}
                  icon={<Frown className="w-5 h-5 text-rose-500" />}
                  trend={{ 
                    value: stats.negativePercentage > 20 ? "+5%" : "-2%", 
                    direction: stats.negativePercentage > 20 ? 'up' : 'down', 
                    label: 'vs last month' 
                  }}
                  delayIndex={3}
                />

                <KpiCard
                  title="Average Score"
                  value={`${stats.averageSentimentScore} / 5.0`}
                  icon={<Star className="w-5 h-5 text-amber-500 fill-amber-500" />}
                  trend={{ 
                    value: stats.averageSentimentScore > 4.0 ? "Excellent" : "Stable", 
                    direction: 'neutral', 
                    label: 'rating health' 
                  }}
                  delayIndex={4}
                />

                <KpiCard
                  title="Top Issue Area"
                  value={stats.topIssueCategory}
                  icon={<AlertTriangle className="w-5 h-5 text-rose-500" />}
                  trend={stats.topIssueCount > 0 ? { 
                    value: `${stats.topIssueCount} reports`, 
                    direction: 'up', 
                    label: 'critical count' 
                  } : undefined}
                  delayIndex={5}
                />
              </section>

              {/* Sentiment Analytics Section */}
              <section className="grid lg:grid-cols-5 gap-6">
                
                {/* Left Panel: Sentiment Pie Breakdown */}
                <div className="lg:col-span-2 glass rounded-3xl p-6 border border-white/40 shadow-premium flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-base font-bold text-slate-800 font-display">Sentiment Breakdown</h3>
                    <p className="text-[11px] text-slate-400">Aggregated polarity shares of customer review uploads.</p>
                  </div>
                  
                  {/* Recharts Pie component */}
                  <div className="flex-grow flex items-center justify-center min-h-[220px] relative">
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          innerRadius={65}
                          outerRadius={85}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => {
                            const colorsMap = {
                              'Positive': '#10b981',
                              'Neutral': '#94a3b8',
                              'Negative': '#ef4444'
                            };
                            const col = colorsMap[entry.name as 'Positive' | 'Neutral' | 'Negative'] || '#94a3b8';
                            return <Cell key={`cell-${index}`} fill={col} />;
                          })}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            background: '#0f172a', 
                            border: 'none', 
                            borderRadius: '12px', 
                            color: '#fff',
                            fontSize: '11px',
                            fontWeight: '600'
                          }}
                          formatter={(value) => [`${value} reviews`, 'Volume']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    
                    {/* Centered label */}
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-3xl font-extrabold text-slate-900 font-display">
                        {stats.positivePercentage}%
                      </span>
                      <span className="text-[9px] uppercase font-bold tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        Positive Lean
                      </span>
                    </div>
                  </div>

                  {/* Visual legends list */}
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs font-semibold">
                    <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-xl p-2">
                      <span className="text-[10px] text-emerald-600 block mb-0.5">Positive</span>
                      <span className="text-sm font-bold text-slate-800 font-mono">
                        {reviews.filter(r => r.sentiment === 'Positive').length}
                      </span>
                    </div>
                    <div className="bg-slate-50/50 border border-slate-200/50 rounded-xl p-2">
                      <span className="text-[10px] text-slate-500 block mb-0.5">Neutral</span>
                      <span className="text-sm font-bold text-slate-800 font-mono">
                        {reviews.filter(r => r.sentiment === 'Neutral').length}
                      </span>
                    </div>
                    <div className="bg-rose-50/50 border border-rose-100/50 rounded-xl p-2">
                      <span className="text-[10px] text-rose-600 block mb-0.5">Negative</span>
                      <span className="text-sm font-bold text-slate-800 font-mono">
                        {reviews.filter(r => r.sentiment === 'Negative').length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Panel: Sentiment Trend Line */}
                <div className="lg:col-span-3 glass rounded-3xl p-6 border border-white/40 shadow-premium flex flex-col">
                  <div className="mb-4 flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-bold text-slate-800 font-display">Sentiment Dynamics Trend</h3>
                      <p className="text-[11px] text-slate-400">Monthly breakdown of polarities registered over the timeline.</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold bg-slate-100 px-2.5 py-1 rounded-lg">
                      <Activity className="w-3.5 h-3.5 text-indigo-500" />
                      Active Timeline
                    </div>
                  </div>

                  {/* Line Chart */}
                  <div className="flex-grow min-h-[220px]">
                    <ResponsiveContainer width="100%" height={230}>
                      <LineChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis 
                          dataKey="month" 
                          stroke="#94a3b8" 
                          fontSize={10} 
                          tickLine={false} 
                          axisLine={false} 
                        />
                        <YAxis 
                          stroke="#94a3b8" 
                          fontSize={10} 
                          tickLine={false} 
                          axisLine={false} 
                        />
                        <Tooltip 
                          contentStyle={{ 
                            background: '#0f172a', 
                            border: 'none', 
                            borderRadius: '12px', 
                            color: '#fff',
                            fontSize: '11px',
                            fontWeight: '600'
                          }}
                        />
                        <Legend 
                          verticalAlign="top" 
                          height={36} 
                          iconType="circle"
                          iconSize={6}
                          wrapperStyle={{ fontSize: '11px', fontWeight: '600', color: '#64748b' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="positive" 
                          name="Positive"
                          stroke="#10b981" 
                          strokeWidth={2.5} 
                          dot={{ r: 4, strokeWidth: 0, fill: '#10b981' }} 
                          activeDot={{ r: 6 }} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="neutral" 
                          name="Neutral"
                          stroke="#94a3b8" 
                          strokeWidth={2} 
                          dot={{ r: 3, strokeWidth: 0, fill: '#94a3b8' }} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="negative" 
                          name="Negative"
                          stroke="#ef4444" 
                          strokeWidth={2.5} 
                          dot={{ r: 4, strokeWidth: 0, fill: '#ef4444' }} 
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </section>

              {/* Product Feedback & AI insights workspace split */}
              <section className="grid lg:grid-cols-5 gap-6">
                
                {/* Product Feedback Analysis Panel */}
                <div className="lg:col-span-2 glass rounded-3xl p-6 border border-white/40 shadow-premium flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-base font-bold text-slate-800 font-display">Product Category Rankings</h3>
                      <Layers className="w-4 h-4 text-slate-400" />
                    </div>
                    <p className="text-[11px] text-slate-400 mb-6">Review distribution and sentiment strength by product features.</p>
                    
                    {/* List of categories with multi-sentiment progress bars */}
                    <div className="space-y-4">
                      {categoriesFeedback.map((cat, idx) => {
                        const total = cat.totalCount;
                        const posPct = Math.round((cat.positiveCount / total) * 100);
                        const neuPct = Math.round((cat.neutralCount / total) * 100);
                        const negPct = 100 - posPct - neuPct; // balance
                        
                        return (
                          <div key={cat.category} className="space-y-1.5">
                            <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                              <span className="flex items-center gap-1.5">
                                <span className="text-[10px] text-slate-400 font-mono">#{idx+1}</span>
                                {cat.category}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold font-mono text-slate-400">{total} reviews</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  cat.healthScore > 80 
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                    : cat.healthScore > 60 
                                      ? 'bg-amber-50 text-amber-700 border border-amber-100' 
                                      : 'bg-rose-50 text-rose-700 border border-rose-100'
                                }`}>
                                  Health {cat.healthScore}%
                                </span>
                              </div>
                            </div>
                            
                            {/* Stacked Sentiment progress bar */}
                            <div className="w-full h-3.5 bg-slate-100 rounded-lg overflow-hidden flex shadow-inner border border-slate-200/20">
                              {cat.positiveCount > 0 && (
                                <div 
                                  className="h-full bg-emerald-500 hover:opacity-90 transition-opacity" 
                                  style={{ width: `${posPct}%` }}
                                  title={`Positive: ${posPct}%`}
                                />
                              )}
                              {cat.neutralCount > 0 && (
                                <div 
                                  className="h-full bg-slate-400 hover:opacity-90 transition-opacity" 
                                  style={{ width: `${neuPct}%` }}
                                  title={`Neutral: ${neuPct}%`}
                                />
                              )}
                              {cat.negativeCount > 0 && (
                                <div 
                                  className="h-full bg-rose-500 hover:opacity-90 transition-opacity" 
                                  style={{ width: `${negPct}%` }}
                                  title={`Negative: ${negPct}%`}
                                />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Summary Footer */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Positive</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> Neutral</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Negative</span>
                  </div>
                </div>

                {/* AI Assistant Workspace Panel */}
                <div className="lg:col-span-3">
                  {aiInsights && (
                    <AiInsightsWorkspace
                      insights={aiInsights}
                      reviews={reviews}
                      isGenerating={isGeneratingAi}
                      onRegenerate={handleRegenerateAi}
                    />
                  )}
                </div>
              </section>

              {/* Review Explorer Table */}
              <section>
                <ReviewExplorer reviews={reviews} />
              </section>

              {/* Business Intelligence Section */}
              <section className="grid lg:grid-cols-3 gap-6">
                
                {/* Product Performance Radar Chart */}
                <div className="glass rounded-3xl p-6 border border-white/40 shadow-premium flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-base font-bold text-slate-800 font-display">Product Performance Score</h3>
                    <p className="text-[11px] text-slate-400">Comparison of category health scores across indices.</p>
                  </div>
                  
                  <div className="flex-grow flex items-center justify-center min-h-[220px]">
                    <ResponsiveContainer width="100%" height={220}>
                      <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                        <PolarGrid stroke="#f1f5f9" />
                        <PolarAngleAxis 
                          dataKey="subject" 
                          tick={{ fill: '#475569', fontSize: 10, fontWeight: 600 }}
                        />
                        <PolarRadiusAxis 
                          angle={30} 
                          domain={[0, 100]} 
                          tick={{ fill: '#94a3b8', fontSize: 8 }}
                        />
                        <Radar 
                          name="Category Health" 
                          dataKey="Score" 
                          stroke="#6366f1" 
                          fill="#818cf8" 
                          fillOpacity={0.25} 
                        />
                        <Tooltip
                          contentStyle={{ 
                            background: '#0f172a', 
                            border: 'none', 
                            borderRadius: '12px', 
                            color: '#fff',
                            fontSize: '11px',
                            fontWeight: '600'
                          }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Customer Satisfaction CSAT Score Card */}
                <div className="glass rounded-3xl p-6 border border-white/40 shadow-premium flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-800 font-display">Customer Satisfaction (CSAT)</h3>
                    <p className="text-[11px] text-slate-400">Total customer health evaluation indicator.</p>
                  </div>

                  <div className="flex flex-col items-center justify-center py-4">
                    <div className="relative w-36 h-36 flex items-center justify-center">
                      {/* Ring Background */}
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="72"
                          cy="72"
                          r="56"
                          stroke="#f1f5f9"
                          strokeWidth="10"
                          fill="transparent"
                        />
                        <circle
                          cx="72"
                          cy="72"
                          r="56"
                          stroke={stats.positivePercentage > 70 ? "#10b981" : stats.positivePercentage > 50 ? "#f59e0b" : "#ef4444"}
                          strokeWidth="10"
                          fill="transparent"
                          strokeDasharray="351.8"
                          strokeDashoffset={351.8 - (351.8 * stats.positivePercentage) / 100}
                          strokeLinecap="round"
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      
                      <div className="absolute flex flex-col items-center justify-center text-center">
                        <span className="text-3xl font-extrabold text-slate-900 font-display">
                          {stats.positivePercentage}%
                        </span>
                        <span className="text-[8px] uppercase tracking-wider font-bold text-slate-400 mt-0.5">
                          Satisfaction Index
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs font-semibold text-slate-600">
                    <div className="flex items-center gap-1 text-emerald-700">
                      <TrendingUp className="w-4 h-4" />
                      +{Math.round(stats.positivePercentage * 0.05)}% growth
                    </div>
                    <div className="text-slate-400">vs last quarter</div>
                  </div>
                </div>

                {/* Review Volume Area Chart */}
                <div className="glass rounded-3xl p-6 border border-white/40 shadow-premium flex flex-col">
                  <div className="mb-4 flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-bold text-slate-800 font-display">Review Volume Trends</h3>
                      <p className="text-[11px] text-slate-400">Timeline review generation curves.</p>
                    </div>
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100">
                      <BarChart3 className="w-3 h-3" /> Volume
                    </span>
                  </div>

                  <div className="flex-grow min-h-[220px]">
                    <ResponsiveContainer width="100%" height={220}>
                      <AreaChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis 
                          dataKey="month" 
                          stroke="#94a3b8" 
                          fontSize={10} 
                          tickLine={false} 
                          axisLine={false} 
                        />
                        <YAxis 
                          stroke="#94a3b8" 
                          fontSize={10} 
                          tickLine={false} 
                          axisLine={false} 
                        />
                        <Tooltip
                          contentStyle={{ 
                            background: '#0f172a', 
                            border: 'none', 
                            borderRadius: '12px', 
                            color: '#fff',
                            fontSize: '11px',
                            fontWeight: '600'
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="total" 
                          name="Total Reviews" 
                          stroke="#6366f1" 
                          strokeWidth={2}
                          fillOpacity={1} 
                          fill="url(#colorVolume)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </section>

              {/* Power BI Integration Panel */}
              <section>
                <PowerBiSection totalRecords={reviews.length} />
              </section>

            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Toast Alert Rendering System */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="glass p-4 rounded-2xl border border-white/50 shadow-2xl flex items-start gap-3 backdrop-blur-md relative overflow-hidden"
            >
              {/* Highlight Bar based on type */}
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                toast.type === 'success' ? 'bg-emerald-500' : toast.type === 'error' ? 'bg-rose-500' : 'bg-blue-500'
              }`} />
              
              <div className={`p-1.5 rounded-lg flex-shrink-0 mt-0.5 ${
                toast.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-600' 
                  : toast.type === 'error' 
                    ? 'bg-rose-50 text-rose-600' 
                    : 'bg-blue-50 text-blue-600'
              }`}>
                {toast.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : toast.type === 'error' ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
              </div>
              
              <div className="flex-grow pr-4">
                <p className="text-xs font-bold text-slate-800 leading-snug">
                  {toast.message}
                </p>
              </div>

              <button
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded-lg"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}
