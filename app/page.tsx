'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, Circle, Play, Clock, Calendar, Lightbulb, TrendingUp } from 'lucide-react';

interface VideoIdea {
  id: string;
  title: string;
  description: string;
  category: 'training' | 'race' | 'gear' | 'tips' | 'vlog' | 'other';
  priority: 'high' | 'medium' | 'low';
  status: 'idea' | 'scripting' | 'filming' | 'editing' | 'scheduled' | 'published';
  createdAt: string;
}

interface RunningStats {
  weeklyMiles: number;
  totalVideos: number;
  subscribers: string;
  avgViews: string;
}

export default function Home() {
  const [videoIdeas, setVideoIdeas] = useState<VideoIdea[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newIdea, setNewIdea] = useState({
    title: '',
    description: '',
    category: 'training' as VideoIdea['category'],
    priority: 'medium' as VideoIdea['priority'],
    status: 'idea' as VideoIdea['status'],
  });
  const [stats, setStats] = useState<RunningStats>({
    weeklyMiles: 0,
    totalVideos: 0,
    subscribers: '0',
    avgViews: '0',
  });
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    const savedIdeas = localStorage.getItem('videoIdeas');
    const savedStats = localStorage.getItem('runningStats');

    if (savedIdeas) {
      setVideoIdeas(JSON.parse(savedIdeas));
    }
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  useEffect(() => {
    if (videoIdeas.length > 0) {
      localStorage.setItem('videoIdeas', JSON.stringify(videoIdeas));
    }
  }, [videoIdeas]);

  useEffect(() => {
    localStorage.setItem('runningStats', JSON.stringify(stats));
  }, [stats]);

  const addVideoIdea = () => {
    if (newIdea.title.trim()) {
      const idea: VideoIdea = {
        ...newIdea,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      setVideoIdeas([idea, ...videoIdeas]);
      setNewIdea({
        title: '',
        description: '',
        category: 'training',
        priority: 'medium',
        status: 'idea',
      });
      setShowForm(false);
    }
  };

  const deleteIdea = (id: string) => {
    setVideoIdeas(videoIdeas.filter(idea => idea.id !== id));
  };

  const updateIdeaStatus = (id: string, status: VideoIdea['status']) => {
    setVideoIdeas(videoIdeas.map(idea =>
      idea.id === id ? { ...idea, status } : idea
    ));
  };

  const filteredIdeas = videoIdeas.filter(idea => {
    const matchesStatus = filterStatus === 'all' || idea.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || idea.category === filterCategory;
    return matchesStatus && matchesCategory;
  });

  const categoryColors: Record<VideoIdea['category'], string> = {
    training: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    race: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    gear: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    tips: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    vlog: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    other: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  };

  const priorityColors: Record<VideoIdea['priority'], string> = {
    high: 'border-red-500',
    medium: 'border-yellow-500',
    low: 'border-green-500',
  };

  const statusIcons: Record<VideoIdea['status'], JSX.Element> = {
    idea: <Lightbulb className="w-4 h-4" />,
    scripting: <Circle className="w-4 h-4" />,
    filming: <Play className="w-4 h-4" />,
    editing: <Clock className="w-4 h-4" />,
    scheduled: <Calendar className="w-4 h-4" />,
    published: <CheckCircle className="w-4 h-4" />,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
            🏃‍♂️ Running YouTube Channel Manager
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Track your running journey and organize video ideas</p>
        </header>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Weekly Miles</p>
                <input
                  type="number"
                  value={stats.weeklyMiles}
                  onChange={(e) => setStats({...stats, weeklyMiles: Number(e.target.value)})}
                  className="text-3xl font-bold text-gray-900 dark:text-white bg-transparent border-none outline-none w-24"
                />
              </div>
              <TrendingUp className="w-10 h-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Videos</p>
                <input
                  type="number"
                  value={stats.totalVideos}
                  onChange={(e) => setStats({...stats, totalVideos: Number(e.target.value)})}
                  className="text-3xl font-bold text-gray-900 dark:text-white bg-transparent border-none outline-none w-24"
                />
              </div>
              <Play className="w-10 h-10 text-red-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Subscribers</p>
                <input
                  type="text"
                  value={stats.subscribers}
                  onChange={(e) => setStats({...stats, subscribers: e.target.value})}
                  className="text-3xl font-bold text-gray-900 dark:text-white bg-transparent border-none outline-none w-24"
                />
              </div>
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Views</p>
                <input
                  type="text"
                  value={stats.avgViews}
                  onChange={(e) => setStats({...stats, avgViews: e.target.value})}
                  className="text-3xl font-bold text-gray-900 dark:text-white bg-transparent border-none outline-none w-24"
                />
              </div>
              <TrendingUp className="w-10 h-10 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Filters and Add Button */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Status</option>
                  <option value="idea">Idea</option>
                  <option value="scripting">Scripting</option>
                  <option value="filming">Filming</option>
                  <option value="editing">Editing</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Categories</option>
                  <option value="training">Training</option>
                  <option value="race">Race</option>
                  <option value="gear">Gear Review</option>
                  <option value="tips">Tips & Advice</option>
                  <option value="vlog">Vlog</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 shadow-lg transition-colors mt-4 md:mt-6"
            >
              <Plus className="w-5 h-5" />
              Add Video Idea
            </button>
          </div>
        </div>

        {/* Add Video Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">New Video Idea</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={newIdea.title}
                  onChange={(e) => setNewIdea({...newIdea, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., 10 Tips for Your First Marathon"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea
                  value={newIdea.description}
                  onChange={(e) => setNewIdea({...newIdea, description: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={3}
                  placeholder="Video details, script notes, etc."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                  <select
                    value={newIdea.category}
                    onChange={(e) => setNewIdea({...newIdea, category: e.target.value as VideoIdea['category']})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="training">Training</option>
                    <option value="race">Race</option>
                    <option value="gear">Gear Review</option>
                    <option value="tips">Tips & Advice</option>
                    <option value="vlog">Vlog</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Priority</label>
                  <select
                    value={newIdea.priority}
                    onChange={(e) => setNewIdea({...newIdea, priority: e.target.value as VideoIdea['priority']})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                  <select
                    value={newIdea.status}
                    onChange={(e) => setNewIdea({...newIdea, status: e.target.value as VideoIdea['status']})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="idea">Idea</option>
                    <option value="scripting">Scripting</option>
                    <option value="filming">Filming</option>
                    <option value="editing">Editing</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={addVideoIdea}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Save Video Idea
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Video Ideas List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Video Ideas ({filteredIdeas.length})
          </h2>

          {filteredIdeas.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center">
              <Lightbulb className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">No video ideas yet. Start adding some!</p>
            </div>
          ) : (
            filteredIdeas.map((idea) => (
              <div
                key={idea.id}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 ${priorityColors[idea.priority]}`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="text-gray-600 dark:text-gray-400 mt-1">
                        {statusIcons[idea.status]}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          {idea.title}
                        </h3>
                        {idea.description && (
                          <p className="text-gray-600 dark:text-gray-400 mb-3">
                            {idea.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoryColors[idea.category]}`}>
                        {idea.category}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        idea.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        idea.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {idea.priority} priority
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <select
                        value={idea.status}
                        onChange={(e) => updateIdeaStatus(idea.id, e.target.value as VideoIdea['status'])}
                        className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="idea">💡 Idea</option>
                        <option value="scripting">📝 Scripting</option>
                        <option value="filming">🎬 Filming</option>
                        <option value="editing">✂️ Editing</option>
                        <option value="scheduled">📅 Scheduled</option>
                        <option value="published">✅ Published</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteIdea(idea.id)}
                    className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-4 text-xs text-gray-500 dark:text-gray-500">
                  Created: {new Date(idea.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
