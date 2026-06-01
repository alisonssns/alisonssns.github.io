import { useEffect, useState, useRef } from "react";
import axios from "axios";
import styles from "./Ranking.module.css";
import { useAuth } from "../contexts/AuthContext";

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit', month: '2-digit', hour: '2-digit', minute:'2-digit'
    });
};

export default function Ranking() {
    const [ranking, setRanking] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterOptions, setFilterOptions] = useState([]);
    
    const [selectedGameId, setSelectedGameId] = useState(null); 
    const [selectedLang, setSelectedLang] = useState('all');

    const { user } = useAuth(); 
    const userRowRef = useRef(null); 

    useEffect(() => {
        async function fetchGames() {
            try {
                const res = await axios.get(`http://localhost:3000/jogos`); 
                setFilterOptions([{ id: null, nome: "Todos os Jogos" }, ...res.data]); 
            } catch (err) { console.error(err); }
        }
        fetchGames();
    }, []);

    useEffect(() => {
        async function fetchRanking() {
            setLoading(true);
            try {
                const params = { };
                if (selectedGameId) params.gameId = selectedGameId;
                if (selectedLang !== 'all') params.lang = selectedLang;

                const res = await axios.get(`http://localhost:3000/ranking`, { params });
                
                const fullRanking = res.data.map((item, index) => ({
                    ...item,
                    realRank: index + 1
                }));

                const top50 = fullRanking.slice(0, 50);
                let finalDisplay = [...top50];

                if (user?.id) {
                    const amIInTop50 = top50.some(p => p.usuario_id === user.id);
                    if (!amIInTop50) {
                        const myRankRow = fullRanking.find(p => p.usuario_id === user.id);
                        if (myRankRow) {
                            finalDisplay.push(myRankRow);
                        }
                    }
                }

                setRanking(finalDisplay); 
                
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchRanking();
    }, [selectedGameId, selectedLang, user]);

    useEffect(() => {
        if (!loading && userRowRef.current) {
            userRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [ranking, loading]);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Ranking Global (WPM)</h1>

            <div className={styles.filterGroup}>
                <div className={styles.filterBox}>
                    <label>Jogo:</label>
                    <select
                        className={styles.select}
                        value={selectedGameId || ''} 
                        onChange={(e) => setSelectedGameId(e.target.value === '' ? null : e.target.value)}
                    >
                        {filterOptions.map(g => (
                            <option key={g.id || 'global'} value={g.id || ''}>{g.nome}</option>
                        ))}
                    </select>
                </div>

                <div className={styles.filterBox}>
                    <label>Linguagem:</label>
                    <select
                        className={styles.select}
                        value={selectedLang} 
                        onChange={(e) => setSelectedLang(e.target.value)}
                    >
                        <option value="all">Todas</option>
                        <option value="py">Python</option>
                        <option value="cpp">C++</option>
                        <option value="java">Java</option>
                    </select>
                </div>
            </div>

            {loading ? <p className={styles.loading}>Carregando...</p> : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Usuário</th>
                                <th>Linguagem</th>
                                <th>Tempo</th>
                                <th>WPM</th>
                                <th>Data</th>
                                <th>Jogo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ranking.length === 0 ? (
                                <tr><td colSpan="7" className={styles.empty}>Nenhum ranking encontrado para estes filtros.</td></tr>
                            ) : (
                                ranking.map((p) => {
                                    const isMe = user && p.usuario_id === user.id;
                                    return (
                                        <tr 
                                            key={p.partida_id} 
                                            className={isMe ? styles.highlightMe : ''}
                                            ref={isMe ? userRowRef : null}
                                        >
                                            <td className={styles.rankCol}>{p.realRank}</td>
                                            <td className={styles.userCol}>{p.usuario_nome}{isMe && " (Você)"}</td>

                                            <td>
                                                <span style={{
                                                    background: '#222', padding: '2px 6px', borderRadius: '4px',
                                                    fontSize: '0.8rem', color: '#888', border: '1px solid #333'
                                                }}>
                                                    {p.linguagem ? p.linguagem.toUpperCase() : 'CODE'}
                                                </span>
                                            </td>

                                            <td style={{color: '#aaa', fontFamily: 'monospace'}}>
                                                {p.tempo_total}s
                                            </td>

                                            <td style={{fontWeight: 'bold', fontSize: '1.1rem'}}>{p.wpm.toFixed(0)}</td>
                                        
                                            <td style={{fontSize: '0.8rem', opacity: 0.8}}>{formatDate(p.data)}</td>
                                            <td className={styles.gameCol}>{p.jogo_nome}</td> 
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}