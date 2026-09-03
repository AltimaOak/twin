import React, { useState, useRef, useEffect } from 'react';
import type { VehicleConfig } from '../../data/vehicleConfigurations';
import type { SidebarTab } from '../Sidebar/Sidebar';
import type { ChatMessage } from './chatbotKnowledge';
import {
  generateDiagnosticResponse,
  getInitialSuggestedPrompts
} from './chatbotKnowledge';
import {
  X,
  Send,
  RotateCcw,
  User,
  ArrowRight,
  ShieldAlert,
  Lightbulb,
  AlertCircle
} from 'lucide-react';

// ─────────────────────────────── AUTHENTIC CHATBOT ICON ───────────────────────────────
export const ChatbotIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Antenna with signal ball */}
    <path d="M12 5V2" />
    <circle cx="12" cy="2" r="1" fill="currentColor" />
    {/* Chat bubble body with speech pointer */}
    <path d="M4 9a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v5a4 4 0 0 1-4 4h-4l-4 3v-3a4 4 0 0 1-4-4V9z" />
    {/* Digital Eyes */}
    <circle cx="9" cy="11" r="1.2" fill="currentColor" />
    <circle cx="15" cy="11" r="1.2" fill="currentColor" />
    {/* Expressive smile */}
    <path d="M9.5 14.5c.8.6 1.7.9 2.5.9s1.7-.3 2.5-.9" />
  </svg>
);

interface DiagnosticChatbotProps {
  vehicleConfig: VehicleConfig;
  onNavigateTab: (tab: SidebarTab) => void;
  isOpenExternal?: boolean;
  onToggleExternal?: () => void;
}

// ─────────────────────────────── RICH MESSAGE FORMATTER ───────────────────────────────
const highlightRupees = (text: string): React.ReactNode => {
  if (!text.includes('₹')) return text;
  const tokens = text.split(/(₹[\d,]+(?:\s*–\s*₹[\d,]+)?)/g);
  return tokens.map((token, i) => {
    if (token.startsWith('₹')) {
      return (
        <span
          key={i}
          className="inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded-md bg-orange-50 text-orange-900 font-bold font-mono text-[11px] border border-orange-200/80 shadow-2xs"
        >
          {token}
        </span>
      );
    }
    return token;
  });
};

const parseInlineMarkdown = (str: string): React.ReactNode => {
  const parts = str.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);
      return (
        <strong key={index} className="font-bold text-stone-950">
          {highlightRupees(boldText)}
        </strong>
      );
    }
    return <span key={index}>{highlightRupees(part)}</span>;
  });
};

const FormattedContent: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let currentBullets: React.ReactNode[] = [];

  const flushBullets = () => {
    if (currentBullets.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="space-y-1.5 my-1.5 pl-0.5">
          {currentBullets}
        </ul>
      );
      currentBullets = [];
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushBullets();
      return;
    }

    // 1. Heading (### ...)
    if (trimmed.startsWith('### ')) {
      flushBullets();
      const headingText = trimmed.replace('### ', '');
      elements.push(
        <div
          key={`heading-${idx}`}
          className="font-bold text-stone-900 text-xs tracking-tight pb-1.5 pt-1 border-b border-stone-100 flex items-center gap-1.5 my-1.5"
        >
          <span className="w-1.5 h-3.5 bg-orange-600 rounded-full" />
          <span>{headingText}</span>
        </div>
      );
      return;
    }

    // 2. Driver Safety Tip / Callout (💡 ...)
    if (trimmed.startsWith('💡 ')) {
      flushBullets();
      const tipContent = trimmed.replace('💡 ', '');
      elements.push(
        <div
          key={`tip-${idx}`}
          className="mt-2.5 p-2.5 rounded-xl bg-amber-50/90 border border-amber-200/90 text-amber-950 text-[11px] leading-relaxed flex items-start gap-2 shadow-2xs"
        >
          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">{parseInlineMarkdown(tipContent)}</div>
        </div>
      );
      return;
    }

    // 3. Bullet Point (• ...)
    if (trimmed.startsWith('• ') || trimmed.startsWith('- ')) {
      const bulletContent = trimmed.replace(/^[•-]\s*/, '');
      currentBullets.push(
        <li key={`bullet-${idx}`} className="flex items-start gap-2 text-stone-700 leading-relaxed text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
          <div className="flex-1">{parseInlineMarkdown(bulletContent)}</div>
        </li>
      );
      return;
    }

    // 4. Alert diagnosis item (e.g. **1. [P0300] ...)
    if (/^\*\*\d+\./.test(trimmed)) {
      flushBullets();
      elements.push(
        <div key={`alert-${idx}`} className="font-bold text-stone-900 text-xs pt-1.5 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <div>{parseInlineMarkdown(trimmed)}</div>
        </div>
      );
      return;
    }

    // 5. Standard paragraph
    flushBullets();
    elements.push(
      <p key={`p-${idx}`} className="text-stone-700 leading-relaxed text-xs">
        {parseInlineMarkdown(trimmed)}
      </p>
    );
  });

  flushBullets();
  return <div className="space-y-1">{elements}</div>;
};

// ─────────────────────────────── MAIN CHATBOT COMPONENT ───────────────────────────────
export const DiagnosticChatbot: React.FC<DiagnosticChatbotProps> = ({
  vehicleConfig,
  onNavigateTab,
  isOpenExternal,
  onToggleExternal
}) => {
  const [isOpenInternal, setIsOpenInternal] = useState(false);
  const isOpen = isOpenExternal !== undefined ? isOpenExternal : isOpenInternal;

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const msgIdCounter = useRef(0);

  // Initialize or reset conversation when vehicle changes
  useEffect(() => {
    const initialPrompts = getInitialSuggestedPrompts(vehicleConfig);
    setSuggestedPrompts(initialPrompts);

    const alertText =
      vehicleConfig.alerts.length > 0
        ? ` Note: I detected **${vehicleConfig.alerts.length} active alert(s)** that you may want to review.`
        : ' All monitored vehicle subsystems are reporting normal values.';

    setMessages([
      {
        id: 'welcome',
        sender: 'assistant',
        text: `Hello! I'm your **MotoMind Copilot** for your **${vehicleConfig.model.name}** (${vehicleConfig.model.year}).${alertText}\n\nAsk me anything about your trouble codes, battery health, coolant temperature, or maintenance costs in ₹.`,
        timestamp: 'Just now'
      }
    ]);
  }, [vehicleConfig]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    msgIdCounter.current += 1;
    const userMessage: ChatMessage = {
      id: `user-${msgIdCounter.current}`,
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    // Simulate natural thinking delay
    setTimeout(() => {
      const response = generateDiagnosticResponse(query, vehicleConfig);
      msgIdCounter.current += 1;
      const botMessage: ChatMessage = {
        id: `bot-${msgIdCounter.current}`,
        sender: 'assistant',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: response.action
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 450);
  };

  const handleResetChat = () => {
    const alertText =
      vehicleConfig.alerts.length > 0
        ? ` Note: I detected **${vehicleConfig.alerts.length} active alert(s)**.`
        : ' All systems are operating normally.';

    setMessages([
      {
        id: 'welcome-reset',
        sender: 'assistant',
        text: `Conversation cleared. Connected to your **${vehicleConfig.model.name}**.${alertText}\n\nHow can I help you today?`,
        timestamp: 'Just now'
      }
    ]);
  };

  const handleActionClick = (tab: SidebarTab) => {
    onNavigateTab(tab);
    // On small mobile screens, close the chat so user can see the tab
    if (window.innerWidth < 640) {
      if (onToggleExternal) {
        onToggleExternal();
      } else {
        setIsOpenInternal(false);
      }
    }
  };

  const alertCount = vehicleConfig.alerts.length;

  return (
    <>
      {/* ─────────────────────────────── COMPACT & NICE FLOATING ACTION BUTTON ─────────────────────────────── */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => {
            if (onToggleExternal) {
              onToggleExternal();
            } else {
              setIsOpenInternal(true);
            }
          }}
          className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 flex items-center gap-2 px-3.5 py-2 rounded-full bg-stone-900/95 hover:bg-orange-600 text-white shadow-lg hover:shadow-orange-600/30 border border-stone-800 hover:border-orange-500 hover:scale-105 active:scale-95 transition-all duration-200 group cursor-pointer"
          aria-label="Open Automotive Copilot"
        >
          <div className="relative flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 group-hover:text-white flex items-center justify-center transition-colors">
              <ChatbotIcon className="w-3.5 h-3.5" />
            </div>
            {alertCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400 ring-1 ring-stone-900 animate-ping" />
            )}
          </div>

          <span className="text-xs font-bold font-display tracking-tight pr-0.5">
            Copilot
          </span>

          {alertCount > 0 ? (
            <span className="w-4 h-4 rounded-full bg-amber-500 text-stone-950 font-black text-[9px] flex items-center justify-center">
              {alertCount}
            </span>
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          )}
        </button>
      )}

      {/* ─────────────────────────────── COMPACT & SLEEK CHAT WINDOW CARD ─────────────────────────────── */}
      {isOpen && (
        <>
          {/* Backdrop on mobile */}
          <div
            className="sm:hidden fixed inset-0 z-40 bg-stone-950/40 backdrop-blur-xs"
            onClick={() => {
              if (onToggleExternal) {
                onToggleExternal();
              } else {
                setIsOpenInternal(false);
              }
            }}
          />

          {/* Compact Chat Container: Wider & Lower Height */}
          <div className="fixed z-50 inset-x-3 bottom-3 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[380px] h-[435px] sm:h-[455px] max-h-[75vh] bg-white border border-stone-200/90 rounded-2xl shadow-xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-3.5 py-2.5 bg-gradient-to-r from-[#faf8f5] to-[#f4eee3] border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center shadow-xs">
                    <ChatbotIcon className="w-4 h-4" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-1.5 ring-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-stone-900 font-display leading-none">MotoMind Copilot</span>
                    <span className="px-1 py-0.2 rounded text-[8px] font-bold bg-orange-100 text-orange-800 border border-orange-200">
                      Live
                    </span>
                  </div>
                  <div className="text-[10px] text-stone-500 font-medium truncate max-w-[170px] mt-0.5">
                    {vehicleConfig.model.name}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={handleResetChat}
                  title="Clear conversation"
                  className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-white/80 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (onToggleExternal) {
                      onToggleExternal();
                    } else {
                      setIsOpenInternal(false);
                    }
                  }}
                  title="Close Copilot"
                  className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-white/80 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Message History */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-[11px] bg-[#faf8f5]/40">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'assistant' && (
                    <div className="w-6 h-6 rounded-lg bg-orange-100/90 text-orange-700 flex items-center justify-center shrink-0 mt-0.5 border border-orange-200/80 shadow-2xs">
                      <ChatbotIcon className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div className={`max-w-[88%] space-y-1.5`}>
                    <div
                      className={`p-2.5 sm:p-3 rounded-xl text-[11px] leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-br from-stone-900 to-stone-850 text-white rounded-tr-xs shadow-xs font-medium'
                          : 'bg-white text-stone-800 rounded-tl-xs border border-stone-200/90 shadow-2xs'
                      }`}
                    >
                      {msg.sender === 'assistant' ? (
                        <FormattedContent text={msg.text} />
                      ) : (
                        <div className="whitespace-pre-wrap">{msg.text}</div>
                      )}
                    </div>

                    {/* Action Deep-Link Button */}
                    {msg.action && (
                      <button
                        type="button"
                        onClick={() => handleActionClick(msg.action!.tab)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 text-orange-950 text-[10px] font-bold border border-orange-200/90 shadow-2xs transition-all cursor-pointer group"
                      >
                        <span>{msg.action.label}</span>
                        <ArrowRight className="w-3 h-3 text-orange-600 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    )}

                    <div
                      className={`text-[8px] text-stone-400 px-0.5 ${
                        msg.sender === 'user' ? 'text-right' : 'text-left'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-6 h-6 rounded-lg bg-stone-200 text-stone-700 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-center gap-2 text-stone-400 text-[11px] py-0.5">
                  <div className="w-6 h-6 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center shrink-0 border border-orange-200">
                    <ChatbotIcon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex gap-1 items-center px-2.5 py-1.5 rounded-xl bg-white border border-stone-200 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Chips */}
            {suggestedPrompts.length > 0 && (
              <div className="px-3 py-1.5 bg-[#fbf9f4] border-t border-stone-200/80 flex items-center gap-1 overflow-x-auto no-scrollbar">
                <span className="text-[9px] text-stone-400 font-semibold shrink-0">Try:</span>
                {suggestedPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSend(prompt)}
                    className="px-2 py-0.5 rounded-lg bg-white hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300 border border-stone-200 text-[10px] text-stone-700 font-medium whitespace-nowrap shrink-0 transition-all shadow-2xs cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Input Bar */}
            <div className="p-2.5 bg-white border-t border-stone-200">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-1.5"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a diagnostic question..."
                  className="flex-1 bg-[#fbf9f4] border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 shadow-2xs"
                />

                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="p-1.5 rounded-lg bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 disabled:opacity-40 disabled:hover:from-orange-600 disabled:hover:to-orange-500 text-white shadow-xs transition-all shrink-0 cursor-pointer"
                  title="Send Question"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
              <div className="flex items-center justify-between text-[9px] text-stone-400 mt-1.5 px-0.5">
                <span>Enter to send</span>
                <span className="flex items-center gap-1 text-stone-500">
                  <ShieldAlert className="w-2.5 h-2.5 text-orange-500" />
                  OBD-II Active
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
