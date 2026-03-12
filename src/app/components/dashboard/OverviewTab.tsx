import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { TrendingUp, AlertTriangle, AlertOctagon, Clock, Eye, Download } from 'lucide-react';
import { useSessions } from '../../hooks/useSessions';
import { useGraphContext } from '../../hooks/useGraphContext';

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

export function OverviewTab() {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const { sessions, isLoading } = useSessions();
  const { loadSession } = useGraphContext();

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const recentSessions = sessions.slice(0, 3);

  // Use data from the most recent session for stat cards if available
  const latest: any = sessions[0] || { score: 0, violations_count: 0, status: 'N/A', date: 'N/A' };

  const STAT_CARDS = [
    { label: 'Current Score', value: Math.round(latest.score || 0).toString(), unit: '/100', color: getScoreColor(latest.score || 0), glow: 'rgba(22,163,74,0.12)', icon: TrendingUp, sub: 'Security Index' },
    { label: 'Needs Attention', value: (latest.violations_count || 0).toString(), unit: '', color: '#d97706', glow: 'rgba(217,119,6,0.12)', icon: AlertTriangle, sub: 'Active Violations' },
    { label: 'Immediate Action', value: '0', unit: '', color: '#dc2626', glow: 'rgba(220,38,38,0.12)', icon: AlertOctagon, sub: 'Critical Issues' }, // Backend would provide breakdown
    { label: 'Time Since Scan', value: latest.date !== 'N/A' ? 'Recently' : 'Never', unit: '', color: C.blue, glow: 'rgba(37,99,235,0.10)', icon: Clock, sub: 'Last Validated' },
  ];

  const handleViewSession = async (id: string) => {
    await loadSession(id);
    navigate('/dashboard/upload'); // Assuming upload tab shows current results
  };

  return (
    <div style={{ padding: '32px', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @keyframes stat-fade {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .stat-card-anim { animation: stat-fade 0.5s ease forwards; }
        .qa-table-row { transition: background 0.15s; }
        .qa-table-row:hover { background: ${C.blueLight} !important; }
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
        .qa-action-btn:active { transform: scale(0.97); }
      `}</style>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 36 }}>
        {STAT_CARDS.map((card, i) => (
          <div
            key={card.label}
            className={visible ? 'stat-card-anim' : ''}
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 12, padding: '24px',
              animationDelay: `${i * 0.1}s`,
              opacity: visible ? undefined : 0,
              boxShadow: `0 2px 12px ${card.glow}`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ color: C.textSub, fontSize: 12, fontWeight: 600, letterSpacing: '0.08em' }}>
                {card.sub.toUpperCase()}
              </div>
              <div style={{ width: 34, height: 34, background: card.glow, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <card.icon size={16} color={card.color} />
              </div>
            </div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 42, fontWeight: 800, color: card.color, lineHeight: 1 }}>
              {card.value}<span style={{ fontSize: 18, fontWeight: 400, color: C.textSub }}>{card.unit}</span>
            </div>
            <div style={{ color: C.textMuted, fontSize: 13, marginTop: 6 }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Sessions */}
      <div style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, overflow: 'hidden', marginBottom: 24, boxShadow: '0 2px 8px rgba(10,22,40,0.05)' }}>
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: C.navy, fontSize: 16 }}>Recent Sessions</div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          {isLoading ? (
            <div style={{ padding: 40, textAlign: 'center', color: C.textMuted }}>Loading sessions...</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  {['Name', 'Date', 'Score', 'Status', 'Actions'].map((h) => (
                    <th key={h} style={{ padding: '12px 24px', textAlign: 'left', color: C.textSub, fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', background: '#f8faff' }}>
                      {h.toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentSessions.map((s: any) => (
                  <tr key={s.id} className="qa-table-row">
                    <td style={{ padding: '14px 24px', color: C.navy, fontSize: 14, fontWeight: 500 }}>{s.name}</td>
                    <td style={{ padding: '14px 24px', color: C.textSub, fontSize: 13 }}>{new Date(s.date).toLocaleDateString()}</td>
                    <td style={{ padding: '14px 24px' }}>
                      <span style={{
                        display: 'inline-block', padding: '3px 10px', borderRadius: 12,
                        background: `${getScoreColor(s.score)}18`,
                        color: getScoreColor(s.score),
                        fontSize: 13, fontWeight: 700, fontFamily: "'Syne', sans-serif",
                      }}>
                        {Math.round(s.score)}
                      </span>
                    </td>
                    <td style={{ padding: '14px 24px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '3px 10px', borderRadius: 12,
                        background: s.status === 'COMPLETE' ? 'rgba(22,163,74,0.1)' : 'rgba(217,119,6,0.1)',
                        color: s.status === 'COMPLETE' ? '#16a34a' : '#d97706',
                        fontSize: 12, fontWeight: 600,
                      }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: s.status === 'COMPLETE' ? '#16a34a' : '#d97706' }} />
                        {s.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 24px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="qa-action-btn" onClick={() => handleViewSession(s.id)}><Eye size={12} />View</button>
                        <button className="qa-action-btn" onClick={() => window.open(`${import.meta.env.VITE_API_URL}/api/reports/${s.report_id}/download`, '_blank')}><Download size={12} />PDF</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {recentSessions.length === 0 && (
                  <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: C.textMuted }}>No validation sessions found.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display: 'flex', gap: 16 }}>
        <button
          onClick={() => navigate('/dashboard/upload')}
          style={{
            padding: '12px 24px', borderRadius: 8, background: C.navy,
            color: '#ffffff', border: 'none', fontWeight: 700,
            fontFamily: "'Syne', sans-serif", fontSize: 14,
            cursor: 'pointer', transition: 'all 0.2s',
            boxShadow: '0 4px 12px rgba(10,22,40,0.2)',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#1a3560')}
          onMouseLeave={e => (e.currentTarget.style.background = C.navy)}
        >
          Upload New File →
        </button>
        <button
          onClick={() => navigate('/dashboard/history')}
          style={{
            padding: '12px 24px', borderRadius: 8, background: 'transparent',
            color: C.blue, border: `1.5px solid ${C.blue}`, fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif", fontSize: 14,
            cursor: 'pointer', transition: 'all 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = C.blueLight)}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          View Full History →
        </button>
      </div>
    </div>
  );
}
