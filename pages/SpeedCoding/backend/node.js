import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "speedcoding",
});

app.post("/usuario", async (req, res) => {
    const { nome, email, senha } = req.body;
    try {
        const [result] = await db.query(
            "INSERT INTO usuario (nome, email, senha, data_criacao) VALUES (?, ?, ?, NOW())",
            [nome, email, senha]
        );
        res.json({ id: result.insertId, nome, email });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/usuario", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT id, nome, email, data_criacao FROM usuario");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/usuario/:id", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT id, nome, email, data_criacao FROM usuario WHERE id = ?", [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: "Usuário não encontrado" });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/usuario/:id/stats", async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT 
                COALESCE(AVG(wpm), 0) as avg_wpm, 
                COALESCE(MAX(wpm), 0) as best_wpm 
             FROM partidas 
             WHERE usuario_id = ?`,
            [req.params.id]
        );
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/login", async (req, res) => {
    const { email, senha } = req.body;
    try {
        const [user] = await db.query("SELECT * FROM usuario WHERE email = ? AND senha = ?", [email, senha]);
        if (user.length === 0) return res.status(401).json({ error: "Credenciais inválidas" });
        const { senha: _, ...userSemSenha } = user[0];
        res.json({ message: "Login realizado", user: userSemSenha });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/jogos", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT j.*, GROUP_CONCAT(c.tipo) as languages
            FROM jogos j
            LEFT JOIN codigo c ON j.id = c.jogo_id
            GROUP BY j.id
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.post("/jogos", async (req, res) => {
    const { nome, descricao } = req.body;
    try {
        const [result] = await db.query(
            "INSERT INTO jogos (nome, descricao) VALUES (?, ?)",
            [nome, descricao]
        );
        res.json({ id: result.insertId, nome, descricao });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/codigo/jogo/:id", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM codigo WHERE jogo_id = ?", [req.params.id]);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post("/codigo", async (req, res) => {
    const { jogo_id, text, tipo } = req.body; 
    try {
        const [result] = await db.query(
            "INSERT INTO codigo (jogo_id, text, tipo) VALUES (?, ?, ?)",
            [jogo_id, text, tipo]
        );
        res.json({ id: result.insertId, jogo_id, text, tipo });
    } catch (err) {
        console.error("Erro ao salvar código:", err);
        res.status(500).json({ error: err.message });
    }
});

app.post("/partidas", async (req, res) => {
    const { usuario_id, codigo_id, wpm, tempo_total } = req.body;
    try {
        const [result] = await db.query(
            `INSERT INTO partidas (usuario_id, codigo_id, wpm, tempo_total, data) 
             VALUES (?, ?, ?, ?, NOW())`,
            [usuario_id, codigo_id, wpm, tempo_total]
        );
        res.json({ id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/partidas/usuario/:id", async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT p.*, j.nome AS jogo, c.tipo
             FROM partidas p
             JOIN codigo c ON p.codigo_id = c.id
             JOIN jogos j ON c.jogo_id = j.id
             WHERE p.usuario_id = ?
             ORDER BY p.data DESC`,
            [req.params.id]
        );
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get("/ranking", async (req, res) => {
    const { gameId, lang } = req.query;

    let whereClauses = [];
    let queryValues = [];

    if (gameId && gameId !== 'null' && gameId !== '') {
        whereClauses.push("j.id = ?");
        queryValues.push(gameId);
    }

    if (lang && lang !== 'null' && lang !== 'all') {
        whereClauses.push("c.tipo = ?");
        queryValues.push(lang);
    }

    const whereCondition = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const sqlQuery = `
        SELECT 
            u.id as usuario_id,
            p.id AS partida_id, 
            u.nome AS usuario_nome, 
            p.wpm, 
            p.data, 
            p.tempo_total,
            j.nome AS jogo_nome,
            c.tipo as linguagem
        FROM partidas p
        JOIN usuario u ON u.id = p.usuario_id
        JOIN codigo c ON p.codigo_id = c.id
        JOIN jogos j ON c.jogo_id = j.id 
        ${whereCondition}
        ORDER BY p.wpm DESC
    `;

    try {
        const [rows] = await db.query(sqlQuery, queryValues);
        res.json(rows);
    } catch (err) {
        console.error("Erro Ranking:", err);
        res.status(500).json({ error: "Erro ao consultar ranking." });
    }
});

app.listen(3000, () => {
    console.log("API rodando em http://localhost:3000");
});