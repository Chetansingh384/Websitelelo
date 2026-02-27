import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Mail, MessageSquare, Clock, CheckCircle } from 'lucide-react';

const Contacts = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const leadsData = snapshot.docs.map(doc => ({
                _id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date()
            }));
            setContacts(leadsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Contact Submissions</h1>
                <p className="text-gray-400">View and manage messages from potential clients</p>
            </div>

            <div className="grid gap-6">
                {contacts.length === 0 ? (
                    <div className="bg-surface p-12 rounded-3xl text-center border border-white/5">
                        <MessageSquare className="mx-auto text-gray-600 mb-4" size={48} />
                        <p className="text-gray-500">No submissions yet.</p>
                    </div>
                ) : (
                    contacts.map((contact) => (
                        <div key={contact._id} className="bg-surface p-8 rounded-3xl border border-white/5 flex flex-col md:flex-row justify-between items-start gap-6">
                            <div className="flex-grow">
                                <div className="flex items-center space-x-3 mb-4">
                                    <h3 className="text-xl font-bold">{contact.name}</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${contact.status === 'New' ? 'bg-primary/20 text-primary' : 'bg-emerald-500/20 text-emerald-500'}`}>
                                        {contact.status}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-3 text-gray-400 mb-6 font-medium">
                                    <Mail size={16} />
                                    <span>{contact.email}</span>
                                    <span className="text-gray-700">|</span>
                                    <Clock size={16} />
                                    <span>{new Date(contact.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-gray-300 leading-relaxed bg-dark/40 p-6 rounded-2xl border border-white/5 italic">
                                    "{contact.message}"
                                </p>
                            </div>
                            <div className="flex md:flex-col gap-3">
                                <button className="p-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-xl transition-all" title="Mark as Read">
                                    <CheckCircle size={20} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Contacts;
