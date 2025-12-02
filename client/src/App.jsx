import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  const API_URL = 'http://localhost:5000/api/tasks';

  // 1. Cargar tareas al iniciar
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API_URL);
      setTasks(res.data);
    } catch (error) {
      console.error("Error cargando tareas:", error);
    }
  };

  // 2. Agregar Tarea
  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    try {
      console.log("Enviando tarea a:", API_URL);
      const res = await axios.post(API_URL, { title: newTask }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log("Respuesta del servidor:", res);
      setTasks([...tasks, res.data]);
      setNewTask('');
    } catch (error) {
      console.error("Error completo:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
    }
  };

  // 3. Marcar como completada
  const toggleTask = async (id) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`);
      // Actualiza solo la tarea modificada en la lista
      setTasks(tasks.map(t => t._id === id ? res.data : t));
    } catch (error) {
      console.error("Error actualizando tarea:", error);
    }
  };

  // 4. Eliminar Tarea
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (error) {
      console.error("Error borrando tarea:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-800 rounded-xl shadow-2xl overflow-hidden p-6 border border-slate-700">
        
        <h1 className="text-3xl font-bold text-center text-blue-500 mb-6">Task Manager 🚀</h1>

        {/* Formulario */}
        <form onSubmit={addTask} className="flex gap-2 mb-6">
          <input 
            type="text" 
            placeholder="¿Qué tienes que hacer hoy?" 
            className="flex-1 p-3 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none focus:border-blue-500 text-white"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button 
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Agregar
          </button>
        </form>

        {/* Lista de Tareas */}
        <div className="space-y-3">
          {tasks.length === 0 && (
            <p className="text-center text-slate-500">No hay tareas pendientes 🎉</p>
          )}

          {tasks.map(task => (
            <div key={task._id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-all group">
              
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => toggleTask(task._id)}>
                <div className={`w-5 h-5 rounded border flex items-center justify-center ${task.done ? 'bg-green-500 border-green-500' : 'border-slate-500'}`}>
                  {task.done && <span className="text-xs text-white">✓</span>}
                </div>
                <span className={`text-lg ${task.done ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                  {task.title}
                </span>
              </div>

              <button 
                onClick={() => deleteTask(task._id)}
                className="text-slate-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default App;