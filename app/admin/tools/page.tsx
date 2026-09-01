'use client';

import { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { readStorage, writeStorage } from '@/lib/storage';
import { STORAGE_KEYS, TOOLS } from '@/lib/constants';
import type { ToolEntry } from '@/lib/types';

interface AdminTool extends ToolEntry {
  active: boolean;
}

const defaultTools: AdminTool[] = TOOLS.map((t) => ({ ...t, active: true }));

export default function AdminToolsPage() {
  const [tools, setTools] = useState<AdminTool[]>(defaultTools);

  useEffect(() => {
    setTools(
      readStorage<AdminTool[]>(STORAGE_KEYS.adminTools, () => defaultTools, defaultTools)
    );
  }, []);

  const toggle = (id: string) => {
    const next = tools.map((t) => (t.id === id ? { ...t, active: !t.active } : t));
    setTools(next);
    writeStorage(STORAGE_KEYS.adminTools, next);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-ink mb-1">Công cụ</h1>
        <p className="text-sm text-ink-muted">
          Bật/tắt hiển thị từng công cụ trên trang chủ và trang /tools.
        </p>
      </div>

      <div className="space-y-3">
        {tools.map((tool) => (
          <div key={tool.id} className="card p-5 flex items-start gap-4">
            <div
              className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                tool.active ? 'bg-emerald-50 text-emerald-700' : 'bg-line text-ink-subtle'
              )}
            >
              {tool.active ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-ink">{tool.name}</h3>
                <span className="text-xs text-ink-subtle">{tool.href}</span>
              </div>
              <p className="text-sm text-ink-muted mt-1">{tool.description}</p>
            </div>
            <button
              onClick={() => toggle(tool.id)}
              className={cn(
                'shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors',
                tool.active
                  ? 'bg-ink text-white hover:bg-ink/90'
                  : 'bg-line text-ink-muted hover:bg-surface-muted'
              )}
            >
              {tool.active ? 'Đang bật' : 'Đã tắt'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}