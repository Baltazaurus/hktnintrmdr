'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User as UserIcon } from 'lucide-react';
import { buildChatbotGreeting } from '@/lib/mockData';

type Msg = { role: 'bot' | 'user'; text: string };

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mount: read context from chatbotContext (populated by camera flow) and greet accordingly.
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
    // Mock reply — swap with real LLM call later.
    setTimeout(() => {
      setMessages(m => [...m, {
        role: 'bot',
        text: 'Mock response: in production this would call your LLM with the latest pollution data + user report context.',
      }]);
    }, 600);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-9rem)] md:h-[calc(100vh-6rem)] max-w-2xl mx-auto">
      {/* Chatbot header — uses dusk per brand spec */}
      <div className="bg-dusk text-sand-light px-5 py-4 md:rounded-t-3xl flex items-center gap-3 shadow-soft">
        <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
          <Bot className="w-5 h-5" />
        </div>
        <div>
          <p className="font-display font-bold">DanubeGuard AI</p>
          <p className="text-xs opacity-75">Context-aware water-quality assistant</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto bg-sand-light px-4 py-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'bot' && (
              <div className="w-7 h-7 rounded-full bg-dusk/20 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-dusk" />
              </div>
            )}
            <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
              m.role === 'user'
                ? 'bg-dusk text-sand-light rounded-br-sm'
                : 'bg-white text-dusk-dark rounded-bl-sm shadow-soft'
            }`}>
              {m.text}
            </div>
            {m.role === 'user' && (
              <div className="w-7 h-7 rounded-full bg-grass/60 flex items-center justify-center flex-shrink-0">
                <UserIcon className="w-4 h-4 text-dusk-dark" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="bg-sand-light p-3 md:rounded-b-3xl border-t border-grass/40 flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Ask about water quality, satellites, your report…"
          className="flex-1 bg-white rounded-2xl px-4 py-3 text-sm outline-none border border-grass/40 focus:border-water-dark"
        />
        <button onClick={send} aria-label="Send"
          className="w-12 h-12 rounded-2xl bg-dusk hover:bg-dusk-dark text-sand-light flex items-center justify-center shadow-soft active:scale-95 transition">
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
