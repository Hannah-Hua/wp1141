import { Client, Message, TextMessage, TemplateMessage, FlexMessage } from '@line/bot-sdk';
import { GameState, CharacterClass } from '@/types/game';

const client = new Client({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN!,
  channelSecret: process.env.LINE_CHANNEL_SECRET!,
});

/**
 * 驗證 LINE Webhook 簽名
 */
export function validateSignature(body: string, signature: string): boolean {
  const crypto = require('crypto');
  const hash = crypto
    .createHmac('sha256', process.env.LINE_CHANNEL_SECRET!)
    .update(body)
    .digest('base64');
  return hash === signature;
}

/**
 * 回覆文字訊息
 */
export async function replyTextMessage(replyToken: string, text: string) {
  await client.replyMessage(replyToken, {
    type: 'text',
    text,
  });
}

/**
 * 回覆按鈕模板訊息
 */
export async function replyButtonsMessage(
  replyToken: string,
  altText: string,
  text: string,
  actions: Array<{ label: string; text: string }>
) {
  await client.replyMessage(replyToken, {
    type: 'template',
    altText,
    template: {
      type: 'buttons',
      text,
      actions: actions.map((action) => ({
        type: 'message',
        label: action.label,
        text: action.text,
      })),
    },
  });
}

/**
 * 回覆職業選擇按鈕
 */
export async function replyClassSelectionMessage(replyToken: string, name: string) {
  await client.replyMessage(replyToken, {
    type: 'template',
    altText: '請選擇你的職業',
    template: {
      type: 'buttons',
      text: `歡迎你，${name}。\n你似乎來到了一個結合「魔法」與「資訊系統」的奇異世界……\n\n在這裡，每個學生都會選擇一種「修煉方向」。\n請選擇你的職業：`,
      actions: [
        {
          type: 'message',
          label: '1️⃣ 程式法師（Coder Mage）',
          text: '1',
        },
        {
          type: 'message',
          label: '2️⃣ 資料騎士（Data Knight）',
          text: '2',
        },
        {
          type: 'message',
          label: '3️⃣ 簡報遊俠（Slide Ranger）',
          text: '3',
        },
      ],
    },
  });
}

/**
 * 分割長文字為多個訊息（LINE 文字訊息限制 5000 字元）
 */
function splitLongText(text: string, maxLength: number = 4000): string[] {
  if (text.length <= maxLength) {
    return [text];
  }
  
  const messages: string[] = [];
  let currentIndex = 0;
  
  while (currentIndex < text.length) {
    let endIndex = currentIndex + maxLength;
    
    // 如果還沒到結尾，嘗試在句號、換行符或空格處分割
    if (endIndex < text.length) {
      const lastPeriod = text.lastIndexOf('。', endIndex);
      const lastNewline = text.lastIndexOf('\n', endIndex);
      const lastSpace = text.lastIndexOf(' ', endIndex);
      
      // 優先選擇句號，其次是換行符，最後是空格
      if (lastPeriod > currentIndex + maxLength * 0.5) {
        endIndex = lastPeriod + 1;
      } else if (lastNewline > currentIndex + maxLength * 0.5) {
        endIndex = lastNewline + 1;
      } else if (lastSpace > currentIndex + maxLength * 0.5) {
        endIndex = lastSpace + 1;
      }
    }
    
    messages.push(text.substring(currentIndex, endIndex));
    currentIndex = endIndex;
  }
  
  return messages;
}

/**
 * 產生進度條
 */
function getProgressBar(progress: number): string {
  const filled = Math.floor(progress / 10);
  const empty = 10 - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

/**
 * 將敘事整理為符合 LINE Template 限制（最多 160 字、移除多餘換行）
 */
function formatTemplateText(text: string, maxLength: number = 160): string {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (!normalized) {
    return '請選擇你的行動：';
  }
  return normalized.substring(0, maxLength);
}

/**
 * 回覆遊戲選項按鈕（支援長文字分割）
 */
export async function replyGameOptionsMessage(
  replyToken: string,
  narration: string,
  options: string[],
  gameState?: { progress?: number }
) {
  // 確保至少有選項
  if (!options || options.length === 0) {
    console.warn('No options provided, using default options');
    options = ['繼續探索', '查看當前狀態', '稍後再試'];
  }
  
  // 如果選項超過 4 個，只取前 4 個
  const displayOptions = options.slice(0, 4);
  
  // 確保至少有 2 個選項（LINE 要求）
  if (displayOptions.length < 2) {
    displayOptions.push('繼續探索', '查看當前狀態');
    displayOptions.splice(4); // 限制在 4 個以內
  }
  
  // 如果有進度資訊，在敘事中加入進度提示
  let finalNarration = narration;
  if (gameState?.progress !== undefined) {
    const progressBar = getProgressBar(gameState.progress);
    const progressText = `\n\n📊 主線進度：${gameState.progress}% ${progressBar}`;
    finalNarration = narration + progressText;
  }
  
  // 建立敘事文字訊息（可分段）
  const narrationParts = splitLongText(finalNarration, 1200);
  const maxTextMessages = 4; // LINE 最多 5 則訊息，保留 1 則給按鈕
  let limitedParts = narrationParts.slice(0, maxTextMessages);
  if (narrationParts.length > maxTextMessages) {
    limitedParts[maxTextMessages - 1] += '\n...(內容較長，已截斷)';
  }
  const textMessages = limitedParts.map((part) => ({
    type: 'text',
    text: part,
  })) as Message[];

  // 建立按鈕模板訊息（文字固定，避免限制）
  const templateMessage: TemplateMessage = {
    type: 'template',
    altText: formatTemplateText(finalNarration, 400),
    template: {
      type: 'buttons',
      text: '請選擇你的行動：',
      actions: displayOptions.map((option, index) => ({
        type: 'message',
        label: option.substring(0, 20),
        text: `${index + 1}`,
      })),
    },
  };

  const messages: Message[] = [...textMessages, templateMessage];

  await client.replyMessage(replyToken, messages);
}

/**
 * 回覆遊戲開始訊息
 */
export async function replyGameStartMessage(replyToken: string) {
  const text = `🕳️ 你站在資管系地下室的走廊，手上的筆電突然閃爍，

你發現有一扇從未看過的門，上面寫著：

**「位元交界點：未授權者禁止進入」**

你還沒來得及反應，門突然發出藍色的光，把你吸了進去……

你醒來時，已經位於一個陌生的空間。

💬 請輸入你的名字（遊戲中使用）`;

  await client.replyMessage(replyToken, {
    type: 'text',
    text,
  });
}

/**
 * 回覆職業確認訊息
 */
export async function replyClassConfirmationMessage(
  replyToken: string,
  className: CharacterClass
) {
  const classInfo = {
    coder_mage: {
      name: '程式法師',
      description: '你的手心浮現了奇怪的符文，像是 Python 的語法提示……',
    },
    data_knight: {
      name: '資料騎士',
      description: '你的手中出現了一本閃爍的資料庫手冊，散發著結構化的光芒……',
    },
    slide_ranger: {
      name: '簡報遊俠',
      description: '你的眼前浮現了精美的簡報模板，散發著說服力的氣息……',
    },
  };

  const info = classInfo[className];
  const text = `你選擇了 **${info.name}**。

${info.description}

你正站在一個類似台大校園的大門前，
但天空中漂浮著看起來像巨大程式碼的符文，
這裡並不是現實世界的校園。

你的冒險從 **平行台大大門** 開始。

請問你想要：`;

  await client.replyMessage(replyToken, {
    type: 'template',
    altText: text,
    template: {
      type: 'buttons',
      text: text.substring(0, 160),
      actions: [
        {
          type: 'message',
          label: '1️⃣ 前往「管理學院」查看狀況',
          text: '1',
        },
        {
          type: 'message',
          label: '2️⃣ 走向「椰林大道」探索',
          text: '2',
        },
        {
          type: 'message',
          label: '3️⃣ 嘗試回到原本世界（失敗機率很高）',
          text: '3',
        },
      ],
    },
  });
}

/**
 * 回覆遊戲結束訊息
 */
export async function replyGameOverMessage(replyToken: string, isVictory: boolean) {
  const text = isVictory
    ? `🎉 恭喜你完成了冒險！

你成功找到了「星光之心」，逆轉了 Deadline，回到了原本的世界。

遊戲結束！你可以輸入【開始冒險】展開新的冒險。`
    : `💀 遊戲結束

你的 HP 歸零，冒險失敗了。

遊戲結束！你可以輸入【開始冒險】展開新的冒險。`;

  await client.replyMessage(replyToken, {
    type: 'text',
    text,
  });
}

export { client };

