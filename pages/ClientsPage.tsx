
import React, { useState, useEffect } from 'react';
import { Plus, Search, Mail, Phone, MapPin, Trash2 } from 'lucide-react';
import { prisma } from '../app/api/_db/prisma';
import { Client } from '../app/types';

const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const loadClients = async () => {
    const data = await prisma.client.findMany();
    setClients(data);
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    await prisma.client.create({
      data: {
        ...formData,
        companyId: 'c1'
      }
    });
    setIsModalOpen(false);
    setFormData({ name: '', email: '', phone: '', address: '' });
    loadClients();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Czy na pewno chcesz usunąć tego klienta?')) {
      await prisma.client.delete({ where: { id } });
      loadClients();
    }
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.email?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (c.phone?.includes(searchQuery))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Baza Klientów</h1>
          <p className="text-slate-500 font-medium">Zarządzaj listą swoich kontrahentów</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-5 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          <Plus className="mr-2 h-5 w-5" /> Dodaj klienta
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Szukaj po nazwie, emailu lub telefonie..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Nazwa Klienta</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Kontakt</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Adres</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Akcje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-medium italic">
                    Nie znaleziono klientów spełniających kryteria.
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{client.name}</div>
                      <div className="text-[10px] text-slate-400 font-black uppercase mt-0.5">ID: {client.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center text-sm text-slate-600 font-medium">
                          <Mail className="h-4 w-4 mr-2 text-slate-300" /> {client.email || '-'}
                        </div>
                        <div className="flex items-center text-sm text-slate-600 font-medium">
                          <Phone className="h-4 w-4 mr-2 text-slate-300" /> {client.phone || '-'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-slate-600 font-medium">
                        <MapPin className="h-4 w-4 mr-2 text-slate-300" /> {client.address || 'Brak adresu'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDelete(client.id)} 
                        className="p-2.5 text-slate-300 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 ring-1 ring-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Nowy Klient</h2>
            <form onSubmit={handleAddClient} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nazwa firmy / Klienta</label>
                <input 
                  type="text" required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500" 
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">E-mail</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Telefon</label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Adres</label>
                <textarea 
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500" 
                ></textarea>
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button" onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-slate-200 rounded-xl font-bold text-slate-600"
                >
                  Anuluj
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all hover:-translate-y-0.5"
                >
                  Zapisz
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsPage;
