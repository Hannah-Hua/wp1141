import mongoose, { Schema, models } from 'mongoose';

export interface IPost {
  _id: string;
  content: string;
  author: string; // User ID
  authorDetails?: {
    userId: string;
    name: string;
    image?: string;
  };
  likes: string[]; // User IDs who liked this post
  repostBy?: string; // User ID if this is a repost
  originalPost?: string; // Original post ID if this is a repost
  parentPost?: string; // Parent post ID if this is a reply/comment
  replies: string[]; // Reply post IDs
  hasMedia: boolean;
  links: string[];
  hashtags: string[];
  mentions: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    content: {
      type: String,
      required: true,
      maxlength: 280,
    },
    author: {
      type: String,
      required: true,
      ref: 'User',
    },
    likes: [{
      type: String,
      ref: 'User',
    }],
    repostBy: {
      type: String,
      ref: 'User',
    },
    originalPost: {
      type: String,
      ref: 'Post',
    },
    parentPost: {
      type: String,
      ref: 'Post',
    },
    replies: [{
      type: String,
      ref: 'Post',
    }],
    hasMedia: {
      type: Boolean,
      default: false,
    },
    links: [String],
    hashtags: [String],
    mentions: [String],
  },
  {
    timestamps: true,
  }
);

// 索引優化查詢
PostSchema.index({ author: 1, createdAt: -1 });
PostSchema.index({ createdAt: -1 });
PostSchema.index({ parentPost: 1 });
PostSchema.index({ repostBy: 1, createdAt: -1 });
PostSchema.index({ originalPost: 1 });
PostSchema.index({ author: 1, parentPost: 1, repostBy: 1 }); // 複合索引優化 Following 查詢

const Post = models.Post || mongoose.model<IPost>('Post', PostSchema);

export default Post;

