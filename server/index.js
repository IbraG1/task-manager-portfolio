const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const Task = require('./models/Task');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

// Configuración CORS
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://ibrag1.github.io" 
  ]
}));

app.use(express.json());

// --- MIDDLEWARE DE SEGURIDAD ---
const verifyToken = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) return res.status(401).json({ error: 'Acceso denegado. Falta el token.' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Guardamos el ID del usuario en la petición
        next();
    } catch (error) {
        res.status(400).json({ error: 'Token no válido' });
    }
};

// Conexión DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🔥 Conectado a MongoDB Atlas'))
  .catch((err) => console.error('❌ Error DB:', err));

// --- RUTAS PÚBLICAS (Cualquiera entra) ---

// Registro
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ error: 'El usuario ya existe' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'Usuario registrado' });
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Login
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ error: 'Usuario no encontrado' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ error: 'Contraseña incorrecta' });

        // Crear Token
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        res.json({ token, username: user.username });
    } catch (error) {
        res.status(500).json({ error: 'Error de login' });
    }
});

// --- RUTAS PRIVADAS (Solo con Token) ---

// Obtener MIS tareas
app.get('/tasks', verifyToken, async (req, res) => {
    try {
        // Solo busca tareas donde el user sea el del token
        const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener tareas' });
    }
});

// Crear tarea
app.post('/tasks', verifyToken, async (req, res) => {
    try {
        const newTask = new Task({
            title: req.body.title,
            category: req.body.category,
            user: req.user._id
        });
        const savedTask = await newTask.save();
        res.json(savedTask);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear tarea' });
    }
});

// Actualizar tarea (Solo si es mía)
app.put('/tasks/:id', verifyToken, async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
        if(!task) return res.status(404).json({ error: 'Tarea no encontrada o no autorizada' });

        task.done = !task.done;
        await task.save();
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar' });
    }
});

// Borrar tarea (Solo si es mía)
app.delete('/tasks/:id', verifyToken, async (req, res) => {
    try {
        const deleted = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if(!deleted) return res.status(404).json({ error: 'Tarea no encontrada o no autorizada' });
        res.json({ message: 'Tarea eliminada' });
    } catch (error) {
        res.status(500).json({ error: 'Error al borrar' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor seguro corriendo en puerto ${PORT}`);
});