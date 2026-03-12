import { useState } from 'react';
import { Search, Eye, Download, ArrowLeft } from 'lucide-react';
import { useSessions } from '../../hooks/useSessions';
import { useGraphContext } from '../../hooks/useGraphContext';
import { ValidationResults } from '../results/ValidationResults';

const C = {
  navy: 'var(--c-primary)',
  blue: 'var(--c-accent)',
  blueLight: 'var(--c-accent-light)',
  card: 'var(--c-bg-card)',
  border: 'var(--c-border)',
  textSub: 'var(--c-text-sub)',
  textMuted: 'var(--c-text-muted)',
};

function getScoreColor(score: number) {
  if (score >= 80) return 'var(--c-success)';
  if (score >= 60) return 'var(--c-warning)';
  if (score >= 40) return '#ca8a04';
  return 'var(--c-danger)';
}

const SEVERITY_FILTER_OPTIONS = ['All Severities', 'Critical', 'High', 'Medium', 'Low'];

export function HistoryTab() {
  const [search, setSearch] = useState('');
  const [severity, setSeverity] = useState('All Severities');
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const { sessions, isLoading } = useSessions();
  const { loadSession } = useGraphContext();

  const filtered = sessions.filter((s: any) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleViewResults = async (sessionId: string) => {
    await loadSession(sessionId);
    setSelectedSessionId(sessionId);
  };

  if (selectedSessionId) {
    const session = sessions.find((s: any) => s.id === selectedSessionId) as any;
    return (
      <div style={{ padding: '32px', fontFamily: "'DM Sans', sans-serif" }}>
        <button
          onClick={() => setSelectedSessionId(null)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'none', border: 'none', color: C.blue,
            cursor: 'pointer', fontSize: 14, fontWeight: 600,
            marginBottom: 24, fontFamily: "'DM Sans', sans-serif", padding: 0,
          }}
        >
          <ArrowLeft size={16} /> Back to History
        </button>
        <ValidationResults sessionName={session?.name ?? 'Validation Results'} />
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        .qa-table-row { transition: background 0.15s; }
        .qa-table-row:hover { background: ${C.blueLight} !important; }
        .qa-history-input {
          background: #ffffff;
          border: 1.5px solid rgba(10,22,40,0.15);
          color: ${C.navy};
          padding: 9px 14px 9px 36px;
          border-radius: 8px;
          outline: none;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.2s;
          width: 220px;
        }
        .qa-history-input:focus { border-color: ${C.blue}; box-shadow: 0 0 0 3px rgba(37,99,235,0.08); }
        .qa-history-input::placeholder { color: ${C.textSub}; }
        .qa-select-light {
          background: #ffffff;
          border: 1.5px solid rgba(10,22,40,0.15);
          color: ${C.navy};
          padding: 9px 14px;
          border-radius: 8px;
          outline: none;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
        }
        .qa-action-btn {
          padding: 5px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
          font-family: 'DM Sans', sans-serif;
          border: 1px solid rgba(37,99,235,0.25);
          background: transparent;
          color: ${C.blue};
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .qa-action-btn:hover { background: ${C.blueLight}; }
      `}</style>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.textSub }} />
          <input
            className="qa-history-input"
            placeholder="Search sessions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="qa-select-light" value={severity} onChange={(e) => setSeverity(e.target.value)}>
          {SEVERITY_FILTER_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, overflow: 'hidden', boxShadow: '0 2px 8px rgba(10,22,40,0.05)' }}>
        <div style={{ overflowX: 'auto' }}>
          {isLoading ? (
            <div style={{ padding: 40, textAlign: 'center', color: C.textMuted }}>Loading historical sessions...</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  {['#', 'Session Name', 'Date', 'Security Index', 'Violations', 'Status', 'Actions'].map((h) => (
                    <th key={h} style={{ padding: '12px 20px', textAlign: 'left', color: C.textSub, fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', whiteSpace: 'nowrap', background: '#f8faff' }}>
                      {h.toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s: any, i: number) => (
                  <tr key={s.id} className="qa-table-row" style={{ borderBottom: `1px solid rgba(10,22,40,0.06)` }}>
                    <td style={{ padding: '13px 20px', color: C.textSub, fontSize: 13 }}>{String(i + 1).padStart(2, '0')}</td>
                    <td style={{ padding: '13px 20px', color: C.navy, fontSize: 14, fontWeight: 500 }}>{s.name}</td>
                    <td style={{ padding: '13px 20px', color: C.textSub, fontSize: 13, whiteSpace: 'nowrap' }}>{new Date(s.date).toLocaleDateString()}</td>
                    <td style={{ padding: '13px 20px' }}>
                      <span style={{
                        display: 'inline-block', padding: '3px 10px', borderRadius: 12,
                        background: `${getScoreColor(s.score)}18`,
                        color: getScoreColor(s.score),
                        fontSize: 13, fontWeight: 700, fontFamily: "'Syne', sans-serif",
                      }}>
                        {Math.round(s.score)}
                      </span>
                    </td>
                    <td style={{ padding: '13px 20px', color: (s.violations_count || 0) > 20 ? '#dc2626' : (s.violations_count || 0) > 10 ? '#d97706' : '#16a34a', fontSize: 13, fontWeight: 600 }}>
                      {s.violations_count || 0}
                    </td>
                    <td style={{ padding: '13px 20px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        padding: '3px 10px', borderRadius: 12,
                        background: s.status === 'COMPLETE' ? 'rgba(22,163,74,0.1)' : 'rgba(217,119,6,0.1)',
                        color: s.status === 'COMPLETE' ? '#16a34a' : '#d97706',
                        fontSize: 11, fontWeight: 600,
                      }}>
                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: s.status === 'COMPLETE' ? '#16a34a' : '#d97706' }} />
                        {s.status}
                      </span>
                    </td>
                    <td style={{ padding: '13px 20px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="qa-action-btn" onClick={() => handleViewResults(s.id)}><Eye size={11} />View Results</button>
                        <button className="qa-action-btn" onClick={() => window.open(`${import.meta.env.VITE_API_URL}/api/reports/${s.report_id}/download`, '_blank')}><Download size={11} />PDF</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: C.textMuted }}>No validation history found.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <div style={{ padding: '16px 20px', borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8faff' }}>
          <span style={{ color: C.textSub, fontSize: 12 }}>Showing {filtered.length} sessions</span>
        </div>
      </div>
    </div>
  );
}
