import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCommunityPosts, createCommunityPost, likePost } from '../api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ArrowLeft, Users, Heart, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = ['stress', 'anxiety', 'depression', 'success', 'support'];

export default function Community() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [formData, setFormData] = useState({ category: 'support', title: '', content: '' });

  useEffect(() => {
    loadPosts();
  }, [selectedCategory]);

  const loadPosts = async () => {
    try {
      const response = await getCommunityPosts(selectedCategory);
      setPosts(response.data);
    } catch (error) {
      console.error('Failed to load posts', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCommunityPost(formData);
      toast.success('Post created!');
      setShowNew(false);
      setFormData({ category: 'support', title: '', content: '' });
      loadPosts();
    } catch (error) {
      toast.error('Failed to create post');
    }
  };

  const handleLike = async (postId) => {
    try {
      await likePost(postId);
      loadPosts();
    } catch (error) {
      console.error('Failed to like post');
    }
  };

  return (
    <div className="min-h-screen bg-background bg-noise">
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Button data-testid="back-btn" onClick={() => navigate('/dashboard')} variant="ghost" className="hover:bg-muted/50 rounded-full">
            <ArrowLeft className="w-5 h-5 mr-2" />Back
          </Button>
          <Button data-testid="create-post-btn" onClick={() => setShowNew(true)} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6">
            Create Post
          </Button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-8 h-8 text-primary" strokeWidth={1.5} />
          <h1 className="font-fraunces text-4xl font-normal">Community</h1>
        </div>
        <p className="text-lg text-muted-foreground mb-8">Connect anonymously with peers who understand</p>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === null ? 'bg-primary text-primary-foreground' : 'bg-muted/50 hover:bg-muted'
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${
                selectedCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-muted/50 hover:bg-muted'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {showNew && (
          <div className="bg-card rounded-2xl shadow-float p-8 border border-border/40 mb-8">
            <h2 className="font-fraunces text-2xl font-medium mb-6">Create Post (Anonymous)</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-white/50 border border-border/60 rounded-xl h-12 px-4 capitalize"
              >
                {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <Input
                required
                placeholder="Post title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-white/50 border-border/60 rounded-xl h-12 px-4"
              />
              <textarea
                required
                placeholder="Share your thoughts..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={6}
                className="w-full bg-white/50 border border-border/60 rounded-xl p-4 resize-none"
              />
              <div className="flex gap-3">
                <Button type="button" onClick={() => setShowNew(false)} variant="outline" className="flex-1 rounded-full">Cancel</Button>
                <Button type="submit" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">Post</Button>
              </div>
            </form>
          </div>
        )}

        {/* Posts */}
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-card rounded-2xl p-6 border border-border/40 shadow-soft">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{post.username_display}</span>
                  <span className="px-2 py-1 bg-muted/50 rounded text-xs capitalize">{post.category}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(post.created_at).toLocaleDateString('en-IN')}
                </span>
              </div>
              <h3 className="font-medium text-lg mb-2">{post.title}</h3>
              <p className="text-muted-foreground mb-4">{post.content}</p>
              <div className="flex items-center gap-4 text-muted-foreground">
                <button onClick={() => handleLike(post.id)} className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">{post.likes_count}</span>
                </button>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">{post.comments_count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}