import React, { useEffect, useState } from 'react';
import { Pencil, PlusCircle, XCircle, ChevronDown } from 'lucide-react';

const PRIORITY_OPTIONS = [
  { value: 'high',   label: 'High Priority',   dot: 'bg-red-500' },
  { value: 'medium', label: 'Medium Priority',  dot: 'bg-yellow-400' },
  { value: 'low',    label: 'Low Priority',     dot: 'bg-[#22c55e]' },
];

function TaskForm({ onsubmit, onediting, updatetask }) {
  const [task, settask] = useState('');
  const [priority, setpriority] = useState('medium');

  useEffect(() => {
    if (onediting) {
      settask(onediting.title);
      setpriority(onediting.priority?.toLowerCase() || 'medium');
    }
  }, [onediting]);

  const handlesubmit = (e) => {
    e.preventDefault();
    if (!task.trim()) return;
    if (!onediting) {
      onsubmit({ title: task, priority, completed: false });
    } else {
      updatetask(onediting.id, { title: task, priority, completed: onediting.completed });
    }
    settask('');
    setpriority('medium');
  };

  const canceledit = () => {
    settask('');
    setpriority('medium');
  };

  const selected = PRIORITY_OPTIONS.find(p => p.value === priority) || PRIORITY_OPTIONS[1];

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 h-fit">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <Pencil size={16} className="text-[#22c55e]" />
        <h2 className="text-[#22c55e] font-semibold text-sm">
          {onediting ? 'Edit Task' : 'Add / Edit Task'}
        </h2>
      </div>

      <form onSubmit={handlesubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="text-[#888] text-xs font-medium block mb-2">Title</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Enter task title..."
              value={task}
              onChange={e => settask(e.target.value)}
              className="w-full bg-[#111] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm placeholder-[#555] outline-none focus:border-[#22c55e] transition-colors pr-10"
            />
            <svg viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
        </div>

        {/* Priority */}
        <div>
          <label className="text-[#888] text-xs font-medium block mb-2">Priority</label>
          <div className="relative">
            <select
              value={priority}
              onChange={e => setpriority(e.target.value)}
              className="w-full appearance-none bg-[#111] border border-[#2a2a2a] rounded-lg px-4 py-2.5 pr-10 text-white text-sm outline-none focus:border-[#22c55e] transition-colors cursor-pointer"
            >
              {PRIORITY_OPTIONS.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aaa] pointer-events-none" />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-black font-semibold text-sm rounded-lg py-2.5 flex items-center justify-center gap-2 transition-colors"
        >
          <PlusCircle size={16} />
          {onediting ? 'Update Task' : 'Submit Task'}
        </button>

        {/* Cancel */}
        <button
          type="button"
          onClick={canceledit}
          className="w-full bg-transparent border border-[#2a2a2a] hover:border-[#444] text-[#888] hover:text-white font-medium text-sm rounded-lg py-2.5 flex items-center justify-center gap-2 transition-colors"
        >
          <XCircle size={16} />
          Cancel
        </button>
      </form>
    </div>
  );
}

export default TaskForm;
