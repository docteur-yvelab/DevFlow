import './App.css'
import Login from './pages/Login'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';

function App() {


  return (
        // <Login />
    <Router>
          <Routes>
            
            {/* Route par défaut : affiche la page de Login */}
            <Route path="/" element={<Login />} />
            
            {/* Route du Dashboard : on l'utilisera juste après */}
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
    </Router>
    
  )
}

export default App
