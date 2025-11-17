import { GameState, GamePhase, CharacterClass, GameTurnResult } from '@/types/game';
import Conversation from '@/models/Conversation';

/**
 * 建立新的遊戲會話
 */
export async function createNewConversation(lineUserId: string) {
  const conversation = new Conversation({
    lineUserId,
    messages: [],
    gameState: {
      phase: 'idle',
      character: {
        gold: 0,
        items: [],
      },
      progress: 0,
    },
  });
  await conversation.save();
  return conversation;
}

/**
 * 取得或建立使用者的遊戲會話
 */
export async function getOrCreateConversation(
  lineUserId: string,
  options?: { createNewIfGameOver?: boolean }
) {
  const { createNewIfGameOver = false } = options || {};
  let conversation = await Conversation.findOne({ lineUserId }).sort({ createdAt: -1 });
  
  // 如果沒有會話，自動建立
  if (!conversation) {
    return createNewConversation(lineUserId);
  }

  // 遊戲已結束時是否需要立即建立新會話
  if (conversation.gameState.phase === 'game_over' && createNewIfGameOver) {
    return createNewConversation(lineUserId);
  }
  
  return conversation;
}

/**
 * 更新遊戲狀態
 */
export async function updateGameState(
  lineUserId: string,
  updates: Partial<GameState>
) {
  const conversation = await Conversation.findOne({ lineUserId }).sort({ createdAt: -1 });
  if (!conversation) {
    throw new Error('Conversation not found');
  }

  // 更新遊戲狀態
  if (updates.phase) {
    conversation.gameState.phase = updates.phase;
  }
  if (updates.character) {
    conversation.gameState.character = {
      ...conversation.gameState.character,
      ...updates.character,
    };
  }
  if (updates.progress !== undefined) {
    conversation.gameState.progress = updates.progress;
  }
  if (updates.currentLocation) {
    conversation.gameState.currentLocation = updates.currentLocation;
  }

  await conversation.save();
  return conversation;
}

/**
 * 新增訊息到對話紀錄
 */
export async function addMessage(
  lineUserId: string,
  role: 'user' | 'assistant' | 'system',
  content: string,
  metadata?: any
) {
  const conversation = await Conversation.findOne({ lineUserId }).sort({ createdAt: -1 });
  if (!conversation) {
    throw new Error('Conversation not found');
  }

  conversation.messages.push({
    role,
    content,
    timestamp: new Date(),
    metadata,
  });

  await conversation.save();
  return conversation;
}

/**
 * 取得最近的對話訊息（用於 LLM context）
 */
export async function getRecentMessages(
  lineUserId: string,
  limit: number = 10
): Promise<Array<{ role: string; content: string }>> {
  const conversation = await Conversation.findOne({ lineUserId }).sort({ createdAt: -1 });
  if (!conversation) {
    return [];
  }

  return conversation.messages
    .slice(-limit)
    .map((msg: { role: string; content: string }) => ({
      role: msg.role,
      content: msg.content,
    }));
}

/**
 * 應用遊戲效果到遊戲狀態
 */
export async function applyGameEffects(
  lineUserId: string,
  effects: GameTurnResult['effects']
) {
  const conversation = await Conversation.findOne({ lineUserId }).sort({ createdAt: -1 });
  if (!conversation) {
    throw new Error('Conversation not found');
  }

  const { character } = conversation.gameState;

  // 更新 HP
  if (effects.hp_change !== undefined && character.hp !== undefined) {
    character.hp = Math.max(0, Math.min(character.maxHp || 100, character.hp + effects.hp_change));
  }

  // 更新金錢
  if (effects.gold_change !== undefined) {
    character.gold = (character.gold || 0) + effects.gold_change;
  }

  // 更新主線進度（新增）
  if (effects.progress_change !== undefined) {
    const delta = Math.max(0, effects.progress_change);

    if (delta === 0 && effects.progress_change < 0) {
      console.warn('Ignoring negative progress_change from LLM:', effects.progress_change);
    }

    if (delta > 0) {
      conversation.gameState.progress = Math.min(
        100,
        Math.max(0, conversation.gameState.progress + delta)
      );
    }
    
    // 強制檢查：如果進度達到 100%，觸發結局
    if (conversation.gameState.progress >= 100) {
      conversation.gameState.progress = 100;
      conversation.gameState.phase = 'game_over';
      // 注意：結局敘事會在 webhook 中處理
    }
  }

  // 更新道具
  if (effects.items_gained) {
    character.items = [...(character.items || []), ...effects.items_gained];
  }
  if (effects.items_lost) {
    character.items = (character.items || []).filter(
      (item) => !effects.items_lost!.includes(item)
    );
  }

  // 檢查遊戲結束
  if (effects.game_over || character.hp === 0) {
    conversation.gameState.phase = 'game_over';
  }

  await conversation.save();
  return conversation;
}

