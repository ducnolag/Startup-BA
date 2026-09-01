'use client';

import { useEffect, useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { readStorage } from '@/lib/storage';
import { SEED_CANDIDATES, SEED_VOTES, STORAGE_KEYS } from '@/lib/constants';
import type { Candidate, VoteEntry } from '@/lib/types';

export default function AdminVotesPage() {
  const [votes, setVotes] = useState<VoteEntry[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>(SEED_CANDIDATES);

  useEffect(() => {
    setVotes(readStorage<VoteEntry[]>(STORAGE_KEYS.votes, () => SEED_VOTES, SEED_VOTES));
    setCandidates(
      readStorage<Candidate[]>(STORAGE_KEYS.candidates, () => SEED_CANDIDATES, SEED_CANDIDATES)
    );
  }, []);

  const totalVotes = votes.length;
  const counts = candidates.map((c) => ({
    ...c,
    count: votes.filter((v) => v.candidateId === c.id).length,
    pct:
      totalVotes > 0
        ? Math.round((votes.filter((v) => v.candidateId === c.id).length / totalVotes) * 100)
        : 0,
  }));
  const winner = counts.reduce((max, c) => (c.count > max.count ? c : max), counts[0]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-ink mb-1">Bình chọn</h1>
        <p className="text-sm text-ink-muted">
          Số liệu bình chọn công cụ tiếp theo từ cộng đồng ({totalVotes} lượt).
        </p>
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-2 mb-5">
          <BarChart3 className="w-4 h-4 text-ink-muted" />
          <h2 className="font-display font-bold text-lg text-ink">Kết quả</h2>
        </div>

        <div className="space-y-4">
          {counts.map((c) => (
            <div key={c.id}>
              <div className="flex items-center justify-between mb-1.5 text-sm">
                <span className="font-semibold text-ink">{c.title}</span>
                <span className="text-ink-muted tabular-nums">
                  {c.count} · {c.pct}%
                </span>
              </div>
              <div className="h-2 bg-line rounded-full overflow-hidden">
                <div
                  className={
                    c.id === winner.id
                      ? 'h-full bg-ink rounded-full transition-all duration-700'
                      : 'h-full bg-ink-muted rounded-full transition-all duration-700'
                  }
                  style={{ width: `${c.pct}%` }}
                />
              </div>
              <div className="text-xs text-ink-subtle mt-1">Đề xuất bởi {c.proposer}</div>
            </div>
          ))}
        </div>

        {winner && (
          <div className="mt-6 pt-5 border-t border-line">
            <p className="text-sm text-ink">
              Đang dẫn đầu:{' '}
              <span className="font-semibold">{winner.title}</span> —{' '}
              <span className="text-brand">{winner.pct}%</span>.
            </p>
          </div>
        )}
      </div>

      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-line">
          <h2 className="font-display font-bold text-lg text-ink">Lượt vote chi tiết</h2>
        </div>
        {votes.length === 0 ? (
          <div className="p-8 text-center text-ink-muted text-sm">Chưa có lượt vote nào.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-muted text-xs uppercase tracking-wider text-ink-subtle">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Email</th>
                  <th className="text-left px-4 py-3 font-semibold">Ứng viên</th>
                  <th className="text-right px-4 py-3 font-semibold">Thời gian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {votes
                  .slice()
                  .sort((a, b) => (a.votedAt < b.votedAt ? 1 : -1))
                  .map((v) => {
                    const cand = candidates.find((c) => c.id === v.candidateId);
                    return (
                      <tr key={v.id}>
                        <td className="px-4 py-3 text-ink">{v.userEmail}</td>
                        <td className="px-4 py-3 text-ink-muted">{cand?.title ?? v.candidateId}</td>
                        <td className="px-4 py-3 text-right text-ink-subtle tabular-nums">
                          {new Date(v.votedAt).toLocaleString('vi-VN')}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}