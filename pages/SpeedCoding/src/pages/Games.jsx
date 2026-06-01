import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 
import styles from "./Games.module.css";

export default function Games() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadGames() {
      try {
        const res = await axios.get("http://localhost:3000/jogos");
        setGames(res.data);
      } catch (err) {
        console.error("Erro ao carregar jogos", err);
      } finally {
        setLoading(false);
      }
    }
    loadGames();
  }, []);

  const handlePlay = (game) => {
    navigate('/arena', { state: { gameId: game.id, gameName: game.nome } });
  };

  if (loading) return <div className={styles.loading}>Carregando missões...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Selecione seu Desafio</h1>
      <div className={styles.grid}>
        {games.map((game) => (
          <div key={game.id} className={styles.card}>
            <div className={styles.cardHeader}>
                <h2>{game.nome}</h2>
                <span className={styles.badge}>CODE</span>
            </div>
            <p className={styles.description}>{game.descricao}</p>
            <button className={styles.btn} onClick={() => handlePlay(game)}>
                INICIAR DESAFIO
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}