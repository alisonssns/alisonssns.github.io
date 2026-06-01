import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from "../ui/Input";
import Button from "../ui/Button";
import styles from "./forms.module.css";
import { useAuth } from "../../contexts/AuthContext";

export default function Form() {
  const [isLoginView, setIsLoginView] = useState(true);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  }

async function handleSubmit(e) {
  e.preventDefault();
  setError("");

  if (isLoginView) {
    const result = await login(formData.email, formData.password);

    if (result.success) {
        navigate("/arena"); 
    } else {
        setError(result.message); 
    }
  } else {

  if (formData.password !== formData.confirmPassword) {
    return setError("As senhas não coincidem!");
  }

  const result = await register(formData.username, formData.email, formData.password);
  
  if (result.success) {
      alert("Conta criada com sucesso! Faça login agora.");
      setIsLoginView(true);
    
      setFormData(prev => ({...prev, password: '', confirmPassword: ''}));
  } else {
      setError(result.message);
  }
}
}
  return (
    <form onSubmit={handleSubmit} className={styles.authBox}>
      
      <div className={styles.tabContainer}>
        <button
          type="button"
          className={styles.tabButton}
          style={{ color: !isLoginView ? 'var(--text-main)' : 'var(--text-muted)' }}
          onClick={() => setIsLoginView(false)}
        >
          Criar conta
        </button>
        <button
          type="button"
          className={styles.tabButton}
          style={{ color: isLoginView ? 'var(--text-main)' : 'var(--text-muted)' }}
          onClick={() => setIsLoginView(true)}
        >
          Entrar
        </button>
      </div>

      <h2 className={styles.title}>
        {isLoginView ? "Acessar Sistema" : "Novo Agente"}
      </h2>

      {error && <div style={{color: 'var(--error)', marginBottom: '1rem', fontSize:'0.9rem'}}>{error}</div>}

      <div className={styles.inputs}>
        {!isLoginView && (
          <Input
            placeholder="Nome de usuário"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        )}

        <Input
          placeholder="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />

        <Input
          placeholder="Senha"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
        />

        {!isLoginView && (
          <Input
            placeholder="Confirmar Senha"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        )}
      </div>

      <Button type="submit" variant="primary" className={styles.registerButton}>
        {isLoginView ? "ENTRAR" : "REGISTRAR"}
      </Button>
    </form>
  );
}