import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [category, setCategory] = useState('personal')

  const API_URL = 'https://task-backend-4woc.onrender.com/tasks';

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
      const res = await axios.post(API_URL, { title: newTask, category: category }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log("Respuesta del servidor:", res);
      setTasks([...tasks, res.data]);
      setNewTask('');
      setCategory('personal');
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
  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Trabajo': return 'bg-purple-600 text-purple-100';
      case 'Estudio': return 'bg-blue-600 text-blue-100';
      case 'Personal': return 'bg-green-600 text-green-100';
      default: return 'bg-gray-600 text-gray-100'
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
          <div className="flex gap-2">
            {/*<--- 4. Selector de Categoría*/}
            <select value= {category} onChange={(e) => setCategory(e.target.value)} className='p-3 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none focus:border-blue-500 text-white text-sm'>
              <option value="Personal">Personal 🏠</option>
              <option value="Trabajo">Trabajo 💼</option>
              <option value="Estudio">Estudio 📚</option>
              <option value="Otro">Otro ⚡</option>
            </select>
            <button type='submit' className='flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors'>
              Agregar
            </button>
          </div>
        </form>

        {/* Lista de Tareas */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {tasks.length === 0 && (
            <p className="text-center text-slate-500">No hay tareas pendientes 🎉</p>
          )}

          {tasks.map(task => (
            <div key={task._id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-all group border border-transparent hover:border-slate-600">
              
              <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={() => toggleTask(task._id)}>
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${task.done ? 'bg-green-500 border-green-500' : 'border-slate-500'}`}>
                  {task.done && <span className="text-xs text-white">✓</span>}
                </div>
                <div>
                <span className={`text-lg transition-all ${task.done ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                  {task.title}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full w-fit mt-1 ${getCategoryColor(task.category)}`}>
                    {task.category || 'Personal'}
                </span>
                </div>
              </div>

              <button 
                onClick={() => deleteTask(task._id)}
                className="text-slate-500 hover:text-red-500 transition-colors p-2"
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