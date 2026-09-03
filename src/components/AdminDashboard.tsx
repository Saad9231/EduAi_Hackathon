import { useState } from 'react';
import { ShieldAlert, Users, TrendingUp, DollarSign, Database, Settings, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockUsageData = [
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

  return (
    <div className="flex flex-col gap-6 h-full w-full overflow-y-auto scrollbar-hide">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white">System Administration</h1>
          <p className="text-slate-400 mt-1">Platform-wide overview and controls</p>
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

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 animate-in fade-in">
          
          <div className="glass-card p-5 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sky-400">
              <Users className="w-5 h-5" />
              <span className="font-bold">Total Users</span>
            </div>
            <span className="text-3xl font-bold text-white">12,450</span>
            <span className="text-xs text-emerald-400 font-medium">+14% this month</span>
          </div>
          
          <div className="glass-card p-5 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-emerald-400">
              <DollarSign className="w-5 h-5" />
              <span className="font-bold">Active Subscriptions</span>
            </div>
            <span className="text-3xl font-bold text-white">4,200</span>
            <span className="text-xs text-emerald-400 font-medium">+5% this month</span>
          </div>

          <div className="glass-card p-5 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-purple-400">
              <Activity className="w-5 h-5" />
              <span className="font-bold">Platform Uptime</span>
            </div>
            <span className="text-3xl font-bold text-white">99.9%</span>
            <span className="text-xs text-slate-400 font-medium">Last 30 days</span>
          </div>

          <div className="glass-card p-5 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-amber-400">
              <Database className="w-5 h-5" />
              <span className="font-bold">Offline Syncs</span>
            </div>
            <span className="text-3xl font-bold text-white">45.2K</span>
            <span className="text-xs text-slate-400 font-medium">Events today</span>
          </div>

          <div className="glass-card p-6 lg:col-span-4 min-h-[350px]">
            <h3 className="font-semibold text-slate-200 mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-sky-400" />
              Weekly Active Users (WAU)
            </h3>
            <div className="w-full h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockUsageData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
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
            <h3 className="font-semibold text-slate-200">User Management</h3>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors border border-slate-700">
                Bulk Import (CSV)
              </button>
              <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors">
                Add User
              </button>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-700/50 rounded-xl">
             User Roster Management UI Placeholder
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="glass-card p-6 animate-in fade-in h-full flex flex-col">
           <h3 className="font-semibold text-slate-200 mb-6 flex items-center gap-2">
             <Settings className="w-5 h-5 text-slate-400" /> System Preferences
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-slate-700/50 rounded-xl bg-slate-800/30 flex justify-between items-center">
                 <div>
                   <h4 className="text-white font-medium">Offline Mode</h4>
                   <p className="text-xs text-slate-400">Allow users to cache content</p>
                 </div>
                 <div className="w-10 h-6 bg-emerald-500 rounded-full relative cursor-pointer shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                 </div>
              </div>
              <div className="p-4 border border-slate-700/50 rounded-xl bg-slate-800/30 flex justify-between items-center">
                 <div>
                   <h4 className="text-white font-medium">Strict RBAC</h4>
                   <p className="text-xs text-slate-400">Enforce role-based access control</p>
                 </div>
                 <div className="w-10 h-6 bg-emerald-500 rounded-full relative cursor-pointer shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                 </div>
              </div>
              <div className="p-4 border border-red-500/20 rounded-xl bg-red-500/10 flex justify-between items-center md:col-span-2 mt-8">
                 <div>
                   <h4 className="text-red-400 font-medium">Emergency System Halt</h4>
                   <p className="text-xs text-red-300">Suspend all logins temporarily</p>
                 </div>
                 <button className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(220,38,38,0.4)]">
                   Initiate Halt
                 </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}
