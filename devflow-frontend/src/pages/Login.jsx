import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Layout } from 'lucide-react';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/authenticate', credentials);
            localStorage.setItem('token' , response.data.token);
            navigate('/dashboard');
        } catch (error) {
            alert('Erreur : Identifiants incorrects');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <div className="flex justify-center mb-6">
                    <div className="p-3 bg-indigo-600 rounded-lg text-white">
                        <Layout size={32} />
                    </div>
                </div>
                
                <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">
                    Bienvenue sur DevFlow
                </h2>
                <p className="text-center text-slate-500 mb-8">
                    Gérez vos tickets en toute simplicité
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input 
                            type="email" 
                            required
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            placeholder="nom@exemple.com"
                            onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Mot de passe</label>
                        <input 
                            type="password" 
                            required
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            placeholder="••••••••"
                            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                        />
                    </div>

                    <button 
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg shadow-md transition-colors duration-200 cursor-pointer"
                    >
                        Se connecter
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;