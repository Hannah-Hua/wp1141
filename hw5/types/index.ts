export interface User {
  _id: string;
  userId: string;
  name: string;
  email: string;
  image?: string;
  coverImage?: string;
  bio?: string;
  provider: 'google' | 'github' | 'facebook';
  providerId: string;
  following: string[];
  followers: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Post {
  _id: string;
  content: string;
  author: string;
  authorDetails?: {
    userId: string;
    name: string;
    image?: string;
  };
  likes: string[];
  repostBy?: string;
  originalPost?: string;
  parentPost?: string;
  replies: string[];
  hasMedia: boolean;
  links: string[];
  hashtags: string[];
  mentions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Draft {
  _id: string;
  content: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  user: {
    id: string;
    userId: string;
    name: string;
    email: string;
    image?: string;
  };
  expires: string;
}

