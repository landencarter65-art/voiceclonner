import { NextResponse } from 'next/server';
import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

// In-memory queue state (Note: On Render, this resets on redeploy/restart)
// For a production SaaS, use Redis or a DB.
let currentUser: { id: string; startTime: number } | null = null;
let queue: string[] = [];

const SESSION_DURATION = 15 * 60 * 1000; // 15 minutes

const checkCleanup = () => {
  if (currentUser && Date.now() - currentUser.startTime > SESSION_DURATION) {
    currentUser = null;
    if (queue.length > 0) {
      const nextId = queue.shift();
      if (nextId) {
        currentUser = { id: nextId, startTime: Date.now() };
      }
    }
    // Notify all
    pusher.trigger('voice-queue', 'queue-update', {
      currentUser,
      queue,
    });
  }
};

export async function POST(req: Request) {
  checkCleanup();
  const { userId, action } = await req.json();

  if (action === 'join') {
    if (!currentUser) {
      currentUser = { id: userId, startTime: Date.now() };
    } else if (!queue.includes(userId) && currentUser.id !== userId) {
      queue.push(userId);
    }
  } else if (action === 'leave') {
    if (currentUser?.id === userId) {
      currentUser = null;
      if (queue.length > 0) {
        const nextId = queue.shift();
        if (nextId) {
          currentUser = { id: nextId, startTime: Date.now() };
        }
      }
    } else {
      queue = queue.filter(id => id !== userId);
    }
  }

  await pusher.trigger('voice-queue', 'queue-update', {
    currentUser,
    queue,
  });

  return NextResponse.json({ currentUser, queue });
}

export async function GET() {
  checkCleanup();
  return NextResponse.json({ currentUser, queue });
}
