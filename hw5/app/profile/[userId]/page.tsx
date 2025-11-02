'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import MainLayout from '@/components/MainLayout';
import PostCard from '@/components/PostCard';
import EditProfileModal from '@/components/EditProfileModal';

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;

  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [likedPosts, setLikedPosts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'posts' | 'likes'>('posts');
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const isOwnProfile = session?.user?.userId === userId;

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
      fetchUserPosts();
      fetchLikedPosts();
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const res = await fetch(`/api/users/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setIsFollowing(data.user.followers?.includes(session?.user?.id));
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const res = await fetch(`/api/posts?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  };

  const fetchLikedPosts = async () => {
    if (!isOwnProfile) return;
    
    try {
      const res = await fetch(`/api/users/${userId}/likes`);
      if (res.ok) {
        const data = await res.json();
        setLikedPosts(data.posts || []);
      }
    } catch (error) {
      console.error('Failed to fetch liked posts:', error);
    }
  };

  const handleFollow = async () => {
    try {
      const res = await fetch(`/api/users/${userId}/follow`, {
        method: 'POST',
      });

      if (res.ok) {
        setIsFollowing(!isFollowing);
        fetchUserProfile();
      }
    } catch (error) {
      console.error('Failed to follow/unfollow:', error);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="p-8 text-center">載入中...</div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="p-8 text-center">用戶不存在</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 z-10 px-4 py-3">
          <div className="flex items-center gap-8">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold">{user.name}</h1>
              <p className="text-sm text-gray-500">{posts.length} posts</p>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div className="h-48 bg-gray-300 relative">
          {user.coverImage && (
            <Image
              src={user.coverImage}
              alt="Cover"
              fill
              className="object-cover"
            />
          )}
        </div>

        {/* Profile Info */}
        <div className="px-4 pb-4">
          <div className="flex justify-between items-start -mt-16 mb-4">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-300 overflow-hidden">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white text-4xl font-bold">
                  {user.name[0]?.toUpperCase()}
                </div>
              )}
            </div>

            {isOwnProfile ? (
              <button
                onClick={() => setShowEditModal(true)}
                className="mt-3 px-6 py-2 border border-gray-300 rounded-full font-bold hover:bg-gray-50"
              >
                Edit profile
              </button>
            ) : (
              <button
                onClick={handleFollow}
                className={`mt-3 px-6 py-2 rounded-full font-bold ${
                  isFollowing
                    ? 'border border-gray-300 hover:bg-red-50 hover:text-red-500 hover:border-red-500'
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
          </div>

          <div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-gray-500">@{user.userId}</p>
            
            {user.bio && (
              <p className="mt-3 text-gray-900">{user.bio}</p>
            )}

            <div className="flex gap-4 mt-3 text-sm">
              <div>
                <span className="font-bold">{user.following?.length || 0}</span>
                <span className="text-gray-500"> Following</span>
              </div>
              <div>
                <span className="font-bold">{user.followers?.length || 0}</span>
                <span className="text-gray-500"> Followers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 py-4 font-bold hover:bg-gray-50 transition-colors ${
                activeTab === 'posts'
                  ? 'border-b-4 border-blue-500'
                  : 'text-gray-500'
              }`}
            >
              Posts
            </button>
            {isOwnProfile && (
              <button
                onClick={() => setActiveTab('likes')}
                className={`flex-1 py-4 font-bold hover:bg-gray-50 transition-colors ${
                  activeTab === 'likes'
                    ? 'border-b-4 border-blue-500'
                    : 'text-gray-500'
                }`}
              >
                Likes
              </button>
            )}
          </div>
        </div>

        {/* Posts/Likes */}
        <div>
          {activeTab === 'posts' ? (
            posts.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                還沒有貼文
              </div>
            ) : (
              posts.map((post) => (
                <PostCard key={post._id} post={post} onUpdate={fetchUserPosts} />
              ))
            )
          ) : (
            likedPosts.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                還沒有按讚的貼文
              </div>
            ) : (
              likedPosts.map((post) => (
                <PostCard key={post._id} post={post} onUpdate={fetchLikedPosts} />
              ))
            )
          )}
        </div>
      </div>

      {showEditModal && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onUpdate={fetchUserProfile}
        />
      )}
    </MainLayout>
  );
}

