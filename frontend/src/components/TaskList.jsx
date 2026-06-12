import React from 'react';
import { Pencil, Trash2, CheckCircle, RotateCcw } from 'lucide-react';

const PRIORITY_MAP = {
  high:   { dot: 'bg-red-500',      label: 'High Priority',   text: 'text-red-400' },
  medium: { dot: 'bg-yellow-400',   label: 'Medium Priority', text: 'text-yellow-400' },
  low:    { dot: 'bg-[#22c55e]',    label: 'Low Priority',    text: 'text-[#22c55e]' },
};

const TaskIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
    <polyline points="13 2 13 9 20 9"/>
  </svg>
);

function TaskList({ task, ondelete, onupdate, onfinished, showComplete }) {
  if (!task || task.length === 0) {
    return (
      <div className="px-5 py-8 text-center text-[#555] text-sm">
        No tasks to display.
      </div>
    );
  }

  return (
    <div className="divide-y divide-[#222]">
      {task.map((t, idx) => {
        const prio = PRIORITY_MAP[t.priority?.toLowerCase()] || PRIORITY_MAP.medium;
        return (
          <div
            key={t.id}
            className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#1f1f1f] transition-colors group"
          >
            {/* Priority dot */}
            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${prio.dot}`} />

            {/* Task info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <TaskIcon />
                <span className={`text-white text-sm font-medium truncate ${t.completed ? 'line-through text-[#555]' : ''}`}>
                  {t.title}
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${prio.text}`}>{prio.label}</p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              {!t.completed && (
                <>
                  <button
                    onClick={() => onupdate(t)}
                    className="w-8 h-8 rounded-md border border-[#2a2a2a] hover:border-[#22c55e] flex items-center justify-center text-[#ccc] hover:text-white transition-colors bg-[#121212]"
                    title="Edit"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => ondelete(t.id)}
                    className="w-8 h-8 rounded-md border border-[#2a2a2a] hover:border-red-500 flex items-center justify-center text-[#ccc] hover:text-white transition-colors bg-[#121212]"
                    title="Delete"
                  >
                    <Trash2 size={13} />
                  </button>
                </>
              )}

              {!t.completed ? (
                <button
                  onClick={() => onfinished(t)}
                  className="w-8 h-8 rounded-md border border-[#2a2a2a] hover:border-[#22c55e] flex items-center justify-center text-[#ccc] hover:text-white transition-colors bg-[#121212]"
                  title="Mark complete"
                >
                  <CheckCircle size={13} />
                </button>
              ) : (
                <>
                  <span className="hidden sm:inline-flex items-center gap-1 bg-[#22c55e]/10 text-[#22c55e] text-xs font-medium px-3 py-1.5 rounded-md border border-[#22c55e]/20">
                    Completed
                  </span>
                  <button
                    onClick={() => onfinished(t)}
                    className="flex items-center gap-1.5 border border-[#2a2a2a] hover:border-[#444] text-[#ccc] hover:text-white text-xs font-medium px-3 py-1.5 rounded-md transition-colors bg-[#121212]"
                    title="Mark not completed"
                  >
                    <RotateCcw size={11} />
                    <span className="hidden sm:inline">Not Completed</span>
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}

      {/* Footer count */}
      <div className="px-5 py-3 text-center">
        <p className="text-[#555] text-xs">
          Showing {task.length} of {task.length} {showComplete ? 'completed' : 'tasks'}
        </p>
      </div>
    </div>
  );
}

export default TaskList;
