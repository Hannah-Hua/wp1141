import mongoose, { Schema, models } from 'mongoose';

export interface IUser {
  _id: string;
  userId: string; // 註冊時輸入的唯一 userID
  name: string; // 從 OAuth provider 取得
  email: string;
  image?: string; // 大頭貼
  coverImage?: string; // 背景圖
  bio?: string; // 個人簡介
  provider: 'google' | 'github' | 'facebook';
  providerId: string; // OAuth provider 的 ID
  following: string[]; // 追蹤的用戶 ID 列表
  followers: string[]; // 粉絲的用戶 ID 列表
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
      match: /^[a-zA-Z0-9_]+$/, // 只允許字母、數字和底線
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    image: String,
    coverImage: String,
    bio: {
      type: String,
      maxlength: 160,
    },
    provider: {
      type: String,
      required: true,
      enum: ['google', 'github', 'facebook'],
    },
    providerId: {
      type: String,
      required: true,
    },
    following: [{
      type: String,
    }],
    followers: [{
      type: String,
    }],
  },
  {
    timestamps: true,
  }
);

// 為 provider 和 providerId 組合建立唯一索引
UserSchema.index({ provider: 1, providerId: 1 }, { unique: true });

const User = models.User || mongoose.model<IUser>('User', UserSchema);

export default User;

