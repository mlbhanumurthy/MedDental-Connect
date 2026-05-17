import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Card, Badge, Button } from '../components/UI';
import { cn } from '../lib/utils';
import { 
  Users, 
  ClipboardCheck, 
  Clock, 
  TrendingUp, 
  ChevronRight,
  ArrowUpRight, 
  ArrowDownRight,
  Search,
  Filter,
  MessageCircle,
  Phone,
  Mail,
  Zap
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { motion } from 'motion/react';
import { format } from 'date-fns';

import { MOCK_REFERRALS, MOCK_SPECIALISTS } from '../lib/demoData';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const isDemo = user?.uid.startsWith('demo-');
  const [loading, setLoading] = useState(true);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    emergency: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      if (isDemo) {
        const list = MOCK_REFERRALS;
        setReferrals(list);
        const total = list.length;
        const completed = list.filter(r => r.status === 'Completed').length;
        const pending = list.filter(r => r.status !== 'Completed').length;
        const emergency = list.filter(r => r.urgency === 'Emergency').length;
        setStats({ total, completed, pending, emergency });
        setLoading(false);
        return;
      }
      
      const q = query(
        collection(db, 'referrals'),
        where(profile?.role === 'GP' ? 'fromDoctorId' : 'toDoctorId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      try {
        const querySnapshot = await getDocs(q);
        const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
        setReferrals(list);

        const total = list.length;
        const completed = list.filter(r => r.status === 'Completed').length;
        const pending = list.filter(r => r.status !== 'Completed').length;
        const emergency = list.filter(r => r.urgency === 'Emergency').length;

        setStats({ total, completed, pending, emergency });
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'referrals');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, profile]);

  const chartData = [
    { name: 'Jan', count: 12 },
    { name: 'Feb', count: 18 },
    { name: 'Mar', count: 25 },
    { name: 'Apr', count: referrals.length || 32 },
  ];

  const statusData = [
    { name: 'Scheduled', value: referrals.filter(r => r.status === 'Scheduled').length || 10, color: '#3b82f6' },
    { name: 'Completed', value: referrals.filter(r => r.status === 'Completed').length || 5, color: '#22c55e' },
    { name: 'Started', value: referrals.filter(r => r.status === 'Treatment Started').length || 8, color: '#eab308' },
    { name: 'Review', value: referrals.filter(r => r.status === 'Submitted').length || 4, color: '#94a3b8' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Collaborative Care Dashboard</h1>
          <p className="text-slate-500 font-medium">Monitoring clinical outcomes and referral efficiency</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" className="bg-[#161B22] border-white/5">
            <Filter className="w-4 h-4 mr-2" />
            Filter Data
          </Button>
          <Button size="sm">
            Generate Quarterly Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Users className="text-blue-500" />} 
          title="Active Referrals" 
          value={stats.total || 1284} 
          trend="+12%" 
          isUp={true} 
        />
        <StatCard 
          icon={<Clock className="text-amber-500" />} 
          title="Avg Clearance" 
          value={"3.2 Days"} 
          trend="-2%" 
          isUp={false} 
        />
        <StatCard 
          icon={<ClipboardCheck className="text-green-500" />} 
          title="Treatment Success" 
          value={stats.completed > 0 ? `${Math.round((stats.completed/stats.total)*100)}%` : "98.4%"} 
          trend="+0.2%" 
          isUp={true} 
        />
        <StatCard 
          icon={<TrendingUp className="text-blue-400" />} 
          title="Leakage Saved" 
          value={"$42.8k"} 
          trend="+15%" 
          isUp={true} 
        />
      </div>

      {/* Analytics Charts & Specialist Directory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <Card className="bg-[#161B22] border-white/5 p-6">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-semibold text-white text-sm">Referral Growth & Success Rate</h3>
              <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                 <div className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> Growth</div>
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10, fontWeight: 700}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10, fontWeight: 700}} />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.02)'}}
                    contentStyle={{backgroundColor: '#0D1117', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)'}}
                    itemStyle={{color: '#94a3b8'}}
                  />
                  <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between mt-4 px-8 text-[10px] text-slate-500 uppercase font-bold tracking-widest">
              {chartData.map(d => <span key={d.name}>{d.name}</span>)}
            </div>
          </Card>

          <Card className="bg-[#161B22] border-white/5">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="font-semibold text-white text-sm">Active Collaborative Referrals</h3>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-8 border-white/5 text-[10px]">
                  View All
                  <ChevronRight size={12} className="ml-1" />
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <th className="py-4 px-6 font-bold">Patient</th>
                    <th className="py-4 px-6 font-bold">Category</th>
                    <th className="py-4 px-6 font-bold">Specialist</th>
                    <th className="py-4 px-6 font-bold text-right">Connect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {referrals.map((r) => {
                    const specialist = isDemo ? MOCK_SPECIALISTS.find(s => s.id === r.toDoctorId) : null;
                    const waMsg = `Hi ${specialist?.displayName}, checking in on referral for ${r.patientName} (${r.category}). Current Status: ${r.status}.`;

                    return (
                      <tr key={r.id} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-6">
                          <div className="text-xs font-semibold text-white">{r.patientName}</div>
                          <div className="text-[10px] text-slate-500 font-medium">Ref: {r.id.slice(0,8)}</div>
                        </td>
                        <td className="py-4 px-6">
                          <Badge variant={r.urgency === 'Emergency' ? 'error' : r.urgency === 'Urgent' ? 'warning' : 'info'}>
                            {r.category}
                          </Badge>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-[10px] font-bold text-white uppercase tracking-tight">{specialist?.displayName || 'Allocating...'}</div>
                          <div className="text-[9px] text-slate-500 font-medium italic">{specialist?.specialty}</div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex justify-end gap-2">
                            {specialist?.phone && (
                              <a 
                                href={`https://wa.me/${specialist.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(waMsg)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 bg-green-500/10 text-green-400 rounded-lg border border-green-500/20 hover:bg-green-500/20 transition-all"
                              >
                                <MessageCircle size={14} />
                              </a>
                            )}
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-white/5 border border-white/5">
                              <ArrowUpRight size={14} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-[#161B22] border-white/5 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-semibold text-white">AI Urgency Monitoring</h2>
              <Badge variant="info">Live</Badge>
            </div>
            <div className="space-y-4">
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <div className="flex justify-between items-start mb-1">
                  <div className="text-[10px] font-bold text-red-400 uppercase tracking-widest">High Priority</div>
                  <div className="text-[10px] text-red-300/40">2m ago</div>
                </div>
                <div className="text-xs font-semibold text-white">Alex Rivera - Trauma</div>
                <div className="text-[10px] text-slate-400 mt-1">AI Detect: Maxillofacial fracture detected. Suggest immediate consult.</div>
              </div>
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                <div className="flex justify-between items-start mb-1">
                  <div className="text-[10px] font-bold text-yellow-400 uppercase">Routine</div>
                  <div className="text-[10px] text-yellow-300/40">1h ago</div>
                </div>
                <div className="text-xs font-semibold text-white">Sam Taylor - Implant</div>
                <div className="text-[10px] text-slate-400 mt-1">Systemic notes indicate anticoagulant use. Require proto-prep.</div>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Consulting Specialists</h3>
              <Zap size={12} className="text-blue-500 fill-blue-500" />
            </div>
            {isDemo && MOCK_SPECIALISTS.map(spec => (
              <Card key={spec.id} className="p-4 bg-[#161B22] border-white/5 hover:border-blue-500/30 transition-all group relative overflow-hidden">
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 bg-[#0D1117] rounded-2xl flex items-center justify-center text-blue-500 border border-white/10 group-hover:border-blue-500/50 transition-colors shadow-inner">
                    <Users size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{spec.displayName}</h4>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">{spec.specialty}</p>
                    <div className="flex items-center gap-2 mt-2">
                       <a 
                        href={`https://wa.me/${spec.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hi ' + spec.displayName + ', I am a GP reaching out via HealthSync AI regarding a patient referral.')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 text-green-400 rounded-md text-[9px] font-bold uppercase tracking-widest border border-green-500/20 hover:bg-green-500/20 transition-all"
                       >
                         <MessageCircle size={10} />
                         WhatsApp
                       </a>
                       <a 
                        href={`mailto:${spec.email}`}
                        className="flex items-center gap-1.5 px-2 py-1 bg-blue-500/10 text-blue-400 rounded-md text-[9px] font-bold uppercase tracking-widest border border-blue-500/20 hover:bg-blue-500/20 transition-all"
                       >
                         <Mail size={10} />
                         Email
                       </a>
                    </div>
                  </div>
                </div>
                <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-blue-600/5 rounded-full blur-2xl group-hover:bg-blue-600/10 transition-all"></div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, trend, isUp }: any) {
  return (
    <Card className="p-4 h-24 bg-[#161B22] border-white/5 flex flex-col justify-between shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{title}</div>
        <div className={cn(
          "text-[10px] font-bold",
          isUp ? "text-green-500" : "text-red-500"
        )}>
          {trend}
        </div>
      </div>
      <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
    </Card>
  );
}
