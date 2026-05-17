import React from 'react';
import { motion } from 'motion/react';
import { 
  Stethoscope, 
  ShieldCheck, 
  Zap, 
  Share2, 
  ArrowRight,
  ClipboardPlus,
  ShieldAlert,
  Dna
} from 'lucide-react';
import { Button } from '../components/UI';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-200">
      {/* Navbar */}
      <nav className="container mx-auto px-6 py-8 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-500/20">
            <Stethoscope size={24} />
          </div>
          <span className="font-bold text-xl tracking-tight text-white font-sans">HealthSync</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-slate-400 hover:text-white font-medium transition-colors text-xs uppercase tracking-widest font-bold">Features</a>
          <a href="#security" className="text-slate-400 hover:text-white font-medium transition-colors text-xs uppercase tracking-widest font-bold">Security</a>
          <Link to="/login">
            <Button variant="ghost" size="sm">Login</Button>
          </Link>
          <Link to="/login?mode=signup">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="container mx-auto px-6 py-20 lg:py-32 text-center lg:text-left flex flex-col lg:flex-row items-center gap-16">
        <div className="lg:w-1/2">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-1.5 rounded-full text-[10px] font-bold mb-8 uppercase tracking-widest border border-blue-500/20"
          >
            <Zap size={14} className="fill-blue-400" />
            <span>AI-Powered Medical-Dental Collaborative Network</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl lg:text-8xl font-bold text-white leading-[0.95] mb-8 tracking-tighter"
          >
            Unified Care.<br />
            <span className="text-blue-600">Zero</span> Friction.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium"
          >
            Elevate patient outcomes with high-speed referral automation. 
            Connect GPs and specialists on a platform built for clinical security and collaborative excellence.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6"
          >
            <Link to="/login?mode=signup">
              <Button size="lg" className="w-full sm:w-auto h-16 px-10 text-lg font-bold group rounded-2xl">
                Join the Network
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button size="lg" variant="secondary" className="w-full sm:w-auto h-16 px-10 text-lg font-bold rounded-2xl">
              Watch Ecosystem Brief
            </Button>
          </motion.div>
        </div>
        <div className="lg:w-1/2 relative">
          <motion.div
            initial={{ opacity: 0, rotate: -2 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ delay: 0.2 }}
            className="relative z-10 bg-slate-800 border border-white/10 p-2 rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="bg-[#0B0E14] rounded-[2.3rem] overflow-hidden aspect-video relative">
               <div className="p-10 flex flex-col justify-end h-full text-white">
                  <div className="flex gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-blue-600 shadow-xl shadow-blue-500/20 flex items-center justify-center font-bold text-xl">GP</div>
                    <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-xl text-blue-400">DS</div>
                  </div>
                  <h3 className="text-3xl font-bold mb-2 tracking-tight">Active Referral: Alex Mitchell</h3>
                  <p className="opacity-50 font-medium">Status: Treatment Started • Priority: High</p>
               </div>
            </div>
          </motion.div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-600/10 rounded-full blur-[120px] -z-10"></div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="bg-[#0D1117] py-24 border-y border-white/5">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          {[
            { label: 'Network Doctors', value: '2,500+' },
            { label: 'Referrals Managed', value: '45k+' },
            { label: 'Accuracy Rating', value: '98.4%' },
            { label: 'Efficiency Gain', value: '85%' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h4 className="text-5xl font-bold text-white mb-3 tracking-tighter">{stat.value}</h4>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-24">
             <div className="text-blue-500 font-bold uppercase tracking-widest text-xs mb-4">Core Ecosystem</div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">Engineered for Precision</h2>
            <p className="text-lg text-slate-400 font-medium">Next-generation clinical communication infrastructure.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<ClipboardPlus className="text-blue-500" size={32} />}
              title="One-Click Portal"
              description="High-velocity referral submission with integrated clinical decision supports."
            />
            <FeatureCard 
              icon={<Zap className="text-blue-400" size={32} />}
              title="AI Intelligence"
              description="Real-time clinical summarization and risk stratification using medical LLMs."
            />
            <FeatureCard 
              icon={<ShieldCheck className="text-emerald-500" size={32} />}
              title="Security Protocol"
              description="End-to-end encrypted medical data vault aligning with global privacy standards."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-20 mt-20">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-xs">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-indigo-600 p-2 rounded-xl text-white">
                <Stethoscope size={24} />
              </div>
              <span className="font-bold text-xl tracking-tight">HealthSync</span>
            </div>
            <p className="opacity-60 text-sm leading-relaxed underline-offset-4">
              Pioneering collaborative care through secure, AI-powered communication between healthcare professionals.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
            <div>
              <h5 className="font-bold mb-6">Platform</h5>
              <ul className="space-y-4 opacity-60 text-sm">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Referral Portal</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">AI Diagnostics</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Security Architecture</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-6">Company</h5>
              <ul className="space-y-4 opacity-60 text-sm">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Partners</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-6 mt-20 pt-10 border-t border-white/10 text-center opacity-40 text-xs">
          <p>© 2026 HealthSync Referral Ecosystem. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300"
    >
      <div className="mb-6">{icon}</div>
      <h3 className="text-xl font-bold text-slate-900 mb-4">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </motion.div>
  );
}
