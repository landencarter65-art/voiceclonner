'use client';

import { useState, useEffect, useCallback } from 'react';
import Pusher from 'pusher-js';

export function useQueue() {
  const [userId] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('queue_user_id');
      if (saved) return saved;
      const newId = Math.random().toString(36).substring(7);
      localStorage.setItem('queue_user_id', newId);
      return newId;
    }
    return '';
  });

  const [currentUser, setCurrentUser] = useState<{ id: string; startTime: number } | null>(null);
  const [queue, setQueue] = useState<string[]>([]);
  const [isConnecting, setIsConnecting] = useState(true);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/queue');
      const data = await res.json();
      setCurrentUser(data.currentUser);
      setQueue(data.queue);
    } catch (e) {
      console.error('Queue fetch error', e);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const joinQueue = async () => {
    await fetch('/api/queue', {
      method: 'POST',
      body: JSON.stringify({ userId, action: 'join' }),
    });
  };

  const leaveQueue = async () => {
    await fetch('/api/queue', {
      method: 'POST',
      body: JSON.stringify({ userId, action: 'leave' }),
    });
  };

  useEffect(() => {
    fetchStatus();

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe('voice-queue');
    channel.bind('queue-update', (data: any) => {
      setCurrentUser(data.currentUser);
      setQueue(data.queue);
    });

    // Auto-join if not in queue/active
    joinQueue();

    const handleBeforeUnload = () => {
      leaveQueue();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [userId, fetchStatus]);

  const isActive = currentUser?.id === userId;
  const position = queue.indexOf(userId);
  const timeLeft = currentUser ? Math.max(0, 15 * 60 - Math.floor((Date.now() - currentUser.startTime) / 1000)) : 0;

  return {
    isActive,
    position,
    timeLeft,
    currentUser,
    queue,
    isConnecting,
  };
}
