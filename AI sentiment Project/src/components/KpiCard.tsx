import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { clsx } from 'clsx';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
    label: string;
  };
  className?: string;
  delayIndex?: number;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  icon,
  trend,
  className,
  delayIndex = 0
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        ease: [0.16, 1, 0.3, 1],
        delay: delayIndex * 0.05 
      }}
      whileHover={{ 
        y: -4, 
        boxShadow: "0 12px 30px -10px rgba(0, 0, 0, 0.05), 0 0 15px -3px rgba(99, 102, 241, 0.05)"
      }}
      className={clsx(
        "glass rounded-2xl p-6 transition-all duration-300 relative overflow-hidden group border border-white/40",
        className
      )}
    >
      {/* Decorative hover gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-50/0 via-violet-50/0 to-violet-100/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="flex justify-between items-start">
        <span className="text-xs font-semibold tracking-wider uppercase text-slate-500 font-display">
          {title}
        </span>
        <div className="p-2.5 bg-slate-100/70 text-slate-700 rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 transform group-hover:rotate-3 shadow-sm border border-slate-200/20">
          {icon}
        </div>
      </div>

      <div className="mt-4 flex flex-col justify-end">
        <h3 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 font-display">
          {value}
        </h3>
        
        {trend && (
          <div className="mt-3 flex items-center gap-1.5 flex-wrap">
            <span
              className={clsx(
                "inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold border",
                trend.direction === 'up' && "bg-emerald-50 text-emerald-700 border-emerald-200/60",
                trend.direction === 'down' && "bg-rose-50 text-rose-700 border-rose-200/60",
                trend.direction === 'neutral' && "bg-slate-50 text-slate-700 border-slate-200/60"
              )}
            >
              {trend.direction === 'up' && <ArrowUpRight className="w-3.5 h-3.5" />}
              {trend.direction === 'down' && <ArrowDownRight className="w-3.5 h-3.5" />}
              {trend.direction === 'neutral' && <Minus className="w-3.5 h-3.5" />}
              {trend.value}
            </span>
            <span className="text-[10px] lg:text-xs text-slate-400 font-medium">
              {trend.label}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
