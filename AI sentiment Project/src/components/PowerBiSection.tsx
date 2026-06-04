import React, { useState } from 'react';
import { 
  Database, 
  RefreshCw, 
  ExternalLink, 
  Lock, 
  CheckCircle, 
  AlertTriangle,
  Server,
  Workflow
} from 'lucide-react';
import { motion } from 'framer-motion';

interface PowerBiSectionProps {
  totalRecords: number;
}

export const PowerBiSection: React.FC<PowerBiSectionProps> = ({ totalRecords }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>(() => {
    const now = new Date();
    return now.toLocaleString('default', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  });
  const [gatewayStatus, setGatewayStatus] = useState<'Online' | 'Offline'>('Online');
  const [embedLoaded, setEmbedLoaded] = useState(true);

  const handleSyncNow = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const now = new Date();
      setLastSyncTime(now.toLocaleString('default', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));
    }, 1500);
  };

  return (
    <div className="glass rounded-3xl border border-white/40 shadow-premium overflow-hidden flex flex-col w-full">
      {/* Header section */}
      <div className="p-6 border-b border-slate-100 bg-white/40 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f2c811] animate-pulse" /> {/* Power BI brand color */}
            <h2 className="text-xl font-bold text-slate-900 font-display">Power BI Integration</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">Connect reviews sentiment data into corporate enterprise reporting architectures.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Refresh Link */}
          <button
            onClick={handleSyncNow}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl transition-all shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#f2c811]' : 'text-slate-500'}`} />
            {isSyncing ? 'Syncing...' : 'Sync Dataset Now'}
          </button>

          <a
            href="https://powerbi.microsoft.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-sm"
          >
            Open in Workspace
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Main split dashboard view */}
      <div className="p-6 grid lg:grid-cols-3 gap-6">
        
        {/* Left Column: Embed Panel Mockup */}
        <div className="lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>Embedded Report Preview</span>
            <span className="flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              <Lock className="w-3 h-3" /> Secure Tenant Connection
            </span>
          </div>

          {/* High Fidelity Mock Dashboard Embed Container */}
          <div className="relative flex-1 bg-slate-900 rounded-2xl border border-slate-950 overflow-hidden min-h-[360px] flex flex-col text-slate-300 shadow-inner group">
            {/* Embed header */}
            <div className="bg-slate-950 px-4 py-2.5 flex justify-between items-center border-b border-slate-800 text-[10px] font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-md bg-[#f2c811]" />
                <span className="text-slate-300 font-semibold font-sans">Consumer Electronics Sentiment (App Embed)</span>
              </div>
              <span>tenant://review-intel-prod</span>
            </div>

            {/* Simulated interactive charts inside the Power BI frame */}
            <div className="flex-1 p-6 grid grid-cols-2 gap-4 relative bg-slate-900/90 select-none">
              
              {/* Grid backdrop graph decoration */}
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

              {/* Mock Chart 1 */}
              <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase">CSAT vs Review Volume</span>
                <div className="h-28 flex items-end gap-2.5 pt-4">
                  {[45, 60, 52, 78, 65, 90, 85].map((val, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1.5">
                      <div 
                        className="w-full rounded-t bg-[#f2c811] opacity-75 group-hover:opacity-100 transition-all duration-500" 
                        style={{ height: `${val * 0.9}px` }} 
                      />
                      <span className="text-[8px] font-mono text-slate-600">M{idx+1}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mock Chart 2 */}
              <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Cross-Channel Resolution</span>
                <div className="flex-1 flex items-center justify-center p-2 relative">
                  {/* Custom SVG gauge design */}
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle cx="48" cy="48" r="38" stroke="#1e293b" strokeWidth="6" fill="transparent" />
                    <circle cx="48" cy="48" r="38" stroke="#f2c811" strokeWidth="6" fill="transparent" 
                      strokeDasharray="238" strokeDashoffset="50" className="transition-all duration-500" />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-lg font-bold font-sans text-white">79%</span>
                    <span className="text-[7px] text-slate-500 uppercase tracking-wider">Health</span>
                  </div>
                </div>
              </div>

              {/* Mock Chart 3 */}
              <div className="col-span-2 bg-slate-950/80 rounded-xl p-4 border border-slate-800 flex justify-between items-center">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Active Data Rows Synced</span>
                  <span className="text-xl font-bold text-white font-mono">{totalRecords} rows</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Gateway Server latency</span>
                  <span className="text-xs font-mono text-slate-400 font-semibold">12ms (DirectQuery)</span>
                </div>
              </div>
            </div>
            
            {/* Embed footer controls */}
            <div className="bg-slate-950 px-4 py-2 border-t border-slate-800/80 flex justify-between items-center text-[9px] font-mono text-slate-500">
              <div className="flex items-center gap-3">
                <span className="hover:text-slate-300 cursor-pointer">File</span>
                <span className="hover:text-slate-300 cursor-pointer">Export</span>
                <span className="hover:text-slate-300 cursor-pointer">Share</span>
              </div>
              <span>Page 1 of 1</span>
            </div>
          </div>
        </div>

        {/* Right Column: Connection Meta Cards */}
        <div className="flex flex-col gap-5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Connection Metadata</span>

          {/* Sync Stats */}
          <div className="glass bg-white/30 rounded-2xl p-5 border border-white/20 shadow-premium space-y-4">
            
            {/* Sync Timestamp */}
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 flex-shrink-0">
                <Workflow className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Last Synced Timestamp</span>
                <span className="text-sm font-semibold text-slate-800 font-mono mt-0.5 block">{lastSyncTime}</span>
              </div>
            </div>

            {/* Gateway Status */}
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 flex-shrink-0">
                <Server className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider font-display">On-Premises Gateway</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`w-2 h-2 rounded-full ${gatewayStatus === 'Online' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  <span className="text-xs font-bold text-slate-800">{gatewayStatus} (Tenant Active)</span>
                </div>
              </div>
            </div>

            {/* Sync Records */}
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 flex-shrink-0">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Sync Transaction Volume</span>
                <span className="text-xs font-bold text-slate-800 mt-0.5 block">{totalRecords} Records Registered</span>
              </div>
            </div>
          </div>

          {/* Connection Logs */}
          <div className="glass bg-white/30 rounded-2xl p-5 border border-white/20 shadow-premium flex-1 flex flex-col">
            <span className="text-xs font-bold text-slate-800 font-display mb-3 block">Gateway Sync Log</span>
            
            <div className="flex-1 bg-slate-900/5 border border-slate-100 rounded-xl p-3 font-mono text-[10px] text-slate-500 space-y-2 h-[120px] overflow-y-auto">
              <div className="flex justify-between">
                <span>[INFO] Sync initialized...</span>
                <span>15:13:02</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>[SUCCESS] Tenant authenticated</span>
                <span>15:13:02</span>
              </div>
              <div className="flex justify-between">
                <span>[INFO] Exporting {totalRecords} active reviews</span>
                <span>15:13:03</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>[SUCCESS] Gateway sync confirmed</span>
                <span>{lastSyncTime.split(', ')[1]}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
