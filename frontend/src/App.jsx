import './styles/theme.css';
import './styles/App.css';   // Estilos principales
import Rutas from './routes/Routes.jsx';  // Importa el componente por default
import { AuthProvider } from './context/AuthContext.jsx';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Rutas />
      </AuthProvider>
    </div>
  );
}

export default App;