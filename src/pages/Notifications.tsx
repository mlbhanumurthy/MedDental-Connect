import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Card, Button, Badge } from '../components/UI';
import { Bell, BellOff, Check, Trash2, Clock, CheckCircle2, MessageSquare, Files } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

import { MOCK_NOTIFICATIONS } from '../lib/demoData';

export default function Notifications() {
  const { user } = useAuth();
  const isDemo = user?.uid.startsWith('demo-');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    if (isDemo) {
      setNotifications(MOCK_NOTIFICATIONS);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, `users/${user.uid}/notifications`),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotifications(list);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${user.uid}/notifications`);
    });

    return () => unsubscribe();
  }, [user]);

  const markAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, `users/${user?.uid}/notifications`, id), {
        read: true,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user?.uid}/notifications/${id}`);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'NewReferral': return <CheckCircle2 className="text-blue-400" />;
      case 'FeedbackReceived': return <MessageSquare className="text-green-400" />;
      case 'DocumentShared': return <Files className="text-amber-400" />;
      default: return <Bell className="text-slate-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tighter">Clinical Alerts</h1>
          <p className="text-slate-500 font-medium italic">High-velocity updates for your workspace</p>
        </div>
        <Badge variant={notifications.filter(n => !n.read).length > 0 ? 'error' : 'neutral'}>
          {notifications.filter(n => !n.read).length} Unread Alerts
        </Badge>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className={cn(
                "p-5 flex items-start gap-4 transition-all border-l-4",
                notif.read ? "border-white/5 bg-[#161B22] opacity-60" : "border-blue-500 bg-blue-500/5"
              )}>
                <div className="p-3 bg-[#0D1117] rounded-xl shadow-lg border border-white/5">
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className={cn("text-slate-300 leading-relaxed text-sm", !notif.read && "font-bold text-white")}>
                        {notif.message}
                      </p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1.5">
                          <Clock size={12} />
                          {notif.createdAt?.toDate 
                            ? format(notif.createdAt.toDate(), 'PPp') 
                            : notif.createdAt 
                              ? format(new Date(notif.createdAt), 'PPp')
                              : 'Just now'}
                        </span>
                        <div className="h-1 w-1 bg-slate-700 rounded-full"></div>
                        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{notif.type}</span>
                      </div>
                    </div>
                    {!notif.read && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => markAsRead(notif.id)}
                        className="flex-shrink-0 text-blue-400 hover:text-blue-300 bg-white/5 border border-white/5"
                      >
                        <Check size={14} className="mr-1.5" />
                        Acknowledge
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {notifications.length === 0 && !loading && (
          <div className="text-center py-24 bg-[#0D1117] rounded-3xl border border-dashed border-white/5">
            <div className="inline-flex p-6 bg-white/5 rounded-full text-slate-700 mb-6">
              <BellOff size={48} />
            </div>
            <h3 className="text-xl font-bold text-white">System Clear</h3>
            <p className="text-slate-500 max-w-xs mx-auto mt-2 font-medium">Your clinical feed is up to date.</p>
          </div>
        )}
      </div>
    </div>
  );
}
