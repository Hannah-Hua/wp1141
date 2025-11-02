import Pusher from 'pusher-js';

let pusherInstance: Pusher | null = null;

export const getPusher = () => {
  // 檢查環境變數是否存在
  const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
  const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

  // 如果沒有設定 Pusher，返回 null
  if (!pusherKey || !pusherCluster || pusherKey === 'your-pusher-key') {
    return null;
  }

  if (!pusherInstance) {
    pusherInstance = new Pusher(pusherKey, {
      cluster: pusherCluster,
    });
  }
  return pusherInstance;
};

