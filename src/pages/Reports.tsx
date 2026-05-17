import React from 'react';
import { Card, Button, Badge } from '../components/UI';
import { FileText, Download, Eye, Clock, ShieldCheck, FileSearch } from 'lucide-react';
import { motion } from 'motion/react';

export default function Reports() {
  const reports = [
    { id: '1', title: 'Post-Op Recovery Report', patient: 'Sarah Mitchell', date: '2026-05-10', type: 'Clinical', status: 'Verified' },
    { id: '2', title: 'Maxillofacial Scan Analysis', patient: 'James Wilson', date: '2026-05-08', type: 'Diagnostic', status: 'Verified' },
    { id: '3', title: 'Implant Clearance Final', patient: 'Emma Thompson', date: '2026-05-01', type: 'Certificate', status: 'Archived' },
  ];

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tighter">Clinical Registry</h1>
          <p className="text-slate-500 font-medium italic">High-trust verification and outcome storage</p>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" className="bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-widest h-10 px-6">
            <Download size={14} className="mr-2" />
            Export Archive
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="bg-blue-600 border-none p-10 flex flex-col justify-between shadow-2xl shadow-blue-500/20 relative overflow-hidden group">
           <div className="relative z-10">
             <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
                <FileSearch size={24} className="text-white" />
             </div>
             <h3 className="text-2xl font-bold text-white mb-3 tracking-tight leading-tight">Generate Multi-Case Summary</h3>
             <p className="text-blue-100 text-xs font-medium leading-relaxed">Aggregate referral data for clinical audits and performance reviews.</p>
           </div>
           <Button variant="secondary" className="mt-10 bg-white text-blue-600 border-none font-bold uppercase tracking-widest text-[10px] h-12 rounded-xl group-hover:translate-y-[-2px] transition-transform">Start System Analysis</Button>
           <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-3xl transition-transform group-hover:scale-110"></div>
        </Card>

        <Card className="p-10 border border-white/5 flex flex-col items-center justify-center text-center bg-[#161B22] relative overflow-hidden">
           <div className="w-16 h-16 bg-[#0D1117] border border-white/5 rounded-full flex items-center justify-center text-slate-700 mb-6 shadow-inner">
              <Download size={32} />
           </div>
           <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Full Registry Export</h3>
           <p className="text-slate-500 text-xs font-medium max-w-[200px] leading-relaxed">Secure end-to-end encrypted archive of all patient referrals.</p>
           <div className="mt-8 flex gap-2">
              <Badge className="bg-white/5 border-white/5 text-[9px] font-bold uppercase">JSON</Badge>
              <Badge className="bg-white/5 border-white/5 text-[9px] font-bold uppercase">CSV</Badge>
           </div>
        </Card>
      </div>

      <Card className="p-8 bg-[#161B22] border-white/5">
        <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
          <div>
            <h3 className="font-bold text-white text-lg tracking-tight">Verified Records</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Found 3 High-Trust Records</p>
          </div>
          <Badge className="bg-blue-600/10 text-blue-400 border border-blue-500/20 px-3 py-1 font-bold text-[10px] uppercase">Secure Hash Active</Badge>
        </div>
        <div className="space-y-4">
          {reports.map((report, i) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between p-5 bg-[#0D1117] rounded-2xl border border-white/5 group hover:border-blue-500/30 transition-all shadow-sm"
            >
              <div className="flex items-center gap-5">
                <div className="p-3 bg-white/5 rounded-xl text-blue-500 border border-white/5 transition-colors group-hover:bg-blue-600/10">
                  <FileText size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm mb-1">{report.title}</h4>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{report.patient}</span>
                    <div className="w-1 h-1 bg-slate-700 rounded-full"></div>
                    <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{report.type}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="hidden md:flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase">
                  <Clock size={12} className="text-slate-600" />
                  {report.date}
                </div>
                <Badge variant={report.status === 'Verified' ? 'success' : 'neutral'} className="h-6 border-none px-3 font-bold text-[9px] uppercase tracking-widest">
                   <ShieldCheck size={10} className="inline mr-1.5" />
                   {report.status}
                </Badge>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="bg-white/5 border border-white/5 h-8 w-8 p-0 rounded-lg hover:bg-blue-600/10 hover:text-blue-400 transition-colors">
                    <Eye size={14} />
                  </Button>
                  <Button variant="ghost" size="sm" className="bg-white/5 border border-white/5 h-8 w-8 p-0 rounded-lg hover:bg-blue-600/10 hover:text-blue-400 transition-colors">
                    <Download size={14} />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}
