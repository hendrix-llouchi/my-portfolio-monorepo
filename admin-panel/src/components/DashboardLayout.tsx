import { ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FolderOpen, 
  Code, 
  Briefcase, 
  Mail, 
  LogOut,
  User
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard/profile', label: 'Profile', icon: User },
    { path: '/dashboard/projects', label: 'Projects', icon: FolderOpen },
    { path: '/dashboard/skills', label: 'Skills', icon: Code },
    { path: '/dashboard/experiences', label: 'Experience', icon: Briefcase },
    { path: '/dashboard/messages', label: 'Messages', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 text-white min-h-screen flex flex-col">
          <div className="p-6">
            <h1 className="text-2xl font-bold">Admin Panel</h1>
          </div>
          <nav className="mt-6 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700 ${
                    isActive ? 'bg-gray-700 border-r-4 border-blue-500' : ''
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

