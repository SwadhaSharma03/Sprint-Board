import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchTasks, addTask, updateTask, deleteTask } from '../store/taskSlice';
import { Task, TaskStatus } from '../types';
import { logout } from '../store/authSlice';
import {
  LogOut, Plus, Search, CheckCircle2, Circle, Clock, Trash2, Edit3, X, LayoutDashboard, Moon, Sun, ChevronLeft, ChevronRight, Calendar, ArrowUpRight, TrendingUp, Sparkles
} from 'lucide-react';

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading } = useSelector((state: RootState) => state.tasks);
  const { user } = useSelector((state: RootState) => state.auth);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'todo' | 'in-progress' | 'completed'>('all');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo' as TaskStatus,
  });

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleOpenModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
      });
    } else {
      setEditingTask(null);
      setFormData({ title: '', description: '', status: 'todo' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTask) {
      dispatch(updateTask({ ...editingTask, ...formData }));
    } else {
      dispatch(addTask(formData));
    }
    setIsModalOpen(false);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="text-violet-500" size={20} />;
      case 'in-progress': return <Clock className="text-amber-500" size={20} />;
      default: return <Circle className="text-slate-400" size={20} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 font-['Outfit',sans-serif]">
      {/* Sidebar - Desktop */}
      <aside className={`fixed left-0 top-0 h-full bg-white dark:bg-slate-900 border-r border-slate-200/60 dark:border-slate-800 hidden lg:flex flex-col z-30 transition-all duration-500 ease-in-out ${isSidebarCollapsed ? 'w-24' : 'w-72'}`}>
        <div className="p-8 flex-1 flex flex-col overflow-hidden relative">
          <div className={`flex items-center gap-3 text-primary-600 mb-12 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 rounded-2xl bg-primary-600 text-white flex items-center justify-center shadow-lg shadow-primary-600/20">
              <Sparkles size={24} />
            </div>
            {!isSidebarCollapsed && (
              <span className="text-2xl font-bold tracking-tighter text-slate-900 dark:text-white">Sprint<span className="text-primary-600">Board</span></span>
            )}
          </div>

          <nav className="space-y-2">
            <button className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 font-bold ${isSidebarCollapsed ? 'justify-center' : ''}`}>
              <LayoutDashboard size={22} />
              {!isSidebarCollapsed && <span>My Workspace</span>}
            </button>
          </nav>

          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="absolute -right-3.5 top-11 w-7 h-7 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 rounded-full flex items-center justify-center shadow-md hover:text-primary-600 transition-colors z-40"
          >
            {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <div className="mt-auto p-6 border-t border-slate-100 dark:border-slate-800">
          <div className={`flex items-center gap-4 mb-8 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900/30 dark:to-indigo-900/30 flex items-center justify-center text-primary-600 font-black text-lg border border-white dark:border-slate-700 shadow-sm">
              {user?.name?.[0] || 'U'}
            </div>
            {!isSidebarCollapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold truncate text-slate-900 dark:text-white leading-tight">{user?.name || 'User'}</p>
                <p className="text-xs text-slate-500 truncate mt-0.5">{user?.username}</p>
              </div>
            )}
          </div>
          <button
            onClick={() => dispatch(logout())}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 font-bold transition-all ${isSidebarCollapsed ? 'justify-center' : ''}`}
          >
            <LogOut size={22} />
            {!isSidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-500 p-6 lg:p-12 ${isSidebarCollapsed ? 'lg:ml-24' : 'lg:ml-72'}`}>
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <div className="flex items-center gap-2 text-primary-600 font-bold text-sm uppercase tracking-widest mb-3">
              <Calendar size={16} />
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
            </div>
            {/* <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tight leading-none">
              Welcome, {user?.name?.split(' ')[0] || 'Explorer'}
            </h1> */}
            <p className="text-slate-500 mt-4 text-lg max-w-lg font-medium leading-relaxed">
              You have <span className="text-primary-600 font-bold">{tasks.filter(t => t.status !== 'completed').length} pending</span> tasks to conquer today.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-primary-600 hover:border-primary-600/30 transition-all shadow-sm"
            >
              {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
            <button
              onClick={() => handleOpenModal()}
              className="btn btn-primary h-14 px-8 flex items-center gap-3 shadow-2xl shadow-primary-600/30 text-lg"
            >
              <Plus size={24} />
              <span>Create Task</span>
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Tasks', value: tasks.length, color: 'violet', icon: <LayoutDashboard size={20} /> },
            { label: 'In Progress', value: tasks.filter(t => t.status === 'in-progress').length, color: 'amber', icon: <TrendingUp size={20} /> },
            { label: 'Finished', value: tasks.filter(t => t.status === 'completed').length, color: 'violet', icon: <CheckCircle2 size={20} /> },
            { label: 'Productivity', value: `${tasks.length ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100) : 0}%`, color: 'primary', icon: <ArrowUpRight size={20} /> },
          ].map((stat, i) => (
            <div key={i} className="card p-6 border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 relative overflow-hidden group">
              <div className={`absolute top-0 left-0 w-1.5 h-full bg-${stat.color === 'primary' ? 'primary-600' : stat.color + '-500'}`} />
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-${stat.color === 'primary' ? 'primary-600' : stat.color + '-500'}/10 text-${stat.color === 'primary' ? 'primary-600' : stat.color + '-500'}`}>
                  {stat.icon}
                </div>
                <span className="text-2xl font-black text-slate-900 dark:text-white group-hover:scale-110 transition-transform">{stat.value}</span>
              </div>
              <span className="text-slate-500 text-sm font-bold uppercase tracking-wider">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col xl:flex-row gap-6 mb-12">
          <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={22} />
            <input
              type="text"
              placeholder="Search through your workflow..."
              className="input h-16 pl-14 bg-white dark:bg-slate-900 border-none shadow-lg shadow-slate-200/50 dark:shadow-none text-lg placeholder:text-slate-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex p-1.5 bg-white dark:bg-slate-900 rounded-[22px] shadow-lg shadow-slate-200/50 dark:shadow-none">
            {['all', 'todo', 'in-progress', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status as any)}
                className={`px-6 py-3 rounded-[18px] text-sm font-bold capitalize transition-all ${statusFilter === status
                  ? 'bg-primary-600 text-white shadow-xl shadow-primary-600/30 scale-[1.02]'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                {status.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Tasks Grid */}
        {filteredTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredTasks.map((task) => (
              <div key={task.id} className="card-hover group bg-white dark:bg-slate-900 border-none shadow-2xl shadow-slate-200/60 dark:shadow-none rounded-[32px] p-8 flex flex-col transition-all duration-500">
                <div className="flex items-start justify-between mb-8">
                  <div className={`p-3 rounded-2xl ${task.status === 'completed' ? 'bg-violet-100 dark:bg-violet-900/30' :
                    task.status === 'in-progress' ? 'bg-amber-100 dark:bg-amber-900/30' :
                      'bg-slate-100 dark:bg-slate-800'
                    }`}>
                    {getStatusIcon(task.status)}
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                    <button
                      onClick={() => handleOpenModal(task)}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={() => dispatch(deleteTask(task.id))}
                      className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight line-clamp-2">{task.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-10 line-clamp-3">
                  {task.description}
                </p>

                <div className="mt-auto flex items-center justify-between">
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${task.status === 'completed' ? 'border-violet-200 bg-violet-50 text-violet-600 dark:border-violet-900/50 dark:bg-violet-900/20 dark:text-violet-400' :
                    task.status === 'in-progress' ? 'border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-400' :
                      'border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                    {task.status.replace('-', ' ')}
                  </div>
                  <span className="text-[10px] text-slate-300 font-bold tracking-widest uppercase">ID: {task.id.slice(-4)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-white/50 dark:bg-slate-900/50 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-slate-800">
            {/* <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-8">
              <Sparkles size={48} />
            </div> */}
            <h3 className="text-3xl  text-slate-900 dark:text-white tracking-tight">Your space is clear</h3>
            {/* <p className="text-slate-500 mt-3 max-w-sm font-medium">Ready to fill it with your next big goal? Tap create to get started.</p> */}
            <button
              onClick={() => handleOpenModal()}
              className="mt-10 btn btn-primary px-10 h-14 text-lg"
            >
              Create First Task
            </button>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
            <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[32px] shadow-3xl overflow-hidden border border-white/20">
              <div className="p-6 lg:p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {editingTask ? 'Edit Perspective' : 'New Task'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-10 h-10 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors flex items-center justify-center"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-900 dark:text-white ml-1 uppercase tracking-widest">Title</label>
                  <input
                    type="text"
                    required
                    className="input h-14 bg-slate-50 dark:bg-slate-800 border-none text-base"
                    placeholder="Focus on..."
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-900 dark:text-white ml-1 uppercase tracking-widest">Details</label>
                  <textarea
                    rows={3}
                    className="input py-4 bg-slate-50 dark:bg-slate-800 border-none resize-none text-base"
                    placeholder="Add depth to your task..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-900 dark:text-white ml-1 uppercase tracking-widest">Priority Phase</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['todo', 'in-progress', 'completed'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setFormData({ ...formData, status: s as TaskStatus })}
                        className={`h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${formData.status === s
                          ? 'border-primary-600 bg-primary-600 text-white shadow-xl shadow-primary-600/30'
                          : 'border-slate-100 bg-white text-slate-400 dark:border-slate-800 dark:bg-slate-900'
                          }`}
                      >
                        {s.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 btn btn-secondary h-12 text-base font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] btn btn-primary h-12 text-base font-bold shadow-2xl shadow-primary-600/30"
                  >
                    {editingTask ? 'Save' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
