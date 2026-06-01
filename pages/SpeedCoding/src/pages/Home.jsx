import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './Home.module.css';

export default function Home() {
    const { user } = useAuth();

    return (
        <div className={styles.dashboardContainer}>
            <header className={styles.welcomeHeader}>
                <h1>Olá, <span className={styles.highlight}>{user?.nome}</span>!</h1>
                <p>Bem-vindo ao quartel-general do Speed Coding.</p>
            </header>

            <section className={styles.card}>
                <h2>🚀 Como Funciona</h2>
                <ul className={styles.steps}>
                    <li>
                        <strong>1. Escolha uma Linguagem:</strong> Vá até a aba <Link to="/games">Jogos</Link>.
                    </li>
                    <li>
                        <strong>2. Digite o Código:</strong> Reproduza o código apresentado na tela com precisão.
                    </li>
                    <li>
                        <strong>3. Sem Erros:</strong> O sistema bloqueia erros de digitação (Modo Hardcore).
                    </li>
                    <li>
                        <strong>4. Suba no Ranking:</strong> Sua velocidade (WPM) define sua posição.
                    </li>
                </ul>
                <Link to="/games" className={styles.playButton}>COMEÇAR A JOGAR</Link>
            </section>
        </div>
    );
}