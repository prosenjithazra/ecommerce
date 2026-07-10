"use client";

import React, { useState } from 'react';
import { useApp } from '../../components/AppContext';
import { Breadcrumb, EmptyState } from '../../components/UIComponents';
import { Bell, ShieldAlert, Sparkles, Truck, Check, Eye } from 'lucide-react';

export default function NotificationsPage() {
  const { notifications, markNotificationsAsRead } = useApp();
  const [list, setList] = useState(notifications);

  const handleMarkRead = (id: string) => {
    setList(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllRead = () => {
    markNotificationsAsRead();
    setList(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'promo':
        return <Sparkles className="w-5 h-5 text-indigo-500" />;
      case 'shipping':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'order':
      default:
        return <ShieldAlert className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-16">
      <Breadcrumb items={[{ name: "Notifications" }]} />

      <div className="flex justify-between items-center pb-3 border-b border-zinc-150">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-zinc-909 dark:text-white tracking-tight flex items-center gap-2">
            <Bell className="w-7 h-7 text-indigo-500 animate-swing" /> Notifications
          </h1>
          <p className="text-xs text-zinc-400">Stay updated on custom prints promotions and orders statuses.</p>
        </div>
        <button
          onClick={handleMarkAllRead}
          className="text-xs font-bold text-indigo-650 hover:underline flex items-center gap-1"
        >
          <Check className="w-4 h-4" /> Mark all read
        </button>
      </div>

      {list.length === 0 ? (
        <EmptyState
          title="All caught up!"
          description="You don't have any pending alerts or promotion campaigns."
          icon={<Bell className="w-8 h-8" />}
        />
      ) : (
        <div className="space-y-4">
          {list.map(notif => (
            <div 
              key={notif.id} 
              className={`p-4 border rounded-2xl bg-white dark:bg-zinc-900/60 flex gap-4 transition-all ${notif.read ? 'border-zinc-200 dark:border-zinc-800 opacity-70' : 'border-indigo-500 shadow-md shadow-indigo-50/20'}`}
            >
              <div className="w-10 h-10 bg-zinc-55 dark:bg-zinc-850 rounded-xl flex items-center justify-center flex-shrink-0">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white">{notif.title}</h4>
                  <span className="text-[10px] text-zinc-400 font-medium">{notif.date}</span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-normal">
                  {notif.message}
                </p>
                {!notif.read && (
                  <button
                    onClick={() => handleMarkRead(notif.id)}
                    className="text-[10px] font-bold text-indigo-650 hover:underline flex items-center gap-1 mt-3"
                  >
                    <Eye className="w-3.5 h-3.5" /> Mark as Read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
