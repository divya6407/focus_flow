import React, { useState } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';

const PRIORITY_OPTIONS = [
  { value: '',       label: 'All Priorities' },
  { value: 'high',   label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low',    label: 'Low' },
];

const SearchBar = ({ onsearch }) => {
  const [keyword, setkeyword] = useState('');
  const [priority, setpriority] = useState('');

  const handlesubmit = (e) => {
    e.preventDefault();
    onsearch({ priority, keyword });
  };

  const cancelsearch = () => {
    setkeyword('');
    setpriority('');
    onsearch({ priority: '', keyword: '' });
  };

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Search size={16} className="text-[#22c55e]" />
        <h2 className="text-[#22c55e] font-semibold text-sm">Search Tasks</h2>
      </div>

      <form onSubmit={handlesubmit}>
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Keyword input */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by keyword..."
              value={keyword}
              onChange={e => setkeyword(e.target.value)}
              className="w-full bg-[#111] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm placeholder-[#555] outline-none focus:border-[#22c55e] transition-colors"
            />
          </div>

          {/* Priority select */}
          <div className="relative sm:w-44">
            <select
              value={priority}
              onChange={e => setpriority(e.target.value)}
              className="w-full appearance-none bg-[#111] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-[#22c55e] transition-colors cursor-pointer pr-8"
            >
              {PRIORITY_OPTIONS.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] pointer-events-none" />
          </div>

          {/* Search button */}
          <button
            type="submit"
            className="bg-[#22c55e] hover:bg-[#16a34a] text-black rounded-lg px-4 py-2.5 flex items-center justify-center transition-colors shrink-0"
          >
            <Search size={16} />
          </button>

          {/* Clear button */}
          <button
            type="button"
            onClick={cancelsearch}
            className="border border-[#2a2a2a] hover:border-[#444] text-[#888] hover:text-white rounded-lg px-4 py-2.5 flex items-center justify-center transition-colors shrink-0"
          >
            <X size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
