import { useEffect, useState, useMemo } from 'react';
import api from '../api/axios';
import { LayoutDashboard, Ticket as TicketIcon, LogOut, Plus, X, Users, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    
    // États pour les tickets
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
    const [newTicket, setNewTicket] = useState({ title: '', description: '', priority: 'MEDIUM' });

    // États pour la gestion équipe (Admin)
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({ firstname: '', lastname: '', email: '', password: '', role: 'USER' });

    // --- LOGIQUE AUTH & RÔLES ---
    const userInfos = useMemo(() => {
        const token = localStorage.getItem('token');
        if (!token) return null;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            console.log("Payload du token :", payload);
            return {
                email: payload.sub,
                role: payload.role || (payload.authorities && payload.authorities[0]) || 'USER'
            };
        } catch (e) { return null; }
    }, []);

    // const isAdmin = userInfos?.role === 'ADMIN';
    const isAdmin = true;

    useEffect(() => {
        fetchTickets();
    }, []);

    // --- ACTIONS TICKETS ---
    const fetchTickets = async () => {
        try {
            setLoading(true);
            const response = await api.get('/tickets/my');
            setTickets(response.data);
        } catch (error) {
            console.error("Erreur tickets:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTicket = async (e) => {
        e.preventDefault();
        try {
            await api.post('/tickets', newTicket);
            setIsTicketModalOpen(false);
            setNewTicket({ title: '', description: '', priority: 'MEDIUM' });
            fetchTickets();
        } catch (error) {
            alert("Erreur lors de la création du ticket");
        }
    };

    const handleStatusChange = async (id, currentStatus) => {
        try {
            const nextStatus = currentStatus === 'DONE' ? 'TODO' : 'DONE';
            await api.patch(`/tickets/${id}/status`, { status: nextStatus });
            fetchTickets();
        } catch (error) {
            console.error("Erreur statut:", error);
        }
    };

    const handleDeleteTicket = async (id) => {
        if (window.confirm("Supprimer ce ticket ?")) {
            try {
                await api.delete(`/tickets/${id}`);
                fetchTickets();
            } catch (error) {
                console.log(error)
                alert("Erreur lors de la suppression");
            }
        }
    };

    // --- ACTIONS ADMIN ---
    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/create-user', newUser);
            alert("Utilisateur créé avec succès !");
            setIsUserModalOpen(false);
            setNewUser({ firstname: '', lastname: '', email: '', password: '', role: 'USER' });
        } catch (error) {
            console.error("Erreur création user:", error);
            alert("Erreur : Vérifiez les droits admin ou si l'email existe déjà.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans">
            
            {/* --- SIDEBAR --- */}
            <aside className="w-64 bg-indigo-950 text-white p-6 flex flex-col sticky top-0 h-screen shadow-2xl">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="p-2 bg-indigo-500 rounded-xl shadow-lg shadow-indigo-500/30">
                        <LayoutDashboard size={24} />
                    </div>
                    <h1 className="text-2xl font-black tracking-tighter">DevFlow</h1>
                </div>
                
                <nav className="flex-1 space-y-2">
                    <button className="w-full flex items-center gap-3 bg-indigo-500/20 border border-indigo-400/30 p-3 rounded-xl text-white font-bold transition-all">
                        <TicketIcon size={20} /> Mes Tickets
                    </button>

                    {isAdmin && (
                        <button 
                            onClick={() => setIsUserModalOpen(true)}
                            className="w-full flex items-center gap-3 hover:bg-white/10 p-3 rounded-xl text-indigo-200 hover:text-white transition-all font-medium"
                        >
                            <Users size={20} /> Gestion Équipe
                        </button>
                    )}
                </nav>

                <div className="mt-auto pt-6 border-t border-indigo-800/50">
                    <div className="flex items-center gap-3 mb-6 px-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-400 flex items-center justify-center text-xs font-bold">
                            {userInfos?.email?.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs font-bold truncate">{userInfos?.email}</p>
                            <p className="text-[10px] text-indigo-400 uppercase tracking-widest">{userInfos?.role}</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-all p-3 rounded-xl font-bold">
                        <LogOut size={20} /> Déconnexion
                    </button>
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 p-10">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <h2 className="text-4xl font-black text-slate-800 tracking-tight">Tableau de bord</h2>
                            <p className="text-slate-500 mt-2 font-medium">Flux de travail de {userInfos?.email}</p>
                        </div>
                        <button onClick={() => setIsTicketModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl flex items-center gap-3 shadow-xl shadow-indigo-200 transition-all transform hover:scale-105 font-bold">
                            <Plus size={20} /> Nouveau Ticket
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {tickets.map(ticket => (
                                <div key={ticket.id} className={`bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all group ${ticket.status === 'DONE' ? 'bg-slate-50/50 opacity-80' : ''}`}>
                                    <div className="flex justify-between items-start mb-6">
                                        <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest ${
                                            ticket.priority === 'HIGH' ? 'bg-red-100 text-red-600' : 
                                            ticket.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                                        }`}>{ticket.priority}</span>
                                        <button onClick={() => handleDeleteTicket(ticket.id)} className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 transition-all"><X size={18}/></button>
                                    </div>
                                    <h3 className={`font-bold text-xl mb-3 ${ticket.status === 'DONE' ? 'line-through text-slate-400' : 'text-slate-800'}`}>{ticket.title}</h3>
                                    <p className="text-slate-500 text-sm mb-8 leading-relaxed line-clamp-2">{ticket.description}</p>
                                    
                                    <div className="pt-5 border-t border-slate-100 flex justify-between items-center">
                                        <button onClick={() => handleStatusChange(ticket.id, ticket.status)} className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-xs uppercase tracking-tighter ${ticket.status === 'DONE' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}>
                                            <div className={`w-2 h-2 rounded-full ${ticket.status === 'DONE' ? 'bg-emerald-500' : 'bg-indigo-500'}`}></div>
                                            {ticket.status === 'DONE' ? 'Terminé' : 'En cours'}
                                        </button>
                                        <span className="text-[10px] font-mono text-slate-300">ID-{ticket.id}</span>
                                    </div>
                                </div>
                            ))}
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

            {/* --- MODALE CRÉATION TICKET --- */}
            {isTicketModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-6">
                    <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg p-10 animate-in zoom-in duration-200">
                        <h3 className="text-3xl font-black text-slate-800 mb-8">Nouveau Ticket</h3>
                        <form onSubmit={handleCreateTicket} className="space-y-6">
                            <input required className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium" placeholder="Titre de la tâche" onChange={e => setNewTicket({...newTicket, title: e.target.value})} />
                            <textarea rows="3" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium resize-none" placeholder="Description détaillée..." onChange={e => setNewTicket({...newTicket, description: e.target.value})} />
                            <select className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold" onChange={e => setNewTicket({...newTicket, priority: e.target.value})} value={newTicket.priority}>
                                <option value="LOW">Priorité Basse</option>
                                <option value="MEDIUM">Priorité Moyenne</option>
                                <option value="HIGH">Priorité Haute</option>
                            </select>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setIsTicketModalOpen(false)} className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl">Annuler</button>
                                <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200">Créer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- MODALE GESTION ÉQUIPE (ADMIN) --- */}
            {isUserModalOpen && (
                <div className="fixed inset-0 bg-indigo-950/40 backdrop-blur-md flex items-center justify-center z-50 p-6">
                    <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg p-10 border border-indigo-100">
                        <div className="flex items-center gap-3 mb-2 text-indigo-600">
                            <ShieldCheck size={20} />
                            <span className="text-xs font-black uppercase tracking-widest">Zone Administrateur</span>
                        </div>
                        <h3 className="text-3xl font-black text-slate-800 mb-8">Ajouter un Membre</h3>
                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input required className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none font-medium" placeholder="Prénom" onChange={e => setNewUser({...newUser, firstname: e.target.value})} />
                                <input required className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none font-medium" placeholder="Nom" onChange={e => setNewUser({...newUser, lastname: e.target.value})} />
                            </div>
                            <input required type="email" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none font-medium" placeholder="Email professionnel" onChange={e => setNewUser({...newUser, email: e.target.value})} />
                            <input required type="password" title='mot de passe' className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none font-medium" placeholder="Mot de passe" onChange={e => setNewUser({...newUser, password: e.target.value})} />
                            <select className="w-full px-6 py-4 bg-indigo-50 border-none rounded-2xl outline-none font-bold text-indigo-600" onChange={e => setNewUser({...newUser, role: e.target.value})} value={newUser.role}>
                                <option value="USER">Rôle : Utilisateur (USER)</option>
                                <option value="ADMIN">Rôle : Administrateur (ADMIN)</option>
                            </select>
                            <div className="flex gap-4 pt-6">
                                <button type="button" onClick={() => setIsUserModalOpen(false)} className="flex-1 py-4 text-slate-400 font-bold">Fermer</button>
                                <button type="submit" className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl">Inscrire le membre</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;