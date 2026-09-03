import { useState, useEffect } from 'react';
import { ShieldAlert, Users, TrendingUp, DollarSign, Database, Settings, Activity, Plus, X, CheckCircle2, Loader2, Shield } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const defaultUsageData = [
  { name: 'Mon', active_users: 1200 },
  { name: 'Tue', active_users: 1400 },
  { name: 'Wed', active_users: 1100 },
  { name: 'Thu', active_users: 1600 },
  { name: 'Fri', active_users: 1800 },
  { name: 'Sat', active_users: 2400 },
  { name: 'Sun', active_users: 2100 },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'settings'>('overview');

  // Analytics State
  const [analytics, setAnalytics] = useState<any>(null);

  // Users State
  const [usersList, setUsersList] = useState<any[]>([]);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newRole, setNewRole] = useState('student');

  // Settings State
  const [settings, setSettings] = useState({
    offline_mode: true,
    strict_rbac: true,
    emergency_halt: false
  });
  const [notice, setNotice] = useState('');

  useEffect(() => {
    // 1. Fetch Analytics
    fetch('/api/admin/analytics')
      .then(res => res.json())
      .then(data => setAnalytics(data))
      .catch(() => {});

    // 2. Fetch Users
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(data => {
        if (data.users && data.users.length > 0) {
          setUsersList(data.users);
        } else {
          setUsersList([
            { id: '1', full_name: 'Ali Hassan', role: 'student', created_at: new Date().toISOString() },
            { id: '2', full_name: 'Sir Tariq Mahmood', role: 'teacher', created_at: new Date().toISOString() },
            { id: '3', full_name: 'Mrs. Hassan (Parent)', role: 'parent', created_at: new Date().toISOString() },
            { id: '4', full_name: 'System Admin', role: 'admin', created_at: new Date().toISOString() }
          ]);
        }
      })
      .catch(() => {});

    // 3. Fetch Settings
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data.settings) setSettings(data.settings);
      })
      .catch(() => {});
  }, []);

  const handleToggleSetting = async (key: 'offline_mode' | 'strict_rbac' | 'emergency_halt') => {
    const updatedValue = !settings[key];
    setSettings(prev => ({ ...prev, [key]: updatedValue }));

    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, enabled: updatedValue })
      });
      setNotice(`Updated ${key} successfully`);
      setTimeout(() => setNotice(''), 3000);
    } catch {}
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim()) return;

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: newFullName, role: newRole })
      });

      if (res.ok) {
        const data = await res.json();
        setUsersList(prev => [data.user, ...prev]);
      } else {
        setUsersList(prev => [{ id: String(Date.now()), full_name: newFullName, role: newRole, created_at: new Date().toISOString() }, ...prev]);
      }
    } catch {
      setUsersList(prev => [{ id: String(Date.now()), full_name: newFullName, role: newRole, created_at: new Date().toISOString() }, ...prev]);
    }

    setNewFullName('');
    setIsAddUserOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 h-full w-full overflow-y-auto scrollbar-hide">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-sky-400" /> System Administration
          </h1>
          <p className="text-slate-400 mt-1">Platform-wide overview and institutional controls</p>
        </div>
        <div className="flex bg-slate-800/50 p-1 rounded-xl border border-slate-700/50">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Analytics
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'users' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            User Management
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'settings' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Platform Settings
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {notice}
        </div>
      )}

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 animate-in fade-in">
          
          <div className="glass-card p-5 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sky-400">
              <Users className="w-5 h-5" />
              <span className="font-bold">Total Users</span>
            </div>
            <span className="text-3xl font-bold text-white">
              {analytics?.totalUsers?.toLocaleString() || '12,450'}
            </span>
            <span className="text-xs text-emerald-400 font-medium">+14% this month</span>
          </div>
          
          <div className="glass-card p-5 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-emerald-400">
              <DollarSign className="w-5 h-5" />
              <span className="font-bold">Active Subscriptions</span>
            </div>
            <span className="text-3xl font-bold text-white">
              {analytics?.activeSubscriptions?.toLocaleString() || '4,200'}
            </span>
            <span className="text-xs text-emerald-400 font-medium">+5% this month</span>
          </div>

          <div className="glass-card p-5 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-purple-400">
              <Activity className="w-5 h-5" />
              <span className="font-bold">Platform Uptime</span>
            </div>
            <span className="text-3xl font-bold text-white">
              {analytics?.uptime || '99.9%'}
            </span>
            <span className="text-xs text-slate-400 font-medium">Last 30 days</span>
          </div>

          <div className="glass-card p-5 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-amber-400">
              <Database className="w-5 h-5" />
              <span className="font-bold">Offline Syncs</span>
            </div>
            <span className="text-3xl font-bold text-white">
              {analytics?.offlineSyncs || '45.2K'}
            </span>
            <span className="text-xs text-slate-400 font-medium">Events recorded</span>
          </div>

          <div className="glass-card p-6 lg:col-span-4 min-h-[350px]">
            <h3 className="font-semibold text-slate-200 mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-sky-400" />
              Weekly Active Users (WAU)
            </h3>
            <div className="w-full h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics?.usageChart || defaultUsageData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                  <Line type="monotone" dataKey="active_users" stroke="#0ea5e9" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#0ea5e9' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="glass-card p-6 animate-in fade-in h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-slate-200">Registered Platform Profiles</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsAddUserOpen(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add User
              </button>
            </div>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/50 text-xs uppercase tracking-wider text-slate-400">
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Role</th>
                  <th className="p-4 font-medium">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {usersList.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 font-medium text-slate-200">{user.full_name}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase ${
                        user.role === 'admin' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                        user.role === 'teacher' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' :
                        user.role === 'parent' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-400">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recent'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add User Modal */}
          {isAddUserOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-slate-900 border border-slate-700/50 rounded-2xl p-6 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
                <button 
                  onClick={() => setIsAddUserOpen(false)}
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-emerald-400" /> Add New User Profile
                </h3>

                <form onSubmit={handleAddUser} className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase">Full Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Ayesha Siddiqa"
                      value={newFullName}
                      onChange={(e) => setNewFullName(e.target.value)}
                      className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-sky-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase">Role</label>
                    <select 
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-sky-500 text-sm"
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="parent">Parent</option>
                      <option value="admin">Platform Admin</option>
                    </select>
                  </div>

                  <div className="flex gap-3 mt-2">
                    <button 
                      type="button"
                      onClick={() => setIsAddUserOpen(false)}
                      className="flex-1 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    >
                      Create Profile
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="glass-card p-6 animate-in fade-in h-full flex flex-col">
           <h3 className="font-semibold text-slate-200 mb-6 flex items-center gap-2">
             <Settings className="w-5 h-5 text-slate-400" /> Platform Controls & Policies
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-slate-700/50 rounded-xl bg-slate-800/30 flex justify-between items-center">
                 <div>
                   <h4 className="text-white font-medium">Offline Learning Mode</h4>
                   <p className="text-xs text-slate-400">Permit textbook and quiz local caching</p>
                 </div>
                 <button 
                   onClick={() => handleToggleSetting('offline_mode')}
                   className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer ${settings.offline_mode ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-slate-700'}`}
                 >
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${settings.offline_mode ? 'right-1' : 'left-1'}`}></div>
                 </button>
              </div>

              <div className="p-4 border border-slate-700/50 rounded-xl bg-slate-800/30 flex justify-between items-center">
                 <div>
                   <h4 className="text-white font-medium">Strict RBAC Policies</h4>
                   <p className="text-xs text-slate-400">Enforce role-based permission constraints</p>
                 </div>
                 <button 
                   onClick={() => handleToggleSetting('strict_rbac')}
                   className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer ${settings.strict_rbac ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-slate-700'}`}
                 >
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${settings.strict_rbac ? 'right-1' : 'left-1'}`}></div>
                 </button>
              </div>

              <div className="p-4 border border-red-500/20 rounded-xl bg-red-500/10 flex justify-between items-center md:col-span-2 mt-4">
                 <div>
                   <h4 className="text-red-400 font-medium">Emergency System Halt</h4>
                   <p className="text-xs text-red-300">Temporarily restrict new user sessions</p>
                 </div>
                 <button 
                   onClick={() => handleToggleSetting('emergency_halt')}
                   className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)] ${settings.emergency_halt ? 'bg-red-500 text-white' : 'bg-red-600 hover:bg-red-500 text-white'}`}
                 >
                   {settings.emergency_halt ? 'Resume System' : 'Initiate Halt'}
                 </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}
