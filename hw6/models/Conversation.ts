import mongoose, { Schema, Document } from 'mongoose';
import { ConversationMessage } from '@/types/game';

export interface IConversation extends Document {
  lineUserId: string;
  messages: ConversationMessage[];
  gameState: {
    phase: string;
    character: {
      name?: string;
      class?: string;
      hp?: number;
      maxHp?: number;
      gold?: number;
      items?: string[];
    };
    progress: number;
    currentLocation?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ConversationMessageSchema = new Schema(
  {
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  { _id: false }
);

const ConversationSchema = new Schema<IConversation>(
  {
    lineUserId: {
      type: String,
      required: true,
      index: true,
    },
    messages: {
      type: [ConversationMessageSchema],
      default: [],
    },
    gameState: {
      phase: {
        type: String,
        enum: ['idle', 'creating_name', 'choosing_class', 'playing', 'game_over'],
        default: 'idle',
      },
      character: {
        name: String,
        class: String,
        hp: Number,
        maxHp: Number,
        gold: { type: Number, default: 0 },
        items: [String],
      },
      progress: { type: Number, default: 0 },
      currentLocation: String,
    },
  },
  {
    timestamps: true,
  }
);

// 建立複合索引以加速查詢
ConversationSchema.index({ lineUserId: 1, createdAt: -1 });

export default mongoose.models.Conversation || mongoose.model<IConversation>('Conversation', ConversationSchema);

