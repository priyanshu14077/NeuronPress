import DashboardLayout from '@/components/layout/DashboardLayout';

// Mock data for demonstration
const mockPosts = [
  {
    id: 1,
    title: "Getting Started with AI Content Generation",
    status: "published",
    publishedAt: "2024-08-06",
    views: 1250,
    engagement: 85
  },
  {
    id: 2,
    title: "10 SEO Tips for Blog Posts",
    status: "draft",
    publishedAt: null,
    views: 0,
    engagement: 0
  },
  {
    id: 3,
    title: "Modern Web Development Trends",
    status: "published",
    publishedAt: "2024-08-05",
    views: 890,
    engagement: 72
  },
  {
    id: 4,
    title: "AI-Powered Content Strategy",
    status: "scheduled",
    publishedAt: "2024-08-10",
    views: 0,
    engagement: 0
  }
];

const analyticsData = [
  {
    title: "Total Views",
    value: "12,450",
    change: "+15%",
    trend: "up",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    )
  },
  {
    title: "Published Posts",
    value: "24",
    change: "+3",
    trend: "up",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    )
  },
  {
    title: "Avg. Engagement",
    value: "78%",
    change: "+5%",
    trend: "up",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    )
  },
  {
    title: "AI Generated",
    value: "16",
    change: "+8",
    trend: "up",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  }
];

const aiSuggestions = [
  {
    type: "topic",
    title: "Write about 'Next.js 15 Features'",
    description: "Trending topic with high search volume",
    confidence: 92
  },
  {
    type: "optimization",
    title: "Optimize SEO for 'AI Content Generation'",
    description: "Add meta descriptions and improve keyword density",
    confidence: 87
  },
  {
    type: "content",
    title: "Create a follow-up to 'Modern Web Development'",
    description: "High engagement on similar content",
    confidence: 84
  }
];

export default function Dashboard() {
  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-400">Welcome back, Priyanshu! Here&apos;s your content overview.</p>
          </div>
          <div className="flex space-x-3">
            <button className="btn-secondary">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M4 7h16" />
              </svg>
              Export
            </button>
            <button className="btn-primary">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Post
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {analyticsData.map((item, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-600/10 rounded-lg text-purple-400">
                {item.icon}
              </div>
              <span className={`text-sm font-medium ${
                item.trend === 'up' ? 'text-green-400' : 'text-red-400'
              }`}>
                {item.change}
              </span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">{item.value}</h3>
              <p className="text-gray-400 text-sm">{item.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Posts */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Recent Posts</h2>
              <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
                View all
              </button>
            </div>
            
            <div className="space-y-4">
              {mockPosts.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
                  <div className="flex-1">
                    <h3 className="font-medium text-white mb-1">{post.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        post.status === 'published' ? 'bg-green-600/20 text-green-400' :
                        post.status === 'draft' ? 'bg-yellow-600/20 text-yellow-400' :
                        'bg-blue-600/20 text-blue-400'
                      }`}>
                        {post.status}
                      </span>
                      {post.publishedAt && (
                        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">{post.views} views</p>
                    {post.engagement > 0 && (
                      <p className="text-sm text-gray-400">{post.engagement}% engagement</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full btn-primary justify-start">
                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create New Post
              </button>
              <button className="w-full btn-secondary justify-start">
                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                AI Generate Content
              </button>
              <button className="w-full btn-ghost justify-start">
                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Open Editor
              </button>
              <button className="w-full btn-ghost justify-start">
                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                View Analytics
              </button>
            </div>
          </div>

          {/* AI Suggestions */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">AI Suggestions</h2>
              <div className="p-1.5 bg-purple-600/10 rounded-lg">
                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            
            <div className="space-y-4">
              {aiSuggestions.map((suggestion, index) => (
                <div key={index} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-white text-sm">{suggestion.title}</h4>
                    <span className="text-xs bg-purple-600/20 text-purple-400 px-2 py-1 rounded">
                      {suggestion.confidence}%
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs mb-3">{suggestion.description}</p>
                  <button className="text-purple-400 hover:text-purple-300 text-xs font-medium">
                    Apply Suggestion →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
