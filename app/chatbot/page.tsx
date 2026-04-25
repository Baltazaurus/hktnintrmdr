'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User as UserIcon } from 'lucide-react';
import { buildChatbotGreeting } from '@/lib/mockData';
import { useT } from '@/lib/useT';

type Msg = { role: 'bot' | 'user'; text: string };

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = useT();

  useEffect(() => {
    setMessages([{ role: 'bot', text: buildChatbotGreeting() }]);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages(m => [...m, { role: 'user', text: trimmed }]);
    setInput('');
    setTimeout(() => {
      setMessages(m => [...m, {
        role: 'bot',
        text: 'Mock response: in production this would call your LLM with the latest pollution data + user report context.',
      }]);
    }, 600);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-9rem)] md:h-[calc(100vh-6rem)] max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-dusk text-white px-5 py-4 md:rounded-t-3xl flex items-center gap-3 shadow-soft">
        <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
          <Bot className="w-5 h-5" />
        </div>
        <div>
          <p className="font-display font-bold">DanubeGuard AI</p>
          <p className="text-xs opacity-75">Context-aware water-quality assistant</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef}
           className="flex-1 overflow-y-auto bg-gray-50 dark:bg-[#111827] px-4 py-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'bot' && (
              <div className="w-7 h-7 rounded-full bg-dusk/15 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-dusk" />
              </div>
            )}
            <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
              m.role === 'user'
                ? 'bg-dusk text-white rounded-br-sm'
                : 'bg-white dark:bg-[#1f2937] text-gray-800 dark:text-gray-200 rounded-bl-sm shadow-soft'
            }`}>
              {m.text}
            </div>
            {m.role === 'user' && (
              <div className="w-7 h-7 rounded-full bg-grass/40 flex items-center justify-center flex-shrink-0">
                <UserIcon className="w-4 h-4 text-dusk-dark" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="bg-white dark:bg-[#1f2937] p-3 md:rounded-b-3xl
                      border-t border-grass/30 dark:border-[#374151] flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder={t('chat.placeholder')}
          className="flex-1 bg-gray-50 dark:bg-[#374151] text-gray-900 dark:text-gray-100
                     placeholder:text-gray-400 dark:placeholder:text-gray-500
                     rounded-2xl px-4 py-3 text-sm outline-none
                     border border-grass/30 dark:border-[#4b5563]
                     focus:border-dusk dark:focus:border-dusk-light transition"
        />
        <button onClick={send} aria-label="Send"
          className="w-12 h-12 rounded-2xl bg-dusk hover:bg-dusk-dark text-white
                     flex items-center justify-center shadow-soft active:scale-95 transition">
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
