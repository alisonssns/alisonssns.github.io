import { Link } from 'react-router-dom';
import styles from './Landing.module.css';

export default function Landing() {
  return (
    <div className={styles.container}>
      <div className={styles.ambientLight}></div>

      <div className={styles.heroContent}>

        <h1 className={styles.title}>
          SPEED <span className={styles.highlight}>CODING</span>
        </h1>
        
        <p className={styles.subtitle}>
          A arena definitiva para desenvolvedores. Teste sua <strong>velocidade</strong>, 
          <strong>precisão</strong> e <strong>lógica</strong> em desafios reais de código.
        </p>

        <div className={styles.codeWindow}>
          <div className={styles.windowHeader}>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
          </div>
          <pre className={styles.codeBlock}>
            <code>
              <span className={styles.kwd}>function</span> <span className={styles.func}>initGame</span>() {'{'}{'\n'}
              &nbsp;&nbsp;<span className={styles.kwd}>return</span> <span className={styles.str}>"Are you ready?"</span>;{'\n'}
              {'}'}
            </code>
          </pre>
        </div>

        <div className={styles.actions}>
          <Link to="/login" className={`${styles.btn} ${styles.btnPrimary}`}>
            INICIAR DESAFIO
          </Link>
          <Link to="/login" className={`${styles.btn} ${styles.btnSecondary}`}>
            CRIAR CONTA
          </Link>
        </div>
        
        <footer className={styles.footer}>
          <p>Desenvolvido por <strong>Alisson Luis</strong></p>
          <span className={styles.divider}>|</span>
          <p>Projeto Final de Desenvolvimento Web</p>
        </footer>
      </div>
    </div>
  );
}