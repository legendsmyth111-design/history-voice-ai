'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, MessageSquare, Compass, Library, Volume2, Info } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'AI Chatbot', href: '/', icon: MessageSquare },
    { name: 'Explore Topics', href: '/explore', icon: Compass },
    { name: 'Book Library', href: '/books', icon: Library },
    { name: 'Voice Reader', href: '/voice-tools', icon: Volume2 },
    { name: 'About Project', href: '/about', icon: Info },
  ];

  return (
    <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-xl">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg text-white">HistoryVoice AI</span>
        </Link>

        <div className="flex flex-wrap items-center gap-1 md:gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-medium">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
