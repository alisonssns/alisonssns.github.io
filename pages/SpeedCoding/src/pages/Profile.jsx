import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Profile.module.css";
import { useAuth } from "../contexts/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [stats, setStats] = useState({ avg_wpm: 0, best_wpm: 0 });
  const [recentHistory, setRecentHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      if (!user?.id) return;
      
      try {
        const [userRes, statsRes, historyRes] = await Promise.all([
            axios.get(`http://localhost:3000/usuario/${user.id}`),
            axios.get(`http://localhost:3000/usuario/${user.id}/stats`),
            axios.get(`http://localhost:3000/partidas/usuario/${user.id}`)
        ]);

        setProfileData(userRes.data);
        setStats(statsRes.data);
        setRecentHistory(historyRes.data.slice(0, 5));

      } catch (err) {
        console.error("Erro ao carregar perfil:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [user]);

  if (loading) return <div className={styles.loading}>Carregando...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.profileHeader}>
        <div className={styles.avatarCircle}>{profileData?.nome ? profileData.nome.charAt(0).toUpperCase() : 'U'}</div>
        <div className={styles.userInfo}>
          <h1 className={styles.userName}>{profileData?.nome || user.nome}</h1>
          <p className={styles.userEmail}>{profileData?.email || user.email}</p>
          <span className={styles.memberSince}>
            Membro desde: {profileData?.data_criacao ? new Date(profileData.data_criacao).toLocaleDateString() : 'N/A'}
          </span>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.blue}`}>
          <div className={styles.statLabel}>Velocidade Média</div>
          <div className={styles.statValue}>{Math.round(stats.avg_wpm || 0)}</div>
          <div className={styles.statLabel}>WPM</div>
        </div>
        <div className={`${styles.statCard} ${styles.purple}`}>
          <div className={styles.statLabel}>Recorde Pessoal</div>
          <div className={styles.statValue}>{Math.round(stats.best_wpm || 0)}</div>
          <div className={styles.statLabel}>WPM</div>
        </div>
      </div>

      <h2 className={styles.sectionTitle}>Atividade Recente</h2>
      <div className={styles.historyList}>
        {recentHistory.length === 0 ? (
           <div style={{padding: '2rem', textAlign: 'center', color: '#666'}}>Sem atividades recentes.</div>
        ) : (
            recentHistory.map((h) => (
              <div key={h.id} className={styles.historyItem}>
                <div className={styles.gameInfo}>
                  <span className={styles.gameName}>{h.jogo} ({h.tipo || 'CODE'})</span>
                  <span className={styles.gameDate}>{new Date(h.data).toLocaleDateString()}</span>
                </div>
                <div className={styles.gameScore}>
                  <div className={styles.scoreMain}>{h.wpm} WPM</div>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}