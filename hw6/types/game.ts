// 遊戲角色職業類型
export type CharacterClass = 'coder_mage' | 'data_knight' | 'slide_ranger';

// 遊戲狀態階段
export type GamePhase = 
  | 'idle'           // 未開始
  | 'creating_name'  // 輸入名稱
  | 'choosing_class' // 選擇職業
  | 'playing'        // 遊戲進行中
  | 'game_over';     // 遊戲結束

// 遊戲效果
export interface GameEffects {
  hp_change?: number;
  gold_change?: number;
  progress_change?: number; // 主線進度變化
  items_gained?: string[];
  items_lost?: string[];
  game_over?: boolean;
}

// LLM 回傳的遊戲回合結果
export interface GameTurnResult {
  narration: string;
  options: string[];
  effects: GameEffects;
}

// 遊戲狀態
export interface GameState {
  phase: GamePhase;
  character: {
    name?: string;
    class?: CharacterClass;
    hp?: number;
    maxHp?: number;
    gold?: number;
    items?: string[];
  };
  progress: number; // 0-100，主線進度
  currentLocation?: string;
  world?: string;
  lastTurnResult?: GameTurnResult;
}

// 對話訊息
export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    gamePhase?: GamePhase;
    gameState?: Partial<GameState>;
  };
}

