import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [mensaje, setMensaje] = useState('Cargando...');
  const [backendStatus, setBackendStatus] = useState('neutral'); // neutral, success, error

  useEffect(() => {
    // Intentamos conectar con el backend
    axios.get('http://localhost:5000/')
      .then(res => {
        setMensaje(res.data.mensaje);
        setBackendStatus('success');
      })
      .catch(err => {
        console.error(err);
        setMensaje('Error: El Backend no responde. (¿Ejecutaste "node index.js" en la carpeta server?)');
        setBackendStatus('error');
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans text-white">
      <div className="max-w-md w-full bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-700">
        
        {/* Encabezado */}
        <div className="p-6 border-b border-slate-700 bg-slate-800/50">
          <h1 className="text-2xl font-bold text-blue-400">
            Portafolio Full Stack 🚀
          </h1>
          <p className="text-slate-400 text-sm mt-1">Status del Sistema</p>
        </div>

        {/* Cuerpo */}
        <div className="p-6 space-y-4">
          
          {/* Indicador de Tailwind */}
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
            <p className="text-sm text-slate-300">
              <span className="font-semibold text-white">Frontend (Tailwind):</span> Activo y con estilo.
            </p>
          </div>

          {/* Indicador del Backend */}
          <div className={`p-4 rounded-lg border ${
            backendStatus === 'success' ? 'bg-green-900/20 border-green-500/30' : 
            backendStatus === 'error' ? 'bg-red-900/20 border-red-500/30' : 'bg-slate-700'
          }`}>
            <p className={`text-sm font-mono ${
              backendStatus === 'success' ? 'text-green-400' : 
              backendStatus === 'error' ? 'text-red-400' : 'text-slate-300'
            }`}>
              &gt; {mensaje}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;