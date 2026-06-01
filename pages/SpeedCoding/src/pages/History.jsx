import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./History.module.css";
import { useAuth } from "../contexts/AuthContext";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); 

  useEffect(() => {
    async function fetchHistory() {
      if (!user?.id) return;
      try {
        const res = await axios.get(`http://localhost:3000/partidas/usuario/${user.id}`);
        setHistory(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, [user]);

  if (loading) return <div className={styles.loading}>Carregando...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Meu Histórico</h1>
      {history.length === 0 ? (
          <div style={{textAlign: 'center', padding: '3rem', color: '#888', background: 'rgba(0,0,0,0.2)', borderRadius: '12px'}}>
            <p>Nenhuma partida registrada.</p>
          </div>
      ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Jogo</th>
                <th>Linguagem</th>
                <th>Tempo</th>
                <th>WPM</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id}>
                  <td className={styles.gameTitle}>{item.jogo}</td>
                  <td><span className={styles.langBadge}>{item.tipo || 'CODE'}</span></td>
                  <td className={styles.statValue}>{item.tempo_total}s</td>
                  <td className={styles.wpmValue}>{item.wpm}</td>
                  <td className={styles.dateValue}>{new Date(item.data).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
      )}
    </div>
  );
}