import { useEffect, useState } from 'react';
import api from '../api/axios';
import { LayoutDashboard, Ticket as TicketIcon, LogOut, Plus, X, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [tickets, setTickets] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [newTicket, setNewTicket] = useState({
        title: '',
        description: '',
        priority: 'MEDIUM'
    });
    
    const navigate = useNavigate();

    // Charger les tickets au montage du composant
    useEffect(() => {
        fetchTickets();
        
    }, []);

    // afficher les tickets
    const fetchTickets = async () => {
        try {;
        
            setLoading(true);
            // const response = await api.get('/tickets/all');
            const response = await api.get('/tickets/my');

            console.log("Données reçues du serveur :", response.data);
            setTickets(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des tickets", error);
        } finally {
            setLoading(false);
        }
    };

    // creation de ticket
    const handleCreateTicket = async (e) => {
        e.preventDefault();
        try {
            const response =await api.post('/tickets', newTicket);
            console.log("Succés: ", response.data);
            setIsModalOpen(false);
            setNewTicket({ title: '', description: '', priority: 'MEDIUM' });
            fetchTickets();
        } catch (error) {
            console.log("Erreur détaillée:", error.response?.data);
            alert("Erreur lors de la création du ticket");
        }
    };

    // se deconnecter
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    console.log("Mes tickets chargés :", tickets);

    return (
        <div className="flex min-h-screen bg-slate-50">
            
            {/* --- SIDEBAR --- */}
            <aside className="w-64 bg-indigo-900 text-white p-6 flex flex-col sticky top-0 h-screen shadow-xl">
                <div className="flex items-center gap-3 mb-10">
                    <div className="p-2 bg-indigo-500 rounded-lg">
                        <LayoutDashboard size={24} />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">DevFlow</h1>
                </div>
                
                <nav className="flex-1 space-y-2">
                    <button className="w-full flex items-center gap-3 bg-indigo-800/50 border border-indigo-700 p-3 rounded-xl text-white font-medium transition-all">
                        <TicketIcon size={20} /> Mes Tickets
                    </button>
                </nav>

                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 text-indigo-300 hover:text-white hover:bg-white/10 transition-all p-3 rounded-xl mt-auto cursor-pointer"
                >
                    <LogOut size={20} /> Déconnexion
                </button>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <div className="flex-1 p-8 overflow-y-auto">
                    
                    {/* Header du Dashboard */}
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h2 className="text-3xl font-extrabold text-slate-800">Tableau de bord</h2>
                            <p className="text-slate-500 mt-1">Gérez vos tickets et suivez leur progression.</p>
                        </div>
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all transform hover:scale-105 active:scale-95 cursor-pointer font-bold"
                        >
                            <Plus size={20} /> Nouveau Ticket
                        </button>
                    </div>

                    {/* Grille de tickets ou état vide */}
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : tickets.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {tickets.map(ticket => (
                                <div key={ticket.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className='font-bold'>{ticket.title}</h3>
                                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                                            ticket.priority === 'HIGH' ? 'bg-red-100 text-red-600' : 
                                            ticket.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                                        }`}>
                                            {ticket.priority}
                                        </span>
                                        <span className="text-xs font-mono text-slate-400">#{ticket.id}</span>
                                    </div>
                                    <h3 className="font-bold text-slate-800 text-lg mb-2 group-hover:text-indigo-600 transition-colors">{ticket.title}</h3>
                                    <p className="text-slate-600 text-sm line-clamp-3 mb-6 leading-relaxed">
                                        {ticket.description || "Aucune description fournie."}
                                    </p>
                                    <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <div className={`w-2 h-2 rounded-full ${ticket.status === 'DONE' ? 'bg-green-500' : 'bg-indigo-400'}`}></div>
                                            <span className="text-xs font-semibold uppercase">{ticket.status}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                            <div className="bg-slate-50 p-6 rounded-full mb-4">
                                <TicketIcon size={48} className="text-slate-300" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">Aucun ticket pour le moment</h3>
                            <p className="text-slate-500 max-w-xs text-center mt-2">
                                Commencez par créer votre premier ticket pour organiser votre travail.
                            </p>
                        </div>
                    )}
                </div>

                {/* --- FOOTER --- */}
                <footer className="px-8 py-6 border-t border-slate-200 bg-white/50 backdrop-blur-md flex flex-col md:flex-row justify-between items-center text-slate-400 text-xs">
                    <div className="flex items-center gap-4">
                        <p>© 2025 DevFlow Management System</p>
                        <span className="hidden md:inline text-slate-200">|</span>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                            <p className="font-medium">API Connectée</p>
                        </div>
                    </div>
                    <div className="flex gap-6 mt-4 md:mt-0 font-medium">
                        <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded">Version 1.0.0-beta</span>
                    </div>
                </footer>
            </main>

            {/* --- MODALE DE CRÉATION --- */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-xl font-black text-slate-800">Nouveau Ticket</h3>
                            <button 
                                onClick={() => setIsModalOpen(false)} 
                                className="p-2 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
                            >
                                <X size={20} className="text-slate-500" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleCreateTicket} className="p-8 space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Titre du ticket</label>
                                <input 
                                    required
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                                    placeholder="Ex: Correction bug CSS"
                                    onChange={e => setNewTicket({...newTicket, title: e.target.value})}
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                                <textarea 
                                    rows="3"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all resize-none"
                                    placeholder="Décrivez brièvement le problème..."
                                    onChange={e => setNewTicket({...newTicket, description: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Niveau de priorité</label>
                                <select 
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none appearance-none cursor-pointer"
                                    onChange={e => setNewTicket({...newTicket, priority: e.target.value})}
                                    value={newTicket.priority}
                                >
                                    <option value="LOW">Faible (Vert)</option>
                                    <option value="MEDIUM">Moyenne (Orange)</option>
                                    <option value="HIGH">Haute (Rouge)</option>
                                </select>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button 
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-bold transition-colors cursor-pointer"
                                >
                                    Annuler
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-200 transition-all cursor-pointer"
                                >
                                    Créer le ticket
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;