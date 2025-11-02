import mongoose, { Schema, models } from 'mongoose';

export interface IDraft {
  _id: string;
  content: string;
  author: string; // User ID
  createdAt: Date;
  updatedAt: Date;
}

const DraftSchema = new Schema<IDraft>(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// 索引優化查詢
DraftSchema.index({ author: 1, createdAt: -1 });

const Draft = models.Draft || mongoose.model<IDraft>('Draft', DraftSchema);

export default Draft;

