import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Plus, X, GripVertical, ExternalLink } from 'lucide-react';
import { TrackedJob } from '../types';
import { useNotification } from '../context/NotificationContext';
import Navbar from '../components/Navbar';

const columns = [
  { id: 'saved' as const, label: 'Saved', icon: '📋', color: 'border-[--border-2]' },
  { id: 'applied' as const, label: 'Applied', icon: '📤', color: 'border-brand-blue/30' },
  { id: 'interview' as const, label: 'Interview', icon: '📞', color: 'border-yellow-500/30' },
  { id: 'offer' as const, label: 'Offer', icon: '🎯', color: 'border-brand-green/30' },
  { id: 'rejected' as const, label: 'Rejected', icon: '❌', color: 'border-red-500/30' },
];

const STORAGE_KEY = 'job_tracker_data';

function loadJobs(): TrackedJob[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch { return []; }
}

function saveJobs(jobs: TrackedJob[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
}

export default function TrackerPage() {
  const { showSuccess } = useNotification();
  const [jobs, setJobs] = useState<TrackedJob[]>(loadJobs);
  const [showModal, setShowModal] = useState(false);
  const [draggedJob, setDraggedJob] = useState<string | null>(null);
  const [form, setForm] = useState({
    company: '', title: '', url: '', dateApplied: '', notes: '', salary: '', status: 'saved' as TrackedJob['status'],
  });

  useEffect(() => {
    document.title = 'Job Tracker | ResumeRoast';
  }, []);

  useEffect(() => { saveJobs(jobs); }, [jobs]);

  const stats = {
    total: jobs.filter((j) => j.status !== 'saved').length,
    interviews: jobs.filter((j) => j.status === 'interview').length,
    offers: jobs.filter((j) => j.status === 'offer').length,
    successRate: jobs.filter((j) => j.status !== 'saved').length > 0
      ? Math.round((jobs.filter((j) => j.status === 'offer').length / jobs.filter((j) => j.status !== 'saved').length) * 100)
      : 0,
  };

  const handleAdd = () => {
    if (!form.company.trim() || !form.title.trim()) return;
    const newJob: TrackedJob = {
      id: Date.now().toString(),
      ...form,
      dateApplied: form.dateApplied || new Date().toISOString().split('T')[0],
    };
    setJobs([...jobs, newJob]);
    setShowModal(false);
    setForm({ company: '', title: '', url: '', dateApplied: '', notes: '', salary: '', status: 'saved' });
    showSuccess('Job Added!', `${form.company} - ${form.title} added to tracker.`);
  };

  const handleDragStart = (jobId: string) => { setDraggedJob(jobId); };
  const handleDragEnd = () => { setDraggedJob(null); };
  const handleDrop = (status: TrackedJob['status']) => {
    if (!draggedJob) return;
    setJobs(jobs.map((j) => j.id === draggedJob ? { ...j, status } : j));
    setDraggedJob(null);
  };

  const handleDelete = (id: string) => {
    setJobs(jobs.filter((j) => j.id !== id));
  };

  return (
    <div className="min-h-screen bg-dark-bg text-text-primary">
      <Navbar />
      <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Briefcase className="w-7 h-7 text-brand-blue" />
              <h1 className="text-3xl font-display font-bold text-text-primary">Job Tracker</h1>
            </div>
            <p className="text-text-muted text-sm">Drag cards between columns to update status.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-full text-white transition-all active:scale-[0.97] hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)' }}
          >
            <Plus className="w-4 h-4" />
            Add Job
          </button>
        </motion.div>

        {/* Stats Bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Applied', value: stats.total },
            { label: 'Interviews', value: stats.interviews },
            { label: 'Offers', value: stats.offers },
            { label: 'Success Rate', value: `${stats.successRate}%` },
          ].map((s) => (
            <div key={s.label} className="p-4 rounded-xl bg-surface-2 border border-[--border-1] text-center">
              <p className="text-2xl font-bold text-text-primary">{s.value}</p>
              <p className="text-xs text-text-muted">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 overflow-x-auto">
          {columns.map((col, colIndex) => (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + colIndex * 0.05 }}
              className={`rounded-xl bg-surface-2 border ${col.color} p-3 min-h-[300px]`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(col.id)}
            >
              <div className="flex items-center gap-2 mb-3 px-1">
                <span>{col.icon}</span>
                <span className="text-sm font-medium text-text-primary">{col.label}</span>
                <span className="ml-auto text-xs text-text-tertiary">
                  {jobs.filter((j) => j.status === col.id).length}
                </span>
              </div>
              <div className="space-y-2">
                {jobs
                  .filter((j) => j.status === col.id)
                  .map((job) => (
                    <div
                      key={job.id}
                      draggable
                      onDragStart={() => handleDragStart(job.id)}
                      onDragEnd={handleDragEnd}
                      className={`p-3 rounded-lg bg-surface-3 border border-[--border-1] cursor-grab active:cursor-grabbing transition-all ${
                        draggedJob === job.id ? 'opacity-50 scale-95' : 'hover:border-[--border-2]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <GripVertical className="w-3 h-3 text-text-tertiary mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary truncate">{job.company}</p>
                          <p className="text-xs text-text-muted truncate">{job.title}</p>
                          {job.salary && <p className="text-xs text-brand-green mt-1">{job.salary}</p>}
                          <p className="text-xs text-text-tertiary mt-1">{job.dateApplied}</p>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          {job.url && (
                            <a href={job.url} target="_blank" rel="noopener noreferrer" className="p-1 rounded hover:bg-surface-2 transition-colors">
                              <ExternalLink className="w-3 h-3 text-text-muted" />
                            </a>
                          )}
                          <button onClick={() => handleDelete(job.id)} className="p-1 rounded hover:bg-red-500/10 transition-colors">
                            <X className="w-3 h-3 text-text-muted hover:text-red-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add Job Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(8,8,15,0.8)] backdrop-blur-xl"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md p-6 rounded-2xl bg-surface-2 border border-[--border-1]"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-display font-semibold text-text-primary">Add Job</h3>
                  <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-surface-3 transition-colors">
                    <X className="w-5 h-5 text-text-muted" />
                  </button>
                </div>

                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Company name *"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full p-3 rounded-xl bg-surface-3 border border-[--border-1] text-text-primary text-sm placeholder:text-text-tertiary focus:outline-none focus:border-brand-purple/40"
                  />
                  <input
                    type="text"
                    placeholder="Job title *"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full p-3 rounded-xl bg-surface-3 border border-[--border-1] text-text-primary text-sm placeholder:text-text-tertiary focus:outline-none focus:border-brand-purple/40"
                  />
                  <input
                    type="url"
                    placeholder="Job URL"
                    value={form.url}
                    onChange={(e) => setForm({ ...form, url: e.target.value })}
                    className="w-full p-3 rounded-xl bg-surface-3 border border-[--border-1] text-text-primary text-sm placeholder:text-text-tertiary focus:outline-none focus:border-brand-purple/40"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="date"
                      value={form.dateApplied}
                      onChange={(e) => setForm({ ...form, dateApplied: e.target.value })}
                      className="w-full p-3 rounded-xl bg-surface-3 border border-[--border-1] text-text-primary text-sm focus:outline-none focus:border-brand-purple/40"
                    />
                    <input
                      type="text"
                      placeholder="Salary range"
                      value={form.salary}
                      onChange={(e) => setForm({ ...form, salary: e.target.value })}
                      className="w-full p-3 rounded-xl bg-surface-3 border border-[--border-1] text-text-primary text-sm placeholder:text-text-tertiary focus:outline-none focus:border-brand-purple/40"
                    />
                  </div>
                  <textarea
                    placeholder="Notes"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={2}
                    className="w-full p-3 rounded-xl bg-surface-3 border border-[--border-1] text-text-primary text-sm placeholder:text-text-tertiary focus:outline-none focus:border-brand-purple/40 resize-none"
                  />
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as TrackedJob['status'] })}
                    className="w-full p-3 rounded-xl bg-surface-3 border border-[--border-1] text-text-primary text-sm focus:outline-none focus:border-brand-purple/40"
                  >
                    {columns.map((c) => (
                      <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleAdd}
                  disabled={!form.company.trim() || !form.title.trim()}
                  className="w-full mt-4 py-3 text-sm font-semibold rounded-full text-white disabled:opacity-50 transition-all active:scale-[0.97] hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)' }}
                >
                  Add Job
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
