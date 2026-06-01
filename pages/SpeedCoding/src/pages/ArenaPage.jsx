import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from "axios"; 
import CodingBox from "../components/game/CodingBox";
import StatDisplay from "../components/game/StatDisplay";
import styles from "./ArenaPage.module.css";
import { useAuth } from "../contexts/AuthContext";

export default function ArenaPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { gameId, gameName } = location.state || {};

    const [allCodes, setAllCodes] = useState([]);
    const [snippet, setSnippet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedLang, setSelectedLang] = useState('py');
    const [stats, setStats] = useState({ wpm: 0, time: "0.0" });
    
    const hasSavedRef = useRef(false);

    useEffect(() => {
        if (!gameId) { navigate('/games'); return; }
        async function fetchCodes() {
            try {
                const res = await axios.get(`http://localhost:3000/codigo/jogo/${gameId}`);
                setAllCodes(res.data);
            } catch (err) { console.error(err); } 
            finally { setLoading(false); }
        }
        fetchCodes();
    }, [gameId, navigate]);

    useEffect(() => {
        if (allCodes.length > 0) {
            const codeForLang = allCodes.find(c => c.tipo === selectedLang);
            setSnippet(codeForLang || null);
            setStats({ wpm: 0, time: "0.0" });
            hasSavedRef.current = false; 
        }
    }, [selectedLang, allCodes]);

    const handleFinish = async (finalStats) => {
        if (hasSavedRef.current) return;
        hasSavedRef.current = true;

        try {
            await axios.post("http://localhost:3000/partidas", {
                usuario_id: user.id,
                codigo_id: snippet.id,
                wpm: finalStats.wpm,
                tempo_total: finalStats.time
            });
            
            setTimeout(() => navigate('/history'), 500);

        } catch (err) {
            console.error("Erro ao salvar:", err);
            hasSavedRef.current = false;
        }
    };

    const handleStatsUpdate = (newStats, finished) => {
        setStats(newStats);
        if (finished) handleFinish(newStats);
    };

    if (loading) return <div className={styles.loadingScreen}>Carregando...</div>;

    return (
        <main className={styles.arenaContainer}>
            <div className={styles.arenaHeader}>
                <button onClick={() => navigate('/games')} className={styles.backButton}>← Sair</button>
                <div className={styles.headerInfo}>
                    <h2 className={styles.gameTitle}>{gameName}</h2>
                    <div className={styles.langSelector}>
                        {['py', 'cpp', 'java'].map(lang => (
                            <button 
                                key={lang}
                                className={`${styles.langBtn} ${selectedLang === lang ? styles.activeLang : ''}`}
                                onClick={() => setSelectedLang(lang)}
                            >
                                {lang === 'py' ? 'Python' : lang === 'cpp' ? 'C++' : 'Java'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className={styles.statsPanel}>
                <div className={styles.statsRow}>
                    <StatDisplay icon="⚡" label="WPM" value={stats.wpm} />
                    <StatDisplay icon="⏱️" label="Tempo" value={stats.time} unit="s" />
                </div>
            </div>

            <div className={styles.gameArea}>
                <div className={styles.codingCard}>
                    {snippet ? (
                        <CodingBox key={snippet.id} word={snippet.text} onStatsUpdate={handleStatsUpdate} />
                    ) : (
                        <div style={{padding: '2rem', textAlign: 'center', color: '#888'}}>
                            Sem código para esta linguagem.
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}