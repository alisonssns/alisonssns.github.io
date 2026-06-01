import Form from "../components/forms/Form";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        
        <div className={styles.infoSection}>
            <h1 className={styles.logoTitle}>SPEED <span className={styles.highlight}>CODING</span></h1>
            
            <div className={styles.welcomeText}>
                <p className={styles.lead}>
                    Bem-vindo à arena definitiva para desenvolvedores.
                </p>
                <p>
                    Eu sou <strong>Alisson Luis</strong>, e este projeto foi desenvolvido como parte do meu Trabalho Final da disciplina de <strong>Desenvolvimento Web.</strong>
                </p>
                <p>
                    Aqui, você vai poder <strong>testar sua velocidade e precisão</strong> digitando trechos de código reais em linguagens como <strong>C++, Java e Python.</strong>
                </p>
                <div className={styles.features}>
                    <div className={styles.featureItem}>🏆 Ranking Global</div>
                    <div className={styles.featureItem}>⚡ Modo Speed</div>
                    <div className={styles.featureItem}>🎯 Precisão Hardcore</div>
                </div>
            </div>
        </div>

        <div className={styles.formSection}>
            <Form />
        </div>

      </div>
    </div>
  );
}