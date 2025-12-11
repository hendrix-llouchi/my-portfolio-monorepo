import { useState, useEffect } from 'react';
import { 
  FolderOpen, 
  Code, 
  Briefcase, 
  Mail, 
  TrendingUp,
  Users,
  FileText,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../lib/api';

interface Stats {
  projects: number;
  skills: number;
  experiences: number;
  messages: number;
  recentMessages: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    projects: 0,
    skills: 0,
    experiences: 0,
    messages: 0,
    recentMessages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    
    // Real-time polling: Update stats every 10 seconds
    const interval = setInterval(() => {
      fetchStats();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const timestamp = Date.now();
      const [projects, skills, experiences, messages] = await Promise.all([
        api.get(`/projects?t=${timestamp}`, { headers: { 'Cache-Control': 'no-cache' } }),
        api.get(`/skills?t=${timestamp}`, { headers: { 'Cache-Control': 'no-cache' } }),
        api.get(`/experiences?t=${timestamp}`, { headers: { 'Cache-Control': 'no-cache' } }),
        api.get(`/messages?t=${timestamp}`, { headers: { 'Cache-Control': 'no-cache' } }),
      ]);

      const recentMessages = messages.data.filter((msg: any) => {
        const msgDate = new Date(msg.created_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return msgDate >= weekAgo;
      }).length;

      setStats({
        projects: projects.data.length,
        skills: skills.data.length,
        experiences: experiences.data.length,
        messages: messages.data.length,
        recentMessages,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Projects',
      value: stats.projects,
      icon: FolderOpen,
      color: 'from-blue-500 to-blue-600',
      link: '/dashboard/projects',
      change: '+12%',
      trend: 'up',
    },
    {
      title: 'Skills',
      value: stats.skills,
      icon: Code,
      color: 'from-purple-500 to-purple-600',
      link: '/dashboard/skills',
      change: '+5%',
      trend: 'up',
    },
    {
      title: 'Experiences',
      value: stats.experiences,
      icon: Briefcase,
      color: 'from-green-500 to-green-600',
      link: '/dashboard/experiences',
      change: '+2%',
      trend: 'up',
    },
    {
      title: 'Messages',
      value: stats.messages,
      icon: Mail,
      color: 'from-orange-500 to-orange-600',
      link: '/dashboard/messages',
      change: stats.recentMessages > 0 ? `+${stats.recentMessages} this week` : 'No new',
      trend: stats.recentMessages > 0 ? 'up' : 'down',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back! 👋</h1>
            <p className="text-blue-100 text-lg">
              Manage your portfolio content and track your engagement
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-lg flex items-center justify-center">
              <TrendingUp className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              to={stat.link}
              className="group bg-white rounded-xl p-6 shadow-soft hover:shadow-hover transition-all duration-300 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="w-5 h-5 text-green-500" />
                ) : (
                  <ArrowDownRight className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
                <p className={`text-xs ${stat.trend === 'up' ? 'text-green-600' : 'text-gray-500'}`}>
                  {stat.change}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-soft border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/dashboard/projects"
              className="flex items-center justify-between p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <FolderOpen className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">Add New Project</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/dashboard/profile"
              className="flex items-center justify-between p-4 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-gray-900">Update Profile</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/dashboard/messages"
              className="flex items-center justify-between p-4 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-orange-600" />
                <span className="font-medium text-gray-900">View Messages</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-orange-600 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-soft border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">System Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-900">API Server</span>
              </div>
              <span className="text-sm text-green-600 font-semibold">Online</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-900">Database</span>
              </div>
              <span className="text-sm text-green-600 font-semibold">Connected</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50">
              <div className="flex items-center space-x-3">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">Storage</span>
              </div>
              <span className="text-sm text-blue-600 font-semibold">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

