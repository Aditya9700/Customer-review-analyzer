import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIInsights, ReviewData } from '../types';
import { 
  Sparkles, 
  ThumbsUp, 
  ThumbsDown, 
  Lightbulb, 
  FileText, 
  Send, 
  Bot, 
  User, 
  RefreshCw,
  Loader2 
} from 'lucide-react';
import { clsx } from 'clsx';

interface AiInsightsWorkspaceProps {
  insights: AIInsights;
  reviews: ReviewData[];
  isGenerating: boolean;
  onRegenerate: () => void;
}

interface ChatMessage {
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const AiInsightsWorkspace: React.FC<AiInsightsWorkspaceProps> = ({
  insights,
  reviews,
  isGenerating,
  onRegenerate
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'praises' | 'complaints' | 'recommendations'>('summary');
  const [promptText, setPromptText] = useState('');
  const [chatLog, setChatLog] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: "Hello! I am your AI Review Intelligence Assistant. I've analyzed the customer feedbacks. You can ask me specific questions like: 'What are the main battery complaints?', 'Tell me about sound quality praises', or 'Summarize recent delivery reviews'.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Clear chat log if reviews list resets or changes substantially
  useEffect(() => {
    setChatLog([
      {
        sender: 'ai',
        text: `Analysis updated. I've re-indexed ${reviews.length} reviews. What specific area would you like to drill down into?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [reviews.length]);

  const handleAskAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;

    const userMsgText = promptText;
    const userMsg: ChatMessage = {
      sender: 'user',
      text: userMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatLog(prev => [...prev, userMsg]);
    setPromptText('');
    setIsTyping(true);

    // Simulate AI thinking and generating a dynamic response based on reviews
    setTimeout(() => {
      let aiResponseText = '';
      const query = userMsgText.toLowerCase();

      // Simple keywords router for dataset-aware responses
      if (query.includes('battery') || query.includes('power') || query.includes('charge')) {
        const batteryReviews = reviews.filter(r => r.category === 'Battery');
        const pos = batteryReviews.filter(r => r.sentiment === 'Positive').length;
        const neg = batteryReviews.filter(r => r.sentiment === 'Negative').length;
        const sampleNeg = batteryReviews.find(r => r.sentiment === 'Negative')?.reviewText;

        aiResponseText = `**Battery Analytics:** Out of ${batteryReviews.length} reviews discussing battery, **${pos}** are Positive and **${neg}** are Negative. \n\n`;
        if (neg > 0) {
          aiResponseText += `*Key Customer Friction:* Users frequently report issues with GPS standby consumption and the strength of the charger's magnetic alignment. \n\n`;
          if (sampleNeg) {
            aiResponseText += `*Example complaint:* "${sampleNeg}"`;
          }
        } else {
          aiResponseText += `Battery feedback is exceptionally positive! Users praise the long runtime and fast charging cycles.`;
        }
      } 
      else if (query.includes('audio') || query.includes('sound') || query.includes('music') || query.includes('mic') || query.includes('speaker')) {
        const audioReviews = reviews.filter(r => r.category === 'Audio');
        const pos = audioReviews.filter(r => r.sentiment === 'Positive').length;
        const neg = audioReviews.filter(r => r.sentiment === 'Negative').length;
        const samplePos = audioReviews.find(r => r.sentiment === 'Positive')?.reviewText;

        aiResponseText = `**Audio Quality Analytics:** Sound feedback is highly active with **${pos}** Positive reviews and **${neg}** Negative reviews. \n\n`;
        if (pos > 0) {
          aiResponseText += `*Key Strengths:* Customers love the rich bass depth, noise cancellation capability, and vocal clarity. \n\n`;
          if (samplePos) {
            aiResponseText += `*Example praise:* "${samplePos}"`;
          }
        }
        if (neg > 0) {
          aiResponseText += `\n\n*Criticisms:* Minor remarks target quiet speakerphone volumes and faint static background sounds.`;
        }
      } 
      else if (query.includes('connect') || query.includes('bluetooth') || query.includes('sync') || query.includes('pair')) {
        const connReviews = reviews.filter(r => r.category === 'Connectivity');
        const pos = connReviews.filter(r => r.sentiment === 'Positive').length;
        const neg = connReviews.filter(r => r.sentiment === 'Negative').length;
        const sampleNeg = connReviews.find(r => r.sentiment === 'Negative')?.reviewText;

        aiResponseText = `**Connectivity Analytics:** We tracked ${connReviews.length} reviews focusing on Bluetooth and synchronization. **${pos}** are positive and **${neg}** are negative. \n\n`;
        if (neg > 0) {
          aiResponseText += `*Critical Issues:* The primary complaints involve Bluetooth pairing stutters in congested areas and long synchronization times in the companion app. \n\n`;
          if (sampleNeg) {
            aiResponseText += `*Example complaint:* "${sampleNeg}"`;
          }
        } else {
          aiResponseText += `Pairing performance is solid across the board with no outstanding connection faults reported in the active dataset.`;
        }
      } 
      else if (query.includes('deliver') || query.includes('ship') || query.includes('pack')) {
        const deliveryReviews = reviews.filter(r => r.category === 'Delivery');
        const pos = deliveryReviews.filter(r => r.sentiment === 'Positive').length;
        const neg = deliveryReviews.filter(r => r.sentiment === 'Negative').length;
        
        aiResponseText = `**Delivery & Logistics Analytics:** We have **${pos}** positive and **${neg}** negative feedbacks regarding delivery. \n\n`;
        if (neg > 0) {
          aiResponseText += `*Bottlenecks:* Delays occur primarily with regional postal services and poor handling resulting in dented packaging.`;
        } else {
          aiResponseText += `Shipping operations are highly efficient with fast transit times reported.`;
        }
      } 
      else if (query.includes('satisfaction') || query.includes('score') || query.includes('stats') || query.includes('summary')) {
        aiResponseText = `Based on the active dataset of **${reviews.length}** entries, our average customer satisfaction rating is **${insights.executiveSummary.match(/[\d.]+\/5.0/)?.[0] || '4.2/5.0'}**. Positive reviews represent the largest share. Product performance is led by visual display qualities and acoustic hardware.`;
      } 
      else {
        // Fallback response using keywords or generic helper
        aiResponseText = `Based on my current scan of the ${reviews.length} reviews, the core trends indicate high appreciation for the audio depth and visual display rendering. The primary area requiring strategic product attention involves connectivity sync speeds and logistics package protection. Let me know if you would like me to detail a specific category!`;
      }

      const aiMsg: ChatMessage = {
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatLog(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="glass rounded-3xl border border-white/40 shadow-premium overflow-hidden flex flex-col h-[640px] relative">
      {/* Glow highlight */}
      <div className="absolute -right-24 -top-24 w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl" />
      
      {/* Header */}
      <div className="p-6 border-b border-slate-100 bg-white/40 flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-gradient-to-tr from-slate-900 to-indigo-950 text-indigo-300 rounded-xl shadow-inner">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-display flex items-center gap-1.5">
              AI Review Analyst
            </h2>
            <p className="text-[10px] uppercase font-bold tracking-wider text-indigo-600">Copilot Engine Active</p>
          </div>
        </div>

        <button
          onClick={onRegenerate}
          disabled={isGenerating}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-950 border border-slate-200 hover:border-slate-300 rounded-xl bg-white hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-40"
        >
          {isGenerating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <RefreshCw className="w-3.5 h-3.5" />
          )}
          Regenerate Insights
        </button>
      </div>

      {/* Workspace Content split into two columns on large screens */}
      <div className="flex-1 grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 overflow-hidden">
        
        {/* Left Column: Aggregated Insights Tab Panel */}
        <div className="flex flex-col h-full overflow-hidden">
          {/* Tabs header */}
          <div className="flex bg-slate-50/50 p-1 border-b border-slate-100">
            {[
              { id: 'summary', label: 'Summary', icon: <FileText className="w-4 h-4" /> },
              { id: 'praises', label: 'Praises', icon: <ThumbsUp className="w-4 h-4" /> },
              { id: 'complaints', label: 'Complaints', icon: <ThumbsDown className="w-4 h-4" /> },
              { id: 'recommendations', label: 'Actions', icon: <Lightbulb className="w-4 h-4" /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={clsx(
                  "flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-lg transition-all",
                  activeTab === tab.id 
                    ? "bg-white text-indigo-700 shadow-sm border border-slate-200/50" 
                    : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
                )}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab content panel */}
          <div className="flex-1 p-6 overflow-y-auto bg-white/20">
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div 
                  key="skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="h-4 bg-slate-100 rounded w-1/3 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-3.5 bg-slate-100 rounded animate-pulse" />
                    <div className="h-3.5 bg-slate-100 rounded w-5/6 animate-pulse" />
                    <div className="h-3.5 bg-slate-100 rounded w-4/5 animate-pulse" />
                  </div>
                  <div className="pt-4 space-y-2">
                    <div className="h-4 bg-slate-100 rounded w-1/4 animate-pulse" />
                    <div className="h-3.5 bg-slate-100 rounded animate-pulse" />
                    <div className="h-3.5 bg-slate-100 rounded w-2/3 animate-pulse" />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  {activeTab === 'summary' && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-display">
                        Executive Summary
                      </h3>
                      <p className="text-slate-600 leading-relaxed text-sm bg-indigo-50/20 border border-indigo-100/50 p-4.5 rounded-2xl">
                        {insights.executiveSummary}
                      </p>
                    </div>
                  )}

                  {activeTab === 'praises' && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-emerald-800 uppercase tracking-wider font-display">
                        Key Customer Praises
                      </h3>
                      <div className="space-y-3">
                        {insights.keyPraises.map((praise, idx) => (
                          <div 
                            key={idx} 
                            className="flex items-start gap-3 bg-emerald-50/30 border border-emerald-100/30 p-3.5 rounded-2xl"
                          >
                            <span className="p-1 rounded-lg bg-emerald-100 text-emerald-700 font-bold text-xs flex-shrink-0">
                              +{idx + 1}
                            </span>
                            <p className="text-sm text-slate-600 font-medium leading-relaxed">
                              {praise}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'complaints' && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-rose-800 uppercase tracking-wider font-display">
                        Key Customer Complaints
                      </h3>
                      <div className="space-y-3">
                        {insights.keyComplaints.map((complaint, idx) => (
                          <div 
                            key={idx} 
                            className="flex items-start gap-3 bg-rose-50/30 border border-rose-100/30 p-3.5 rounded-2xl"
                          >
                            <span className="p-1 rounded-lg bg-rose-100 text-rose-700 font-bold text-xs flex-shrink-0">
                              -{idx + 1}
                            </span>
                            <p className="text-sm text-slate-600 font-medium leading-relaxed">
                              {complaint}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'recommendations' && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-indigo-800 uppercase tracking-wider font-display">
                        Strategic Recommendations
                      </h3>
                      <div className="space-y-3">
                        {insights.recommendations.map((rec, idx) => (
                          <div 
                            key={idx} 
                            className="flex items-start gap-3 bg-indigo-50/30 border border-indigo-100/30 p-3.5 rounded-2xl"
                          >
                            <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700 flex-shrink-0">
                              <Lightbulb className="w-3.5 h-3.5" />
                            </span>
                            <p className="text-sm text-slate-600 font-medium leading-relaxed">
                              {rec}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: AI Assistant Chat Interface */}
        <div className="flex flex-col h-full overflow-hidden bg-slate-50/20">
          {/* Chat messages viewport */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 flex flex-col">
            {chatLog.map((msg, idx) => (
              <div 
                key={idx}
                className={clsx(
                  "flex gap-3 max-w-[85%] rounded-2xl p-3.5 shadow-sm text-sm border",
                  msg.sender === 'ai' 
                    ? "self-start bg-white text-slate-700 border-slate-100" 
                    : "self-end bg-slate-900 text-slate-100 border-slate-950 flex-row-reverse"
                )}
              >
                {/* Avatar Icon */}
                <div className={clsx(
                  "p-1.5 rounded-lg flex-shrink-0 w-8 h-8 flex items-center justify-center border",
                  msg.sender === 'ai' 
                    ? "bg-slate-100 text-slate-800 border-slate-200" 
                    : "bg-slate-800 text-slate-200 border-slate-700"
                )}>
                  {msg.sender === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div className="flex flex-col gap-1 flex-1">
                  <div className="whitespace-pre-line font-medium leading-relaxed text-xs sm:text-sm">
                    {/* Render basic bold formatting in markdown style */}
                    {msg.text.split('\n').map((line, lIdx) => {
                      // Check for bold notation
                      const boldRegex = /\*\*(.*?)\*\*/g;
                      const parts = [];
                      let lastIndex = 0;
                      let match;
                      
                      while ((match = boldRegex.exec(line)) !== null) {
                        if (match.index > lastIndex) {
                          parts.push(line.substring(lastIndex, match.index));
                        }
                        parts.push(<strong key={match.index} className="font-extrabold text-slate-900 dark:text-white">{match[1]}</strong>);
                        lastIndex = boldRegex.lastIndex;
                      }
                      
                      if (lastIndex < line.length) {
                        parts.push(line.substring(lastIndex));
                      }

                      return <div key={lIdx}>{parts.length > 0 ? parts : line}</div>;
                    })}
                  </div>
                  <span className="text-[10px] text-slate-400 self-end font-mono mt-1">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="self-start bg-white text-slate-700 border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-slate-100 text-slate-800 flex-shrink-0 border border-slate-200">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>

          {/* Form input bar */}
          <form 
            onSubmit={handleAskAI}
            className="p-4 border-t border-slate-100 bg-white/40 flex items-center gap-2"
          >
            <input
              type="text"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Ask AI workspace a follow-up question..."
              className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-transparent transition-all bg-white bg-opacity-90"
            />
            <button
              type="submit"
              disabled={!promptText.trim()}
              className="p-2.5 rounded-xl bg-slate-900 text-white font-semibold shadow-md hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:hover:bg-slate-900 flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
