'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

// Mock data for demonstration
const mockPosts = [
  {
    id: 1,
    title: "Getting Started with AI Content Generation",
    excerpt: "Learn how to leverage AI for creating compelling blog content that engages your audience and drives traffic.",
    status: "published",
    publishedAt: "2024-08-06T10:30:00Z",
    updatedAt: "2024-08-06T15:20:00Z",
    views: 1250,
    engagement: 85,
    tags: ["AI", "Content", "Blogging"],
    readTime: "5 min read",
    author: "Priyanshu"
  },
  {
    id: 2,
    title: "10 SEO Tips for Blog Posts",
    excerpt: "Essential SEO strategies to improve your blog's visibility and ranking in search engines.",
    status: "draft",
    publishedAt: null,
    updatedAt: "2024-08-05T14:30:00Z",
    views: 0,
    engagement: 0,
    tags: ["SEO", "Marketing", "Content"],
    readTime: "7 min read",
    author: "Priyanshu"
  },
  {
    id: 3,
    title: "Modern Web Development Trends",
    excerpt: "Explore the latest trends in web development including frameworks, tools, and best practices.",
    status: "published",
    publishedAt: "2024-08-05T09:15:00Z",
    updatedAt: "2024-08-05T09:15:00Z",
    views: 890,
    engagement: 72,
    tags: ["Web Development", "Technology", "Trends"],
    readTime: "8 min read",
    author: "Priyanshu"
  },
  {
    id: 4,
    title: "AI-Powered Content Strategy",
    excerpt: "Discover how artificial intelligence is revolutionizing content strategy and marketing approaches.",
    status: "scheduled",
    publishedAt: "2024-08-10T12:00:00Z",
    updatedAt: "2024-08-06T16:45:00Z",
    views: 0,
    engagement: 0,
    tags: ["AI", "Strategy", "Marketing"],
    readTime: "6 min read",
    author: "Priyanshu"
  },
  {
    id: 5,
    title: "Next.js 15: New Features and Improvements",
    excerpt: "A comprehensive guide to the latest features in Next.js 15 and how they can improve your development workflow.",
    status: "published",
    publishedAt: "2024-08-04T14:20:00Z",
    updatedAt: "2024-08-04T14:20:00Z",
    views: 2150,
    engagement: 91,
    tags: ["Next.js", "React", "Web Development"],
    readTime: "10 min read",
    author: "Priyanshu"
  },
  {
    id: 6,
    title: "Building a Personal Brand as a Developer",
    excerpt: "Tips and strategies for developers to build a strong personal brand and advance their careers.",
    status: "draft",
    publishedAt: null,
    updatedAt: "2024-08-03T11:30:00Z",
    views: 0,
    engagement: 0,
    tags: ["Career", "Personal Brand", "Developer"],
    readTime: "4 min read",
    author: "Priyanshu"
  }
];

export default function PostsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('updated');

  // Filter posts based on search and status
  const filteredPosts = mockPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = selectedStatus === 'all' || post.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Sort posts
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'updated':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      case 'published':
        if (!a.publishedAt) return 1;
        if (!b.publishedAt) return -1;
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      case 'views':
        return b.views - a.views;
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-600/20 text-green-400 border-green-600/30';
      case 'draft': return 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30';
      case 'scheduled': return 'bg-blue-600/20 text-blue-400 border-blue-600/30';
      default: return 'bg-gray-600/20 text-gray-400 border-gray-600/30';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not published';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">All Posts</h1>
            <p className="text-gray-400">Manage and organize your blog content.</p>
          </div>
          <div className="flex space-x-3">
            <button className="btn-secondary">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M4 7h16" />
              </svg>
              Import
            </button>
            <button className="btn-primary">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Post
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search posts, tags, or content..."
                className="input pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <select
              className="input min-w-[120px]"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
            </select>
            
            <select
              className="input min-w-[120px]"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="updated">Last Updated</option>
              <option value="published">Published Date</option>
              <option value="views">Most Views</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="card-flat text-center">
            <p className="text-2xl font-bold text-white">{mockPosts.length}</p>
            <p className="text-sm text-gray-400">Total Posts</p>
          </div>
          <div className="card-flat text-center">
            <p className="text-2xl font-bold text-green-400">{mockPosts.filter(p => p.status === 'published').length}</p>
            <p className="text-sm text-gray-400">Published</p>
          </div>
          <div className="card-flat text-center">
            <p className="text-2xl font-bold text-yellow-400">{mockPosts.filter(p => p.status === 'draft').length}</p>
            <p className="text-sm text-gray-400">Drafts</p>
          </div>
          <div className="card-flat text-center">
            <p className="text-2xl font-bold text-blue-400">{mockPosts.filter(p => p.status === 'scheduled').length}</p>
            <p className="text-sm text-gray-400">Scheduled</p>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid gap-6">
        {sortedPosts.length > 0 ? (
          sortedPosts.map((post) => (
            <div key={post.id} className="card hover:shadow-2xl transition-all duration-300 cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 hover:text-purple-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 mb-4 line-clamp-2">{post.excerpt}</p>
                </div>
                <div className="ml-4">
                  <button className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(post.status)}`}>
                    {post.status}
                  </span>
                  
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="text-gray-400 text-xs">+{post.tags.length - 3}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>{post.views}</span>
                  </div>
                  
                  {post.engagement > 0 && (
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>{post.engagement}%</span>
                    </div>
                  )}
                  
                  <span>{post.readTime}</span>
                  <span>{formatDate(post.publishedAt || post.updatedAt)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-700">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">{post.author[0]}</span>
                  </div>
                  <span className="text-sm text-gray-400">{post.author}</span>
                </div>
                
                <div className="flex space-x-2">
                  <button className="btn-ghost text-sm px-3 py-1">
                    Edit
                  </button>
                  <button className="btn-secondary text-sm px-3 py-1">
                    Preview
                  </button>
                  {post.status === 'published' && (
                    <button className="btn-primary text-sm px-3 py-1">
                      View
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">No posts found</h3>
            <p className="text-gray-400 mb-4">Try adjusting your search or filter criteria</p>
            <button className="btn-primary">
              Create your first post
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
