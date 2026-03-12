import { useState } from 'react';
import { Download } from 'lucide-react';
import { GraphView } from './GraphView';
import { ThreeDGraph } from './ThreeDGraph';
import { ScoreDashboard } from './ScoreDashboard';
import { ViolationPanel } from './ViolationPanel';
import { QuantumPanel } from './QuantumPanel';
import { ChatInterface } from './ChatInterface';
import { useGraphContext } from '../../hooks/useGraphContext';

const INNER_TABS = [
  { id: 'graph3d', label: '⬡ 3D Graph' },
  { id: 'graph', label: 'Graph' },
  { id: 'score', label: 'Score' },
  { id: 'violations', label: 'Violations' },
  { id: 'quantum', label: 'Quantum Risk' },
  { id: 'chat', label: 'AI Chat' },
];

const C = {
  navy: 'var(--c-primary)',
  blue: 'var(--c-accent)',
  blueLight: 'var(--c-accent-light)',
  card: 'var(--c-bg-card)',
  border: 'var(--c-border)',
  textSub: 'var(--c-text-sub)',
};

interface ValidationResultsProps { sessionName?: string; }

export function ValidationResults({ sessionName: propName }: ValidationResultsProps) {
  const [activeTab, setActiveTab] = useState('graph3d');
  const { sessionName, sessionId, scores, nodes, violations, metadata } = useGraphContext();

  const totalScore = Math.round(scores.zeroTrust * 0.35 + (100 - scores.quantumVuln) * 0.2 + scores.attackPath * 0.25 + scores.supplyChain * 0.1 + scores.compliance * 0.1);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header bar */}
      <div style={{
        background: C.card,
        borderRadius: 12,
        border: `1px solid ${C.border}`,
        boxShadow: '0 2px 8px rgba(10,22,40,0.06)',
        padding: '24px',
        marginBottom: 4,
        display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap',
      }}>
        {/* Score ring */}
        <div style={{ position: 'relative', width: 72, height: 72, flexShrink: 0 }}>
          <svg width={72} height={72} style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
            <circle cx="36" cy="36" r="28" fill="none" stroke="rgba(37,99,235,0.12)" strokeWidth={8} />
            <circle cx="36" cy="36" r="28" fill="none" stroke={C.blue} strokeWidth={8}
              strokeDasharray={`${(totalScore / 100) * 175.9} 175.9`} strokeLinecap="round" />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: C.blue, lineHeight: 1 }}>{totalScore}</span>
            <span style={{ color: C.textSub, fontSize: 9 }}>/100</span>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: C.navy, marginBottom: 4 }}>
            {sessionName || propName}
          </div>
          <div style={{ color: C.textSub, fontSize: 13 }}>
            Entities: {nodes.length} · Critical Faults: {violations.length} · ID: {sessionId || 'NEW'}
          </div>
        </div>

        <button
          onClick={() => window.open(`${import.meta.env.VITE_API_URL}/api/reports/${metadata.report_id}/download`, '_blank')}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 18px', borderRadius: 8,
            background: C.navy, color: '#ffffff',
            border: 'none', cursor: 'pointer',
            fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700,
            transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(10,22,40,0.2)',
          }}
          disabled={!metadata.report_id}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#1a3560')}
          onMouseLeave={(e) => (e.currentTarget.style.background = C.navy)}
        >
          <Download size={14} /> Download Report
        </button>
      </div>

      {/* Tab bar */}
      <div style={{
        display: 'flex', gap: 0, marginBottom: 20,
        background: C.card,
        borderRadius: 10,
        border: `1px solid ${C.border}`,
        padding: 4, overflowX: 'auto',
        boxShadow: '0 1px 4px rgba(10,22,40,0.04)',
      }}>
        {INNER_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1, minWidth: 'max-content',
              padding: '9px 18px', borderRadius: 8, border: 'none',
              cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
              background: activeTab === tab.id ? C.blueLight : 'transparent',
              color: activeTab === tab.id ? C.blue : C.textSub,
              borderBottom: activeTab === tab.id ? `2px solid ${C.blue}` : '2px solid transparent',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'graph3d' && <ThreeDGraph />}
        {activeTab === 'graph' && <GraphView />}
        {activeTab === 'score' && <ScoreDashboard />}
        {activeTab === 'violations' && <ViolationPanel />}
        {activeTab === 'quantum' && <QuantumPanel />}
        {activeTab === 'chat' && <ChatInterface sessionId={sessionId || ''} />}
      </div>
    </div>
  );
}
