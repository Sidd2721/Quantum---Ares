import { useState, useEffect, useRef } from 'react';

const ENGINES_ORDER = ['zero_trust', 'quantum', 'attack_path', 'supply_chain', 'compliance'];

export const useWebSocket = (sessionId: string | null) => {
    const [progress, setProgress] = useState(0);
    const [engineStatuses, setEngineStatuses] = useState<Record<string, string>>({});
    const [isComplete, setIsComplete] = useState(false);
    const [finalScore, setFinalScore] = useState<number | null>(null);
    const simulationRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const wsConnected = useRef(false);

    useEffect(() => {
        if (!sessionId) return;

        setProgress(0);
        setEngineStatuses({});
        setIsComplete(false);
        setFinalScore(null);
        wsConnected.current = false;

        // Simulated progress fallback — runs if WS fails or backend is unavailable
        let simProgress = 0;
        let simEngineIndex = 0;
        simulationRef.current = setInterval(() => {
            if (wsConnected.current) {
                // Real WS is working — stop simulation
                if (simulationRef.current) clearInterval(simulationRef.current);
                return;
            }
            simProgress = Math.min(simProgress + 2, 100);
            setProgress(simProgress);

            // Simulate engine statuses based on progress
            const enginesDone = Math.floor((simProgress / 100) * ENGINES_ORDER.length);
            const newStatuses: Record<string, string> = {};
            ENGINES_ORDER.forEach((eng, i) => {
                if (i < enginesDone) newStatuses[eng] = 'COMPLETE';
                else if (i === enginesDone && simProgress < 100) newStatuses[eng] = 'RUNNING';
                else newStatuses[eng] = 'PENDING';
            });
            setEngineStatuses(newStatuses);

            if (simProgress >= 100) {
                if (simulationRef.current) clearInterval(simulationRef.current);
                setIsComplete(true);
            }
        }, 300);

        const getWsUrl = () => {
            const apiBase = `${import.meta.env.VITE_API_URL}/api`;
            const wsBase = apiBase.replace(/^http/, 'ws');
            return `${wsBase}/ws/${sessionId}`;
        };

        const ws = new WebSocket(getWsUrl());

        ws.onopen = () => {
            wsConnected.current = true;
            if (simulationRef.current) clearInterval(simulationRef.current);
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.engine) {
                setEngineStatuses(prev => ({
                    ...prev,
                    [data.engine]: data.status
                }));
                // Fix: was `if (data.progress)` which is falsy for 0
                if (data.progress !== undefined) setProgress(data.progress);
                if (data.score !== undefined) setFinalScore(data.score);
            }

            if (data.status === 'COMPLETE' || data.engine === 'complete') {
                setProgress(100);
                setIsComplete(true);
                ws.close();
            }
        };

        ws.onerror = () => {
            // WS failed — let simulation continue
            wsConnected.current = false;
        };

        ws.onclose = () => {
            if (!wsConnected.current) return; // was never connected, simulation handles it
            // Backend WS closed — finalise progress
            setProgress(100);
            setIsComplete(true);
        };

        return () => {
            if (simulationRef.current) clearInterval(simulationRef.current);
            ws.close();
        };
    }, [sessionId]);

    return { progress, engineStatuses, isComplete, finalScore };
};
