
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./Admin.module.css";

export default function Admin() {
    const [activeTab, setActiveTab] = useState("codes");
    const [games, setGames] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [newGame, setNewGame] = useState({ nome: "", descricao: "" });
    const [newCode, setNewCode] = useState({ jogo_id: "", tipo: "py", text: "" });

    useEffect(() => {
        async function loadData() {
            try {
                const [resGames, resUsers] = await Promise.all([
                    axios.get("http://localhost:3000/jogos"),
                    axios.get("http://localhost:3000/usuario")
                ]);
                setGames(resGames.data);
                setUsers(resUsers.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const availableGames = games.filter(g => {
        if (!g.languages) return true;
        const existing = g.languages.split(',');
        return !existing.includes(newCode.tipo);
    });

    useEffect(() => {
        if (availableGames.length > 0) {

            const isValid = availableGames.find(g => g.id == newCode.jogo_id);
            if (!isValid) {
                setNewCode(prev => ({ ...prev, jogo_id: availableGames[0].id }));
            }
        } else {
            setNewCode(prev => ({ ...prev, jogo_id: "" }));
        }
    }, [newCode.tipo, games]);

    async function handleCreateGame(e) {
        e.preventDefault();
        if (!newGame.nome) return alert("Preencha o nome!");
        try {
            await axios.post("http://localhost:3000/jogos", newGame);
            alert("Jogo criado!");
            window.location.reload();
        } catch (err) { alert("Erro ao criar jogo"); }
    }

    async function handleCreateCode(e) {
        e.preventDefault();
        if (!newCode.text || !newCode.jogo_id) return alert("Preencha o código e selecione o jogo!");
        try {
            await axios.post("http://localhost:3000/codigo", newCode);
            alert("Código adicionado!");

            window.location.reload();
        } catch (err) { alert("Erro: " + err.message); }
    }

    if (loading) return <div className={styles.loading}>Carregando Admin...</div>;

    return (
        <div className={styles.adminLayout}>

            <aside className={styles.sidebar}>
                <div className={styles.logoArea}>
                    <h2>ADMIN<span className={styles.dot}>.</span></h2>
                </div>

                <nav className={styles.navMenu}>
                    <button
                        className={`${styles.navBtn} ${activeTab === 'games' ? styles.active : ''}`}
                        onClick={() => setActiveTab('games')}
                    >
                        🎮 Gerenciar Jogos
                    </button>
                    <button
                        className={`${styles.navBtn} ${activeTab === 'codes' ? styles.active : ''}`}
                        onClick={() => setActiveTab('codes')}
                    >
                        💾 Inserir Códigos
                    </button>
                    <button
                        className={`${styles.navBtn} ${activeTab === 'users' ? styles.active : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        👥 Usuários
                    </button>
                </nav>

                <div className={styles.sidebarFooter}>
                    <button onClick={() => navigate('/home')} className={styles.exitBtn}>Voltar ao Site</button>
                </div>
            </aside>

            <main className={styles.mainContent}>
                {activeTab === 'games' && (
                    <div className={styles.panelSection}>
                        <h1 className={styles.pageTitle}>Jogos & Missões</h1>
                        <div className={styles.gridTwoCols}>
                            <div className={styles.card}>
                                <h3>Novo Jogo</h3>
                                <form onSubmit={handleCreateGame} className={styles.formStack}>
                                    <input
                                        placeholder="Nome"
                                        className={styles.input}
                                        value={newGame.nome}
                                        onChange={e => setNewGame({ ...newGame, nome: e.target.value })}
                                    />
                                    <textarea
                                        placeholder="Descrição"
                                        className={styles.textarea}
                                        value={newGame.descricao}
                                        onChange={e => setNewGame({ ...newGame, descricao: e.target.value })}
                                    />
                                    <button type="submit" className={styles.actionBtn}>CRIAR</button>
                                </form>
                            </div>
                            <div className={styles.listContainer}>
                                <h3>Jogos Ativos</h3>
                                <ul className={styles.itemList}>
                                    {games.map(g => (
                                        <li key={g.id}>
                                            <span>{g.nome}</span>
                                            <div style={{ fontSize: '0.7rem', color: '#666' }}>
                                                {g.languages ? g.languages.replace(/,/g, ' • ').toUpperCase() : 'SEM CÓDIGO'}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'codes' && (
                    <div className={styles.panelSection}>
                        <h1 className={styles.pageTitle}>Banco de Dados de Código</h1>
                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <h3>Adicionar Novo Snippet</h3>
                                <p>Selecione a linguagem para ver quais jogos ainda precisam de código.</p>
                            </div>

                            <form onSubmit={handleCreateCode} className={styles.formGrid}>

                                <div className={styles.formGroup}>
                                    <label>1. Escolha a Linguagem</label>
                                    <select
                                        className={styles.select}
                                        value={newCode.tipo}
                                        onChange={e => setNewCode({ ...newCode, tipo: e.target.value })}
                                    >
                                        <option value="py">Python (.py)</option>
                                        <option value="cpp">C++ (.cpp)</option>
                                        <option value="java">Java (.java)</option>
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>2. Selecione o Jogo (Filtrado)</label>
                                    <select
                                        className={styles.select}
                                        value={newCode.jogo_id}
                                        onChange={e => setNewCode({ ...newCode, jogo_id: e.target.value })}
                                        disabled={availableGames.length === 0}
                                    >
                                        {availableGames.length === 0 ? (
                                            <option>Todos os jogos já têm código em {newCode.tipo.toUpperCase()}!</option>
                                        ) : (
                                            availableGames.map(g => (
                                                <option key={g.id} value={g.id}>{g.nome}</option>
                                            ))
                                        )}
                                    </select>
                                </div>

                                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                    <label>3. Código Fonte</label>
                                    <textarea
                                        className={`${styles.textarea} ${styles.codeArea}`}
                                        placeholder={`Cole o código em ${newCode.tipo}...`}
                                        value={newCode.text}
                                        onChange={e => setNewCode({ ...newCode, text: e.target.value })}
                                        spellCheck="false"
                                    />
                                </div>

                                <div className={styles.fullWidth}>
                                    <button
                                        type="submit"
                                        className={styles.actionBtn}
                                        disabled={availableGames.length === 0}
                                        style={{ opacity: availableGames.length === 0 ? 0.5 : 1 }}
                                    >
                                        SALVAR SNIPPET
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className={styles.panelSection}>
                        <h1 className={styles.pageTitle}>Base de Usuários</h1>
                        <div className={styles.tableWrapper}>
                            <table className={styles.adminTable}>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nome</th>
                                        <th>Email</th>
                                        <th>Data Cadastro</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u.id}>
                                            <td>#{u.id}</td>
                                            <td style={{ fontWeight: 'bold', color: 'white' }}>{u.nome}</td>
                                            <td>{u.email}</td>
                                            <td>{new Date(u.data_criacao).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}