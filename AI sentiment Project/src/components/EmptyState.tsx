import React, { useState, useRef } from 'react';
import { UploadCloud, FileSpreadsheet, Sparkles, BookOpen, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  onDataLoaded: (reviewsText: string) => void;
  onLoadDemo: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onDataLoaded, onLoadDemo }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError('Please select a valid CSV file (.csv).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text && text.trim().length > 0) {
        onDataLoaded(text);
      } else {
        setError('The uploaded CSV file is empty.');
      }
    };
    reader.onerror = () => {
      setError('Error reading the CSV file.');
    };
    reader.readAsText(file);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-4xl mx-auto px-4 py-8 md:py-16 flex flex-col items-center justify-center min-h-[calc(100vh-140px)]"
    >
      <div className="text-center mb-8 md:mb-12">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold mb-4 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
          Enterprise Business Intelligence
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 font-display mb-4"
        >
          AI Customer Reviews Sentiment Analyzer
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-slate-500 max-w-2xl mx-auto"
        >
          Analyze customer sentiment, extract key product issues, and generate AI-driven action plans from your product reviews instantly.
        </motion.p>
      </div>

      <div className="grid md:grid-cols-5 gap-8 w-full max-w-4xl">
        {/* Upload Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="md:col-span-3 flex flex-col"
        >
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileSelect}
            className={`flex-1 flex flex-col items-center justify-center p-8 md:p-12 rounded-3xl border-2 border-dashed cursor-pointer transition-all duration-300 ${
              isDragging
                ? 'border-primary bg-indigo-50/20 scale-[1.01] shadow-lg shadow-indigo-100/50'
                : 'border-slate-200 bg-white/70 hover:border-slate-400 hover:bg-white/90 shadow-premium'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv"
              className="hidden"
            />
            
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm text-slate-500 mb-6 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-10 h-10 text-slate-400" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 font-display mb-2">
              Upload customer reviews CSV
            </h3>
            
            <p className="text-sm text-slate-400 text-center mb-6 max-w-xs">
              Drag and drop your file here, or click to browse files from your computer.
            </p>

            <button
              type="button"
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-md hover:bg-slate-800 transition-colors"
            >
              Select CSV File
            </button>

            {error && (
              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                {error}
              </div>
            )}
          </div>
        </motion.div>

        {/* Info & Demo Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="md:col-span-2 flex flex-col gap-6"
        >
          {/* Quick Demo Card */}
          <div className="glass rounded-3xl p-6 border border-white/50 shadow-premium flex flex-col justify-between flex-1">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 font-display">No data file ready?</h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                Instantly populate the dashboard with 100+ mock reviews for consumer electronics (earbuds, smartwatches, speakers) to test the analysis engine, filters, charts, and AI reports.
              </p>
            </div>
            
            <button
              onClick={onLoadDemo}
              type="button"
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white font-semibold text-sm shadow-md transition-all duration-300 transform active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-indigo-300 animate-pulse" />
              Load Enterprise Demo Data
            </button>
          </div>

          {/* Guidelines Card */}
          <div className="glass rounded-3xl p-6 border border-white/50 shadow-premium">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-600">
                <BookOpen className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 font-display">CSV Template Guide</h4>
            </div>
            
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Our analyzer dynamically maps files using fuzzy headers. For best results, name columns close to:
            </p>
            
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex justify-between items-center bg-slate-50/50 p-2 rounded-lg border border-slate-100">
                <span className="font-semibold text-slate-700">Review Text</span>
                <span className="text-[10px] text-slate-400 font-mono">review / text / comment</span>
              </li>
              <li className="flex justify-between items-center bg-slate-50/50 p-2 rounded-lg border border-slate-100">
                <span className="font-semibold text-slate-700">Sentiment</span>
                <span className="text-[10px] text-slate-400 font-mono">sentiment / polarity</span>
              </li>
              <li className="flex justify-between items-center bg-slate-50/50 p-2 rounded-lg border border-slate-100">
                <span className="font-semibold text-slate-700">Category</span>
                <span className="text-[10px] text-slate-400 font-mono">category / topic / tag</span>
              </li>
              <li className="flex justify-between items-center bg-slate-50/50 p-2 rounded-lg border border-slate-100">
                <span className="font-semibold text-slate-700">Date</span>
                <span className="text-[10px] text-slate-400 font-mono">date / timestamp / time</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
