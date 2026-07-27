'use client';

import React, { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Send, Bot, User } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Assalam-o-Alaikum! Main HistoryVoice AI Assistant hon. Aap Subcontinent ki history, rare literature, ya kisi bhi educational topic ke baare mein sawal pooch sakte hain.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await response.json();
      if (data.reply) {
        setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages([...newMessages, { role: 'assistant', content: 'Server Error: Response nahi mil saka.' }]);
      }
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: 'Network Error.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6 flex flex-col">
        <div className="flex-1 bg-slate-900/40 border border-slate-800 rounded-2xl p-4 overflow-y-auto mb-4 space-y-4 max-h-[65vh]">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-indigo-400" />
                </div>
              )}
              <div className={`p-4 rounded-2xl text-sm max-w-[80%] ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-200'}`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-slate-300" />
                </div>
              )}
            </div>
          ))}
          {loading && <p className="text-xs text-indigo-400 animate-pulse">AI Soch raha hai...</p>}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about history or rare books..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500"
          />
          <button type="submit" disabled={loading} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-medium flex items-center gap-2">
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </main>
    </div>
  );
}
