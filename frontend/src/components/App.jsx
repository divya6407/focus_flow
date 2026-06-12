import React, { useEffect, useState } from 'react';
import { CheckSquare, Menu } from 'lucide-react';
import { gettask, posttask, deletetask, updatetask, searchtask } from './api.js';
import TaskList from './components/TaskList.jsx';
import TaskForm from './components/TaskForm.jsx';
import SearchBar from './components/SearchBar.jsx';

const StatCard = ({ icon, label, value, sub, accent }) => (
  <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 flex items-center gap-4 flex-1 min-w-0">
    <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${accent}`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[#888] text-xs font-medium truncate">{label}</p>
      <p className="text-white text-2xl font-bold leading-tight">{value}</p>
      <p className="text-[#666] text-xs truncate">{sub}</p>
    </div>
  </div>
);

const App = () => {
  const [task, settask] = useState([]);
  const [editing, setediting] = useState(null);
  const [completed, setcompleted] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => { fetchtask(); }, []);

  const fetchtask = async () => {
    const res = await gettask();
    settask(res.data.filter(t => !t.completed));
    setcompleted(res.data.filter(t => t.completed));
  };

  const handlecreate = async (taskdata) => {
    const res = await posttask(taskdata);
    if (res.sucess) settask([...task, res.data]);
  };

  const handledelete = async (id) => {
    const res = await deletetask(id);
    if (res.sucess) settask(task.filter(t => t.id !== id));
  };

  const handleupdating = (taskdata) => setediting(taskdata);

  const handleupdate = async (id, taskdata) => {
    const res = await updatetask(id, taskdata);
    if (res.sucess) {
      settask(task.map(t => t.id === id ? res.data : t));
      setediting(null);
    }
  };

  const handlesearch = async ({ priority, keyword }) => {
    const res = await searchtask({ priority, keyword });
    settask(res.data.filter(t => !t.completed));
  };

  const handlecomplete = async (taskdata) => {
    const res = await updatetask(taskdata.id, { ...taskdata, completed: !taskdata.completed });
    if (res.sucess) { settask(task.filter(t => t.id !== taskdata.id)); fetchtask(); }
  };

  const total = task.length + completed.length;
  const completionRate = total > 0 ? Math.round((completed.length / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#111111] text-white font-sans">

      {/* ── HEADER ── */}
      <header className="bg-[#111111] border-b border-[#222] px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#22c55e] rounded-md flex items-center justify-center">
            <CheckSquare size={18} className="text-black" />
          </div>
          <div>
            <h1 className="text-white font-bold text-base leading-none tracking-wide">TASK MANAGER</h1>
            <p className="text-[#666] text-[10px] mt-0.5">Stay organized, get more done.</p>
          </div>
        </div>
        <button
          className="md:hidden text-[#888] hover:text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu size={22} />
        </button>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-[#22c55e]"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>}
            label="Total Tasks" value={total} sub="All tasks in your list"
            accent="bg-[#22c55e]/20"
          />
          <StatCard
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-[#f59e0b]"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
            label="Active Tasks" value={task.length} sub="Tasks not completed"
            accent="bg-[#f59e0b]/20"
          />
          <StatCard
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-[#22c55e]"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
            label="Completed Tasks" value={completed.length} sub="Tasks you completed"
            accent="bg-[#22c55e]/20"
          />
          <StatCard
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-[#22c55e]"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>}
            label="Completion Rate" value={`${completionRate}%`} sub="Great progress! 🎉"
            accent="bg-[#22c55e]/20"
          />
        </div>

        {/* ── PROGRESS BAR ── */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-5 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white text-sm font-medium">Overall Progress</span>
            <span className="text-[#888] text-sm">{completionRate}% Completed</span>
          </div>
          <div className="w-full bg-[#2a2a2a] rounded-full h-2.5">
            <div
              className="bg-[#22c55e] h-2.5 rounded-full transition-all duration-700"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* ── MAIN GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-6">

          {/* LEFT: Add/Edit Task Form */}
          <TaskForm
            onsubmit={handlecreate}
            onediting={editing}
            updatetask={handleupdate}
          />

          {/* RIGHT: Search + Task List */}
          <div className="space-y-6">
            <SearchBar onsearch={handlesearch} />

            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
              <TaskList
                task={task}
                ondelete={handledelete}
                onupdate={handleupdating}
                onfinished={handlecomplete}
                showComplete
              />
            </div>
          </div>
        </div>

        {/* ── COMPLETED TASKS ── */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-[#2a2a2a]">
            <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" className="w-5 h-5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <h2 className="text-[#22c55e] font-semibold text-sm">Completed Tasks</h2>
            <span className="ml-auto bg-[#22c55e]/20 text-[#22c55e] text-xs font-bold px-2 py-0.5 rounded-full">
              {completed.length}
            </span>
          </div>
          <TaskList
            task={completed}
            ondelete={handledelete}
            onupdate={handleupdating}
            onfinished={handlecomplete}
          />
        </div>

      </div>
    </div>
  );
};

export default App;
