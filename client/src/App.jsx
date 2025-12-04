import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // Alternar entre Login y Registro

  // --- ESTADOS DE TAREAS ---
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [category, setCategory] = useState('Personal');

  //const API_URL = 'http://localhost:5000'; 
  const API_URL = 'https://task-backend-4woc.onrender.com';

  // 1. Efecto: Si hay token, cargamos las tareas
  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token]);

  // --- FUNCIONES DE AUTH ---

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = isRegistering ? '/register' : '/login';
    
    try {
      const res = await axios.post(`${API_URL}${endpoint}`, { username, password });
      
      if (isRegistering) {
        alert('Cuenta creada. Ahora inicia sesión.');
        setIsRegistering(false);
      } else {
        // LOGIN EXITOSO
        const receivedToken = res.data.token;
        setToken(receivedToken);
        localStorage.setItem('token', receivedToken); // Guardar en el navegador
        setUsername('');
        setPassword('');
      }
    } catch (error) {
      alert(error.response?.data?.error || 'Error de autenticación');
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setTasks([]);
  };

  // --- FUNCIONES DE TAREAS (Ahora con Token) ---

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/tasks`, {
        headers: { 'auth-token': token } // <--- LA LLAVE DE ACCESO
      });
      setTasks(res.data);
    } catch (error) {
      console.error("Error:", error);
      if(error.response?.status === 400) logout();
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    try {
      const res = await axios.post(`${API_URL}/tasks`, 
        { title: newTask, category: category }, 
        { headers: { 'auth-token': token } } // <--- LLAVE
      );
      setTasks([res.data, ...tasks]);
      setNewTask('');
      setCategory('Personal');
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const toggleTask = async (id) => {
    try {
      const res = await axios.put(`${API_URL}/tasks/${id}`, {}, {
        headers: { 'auth-token': token }
      });
      setTasks(tasks.map(t => t._id === id ? res.data : t));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`, {
        headers: { 'auth-token': token }
      });
      setTasks(tasks.filter(t => t._id !== id));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Trabajo': return 'bg-purple-600 text-purple-100';
      case 'Estudio': return 'bg-blue-600 text-blue-100';
      case 'Personal': return 'bg-green-600 text-green-100';
      default: return 'bg-gray-600 text-gray-100';
    }
  };

  // --- RENDERIZADO CONDICIONAL ---

  // VISTA 1: Si NO hay token, mostramos Login
  if (!token) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-800 rounded-xl shadow-2xl p-8 border border-slate-700">
          <h1 className="text-3xl font-bold text-center text-blue-500 mb-2">
            {isRegistering ? 'Crear Cuenta 📝' : 'Bienvenido 👋'}
          </h1>
          <p className="text-center text-slate-400 mb-6">
            Task Manager Seguro
          </p>

          <form onSubmit={handleAuth} className="flex flex-col gap-4">
            <input 
              type="text" placeholder="Usuario" 
              className="p-3 rounded bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-blue-500"
              value={username} onChange={(e) => setUsername(e.target.value)} required
            />
            <input 
              type="password" placeholder="Contraseña" 
              className="p-3 rounded bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-blue-500"
              value={password} onChange={(e) => setPassword(e.target.value)} required
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-bold transition">
              {isRegistering ? 'Registrarse' : 'Entrar'}
            </button>
          </form>

          <p className="mt-4 text-center text-slate-400 text-sm">
            {isRegistering ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="ml-2 text-blue-400 hover:underline font-bold"
            >
              {isRegistering ? 'Inicia Sesión' : 'Regístrate'}
            </button>
          </p>
        </div>
      </div>
    );
  }

  // VISTA 2: Si HAY token, mostramos la App
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-800 rounded-xl shadow-2xl overflow-hidden p-6 border border-slate-700">
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-500">Mis Tareas 🚀</h1>
          <button onClick={logout} className="text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded hover:bg-red-500/30">
            Cerrar Sesión
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={addTask} className="flex gap-2 mb-6">
          <input 
            type="text" placeholder="¿Qué harás hoy?" 
            className="flex-1 p-3 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none focus:border-blue-500 text-white"
            value={newTask} onChange={(e) => setNewTask(e.target.value)}
          />
          <div className="flex gap-2">
            <select value={category} onChange={(e) => setCategory(e.target.value)} className='p-3 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none focus:border-blue-500 text-white text-sm'>
              <option value="Personal">Personal 🏠</option>
              <option value="Trabajo">Trabajo 💼</option>
              <option value="Estudio">Estudio 📚</option>
              <option value="Otro">Otro ⚡</option>
            </select>
            <button type='submit' className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-bold'>
              +
            </button>
          </div>
        </form>

        {/* Lista */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {tasks.length === 0 && <p className="text-center text-slate-500">Lista vacía 💤</p>}
          
          {tasks.map(task => (
            <div key={task._id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-all border border-transparent hover:border-slate-600">
              <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={() => toggleTask(task._id)}>
                <div className={`w-5 h-5 rounded border flex items-center justify-center ${task.done ? 'bg-green-500 border-green-500' : 'border-slate-500'}`}>
                  {task.done && <span className="text-xs text-white">✓</span>}
                </div>
                <div>
                  <span className={`block ${task.done ? 'line-through text-slate-500' : 'text-slate-100'}`}>{task.title}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${getCategoryColor(task.category)}`}>{task.category || 'Personal'}</span>
                </div>
              </div>
              <button onClick={() => deleteTask(task._id)} className="text-slate-500 hover:text-red-500 p-2">🗑️</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;