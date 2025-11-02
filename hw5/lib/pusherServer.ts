import Pusher from 'pusher';

let pusherInstance: Pusher | null = null;

export function getPusherServer(): Pusher | null {
  // 檢查環境變數是否存在
  const appId = process.env.PUSHER_APP_ID;
  const key = process.env.PUSHER_KEY;
  const secret = process.env.PUSHER_SECRET;
  const cluster = process.env.PUSHER_CLUSTER;

  // 如果沒有設定 Pusher，返回 null
  if (!appId || !key || !secret || !cluster || 
      appId === 'your-pusher-app-id' || 
      key === 'your-pusher-key') {
    return null;
  }

  if (!pusherInstance) {
    pusherInstance = new Pusher({
      appId,
      key,
      secret,
      cluster,
      useTLS: true,
    });
  }

  return pusherInstance;
}

export async function triggerPusherEvent(
  channel: string,
  event: string,
  data: any
): Promise<void> {
  const pusher = getPusherServer();
  if (pusher) {
    await pusher.trigger(channel, event, data);
  }
  // 如果 Pusher 未設定，靜默忽略（不影響功能）
}

