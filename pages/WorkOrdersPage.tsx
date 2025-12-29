
import React, { useState, useEffect } from 'react';
import { Plus, Clock, CheckCircle2, AlertCircle, Calendar, User as UserIcon, ClipboardList, Filter } from 'lucide-react';
import { prisma } from '../app/api/_db/prisma';
import { WorkOrder, Client, OrderStatus } from '../app/types';

const WorkOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<WorkOrder[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'ALL' | OrderStatus>('ALL');
  const [formData, setFormData] = useState({ title: '', clientId: '', description: '' });

  const loadData = async () => {
    const clientsData = await prisma.client.findMany();
    const ordersData = await prisma.workOrder.findMany({ include: { client: true } });
    setClients(clientsData);
    setOrders(ordersData);
  };

  useEffect(() => { loadData(); }, []);

  const handleAddOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientId) return alert('Wybierz klienta');
    await prisma.workOrder.create({ data: { ...formData, status: OrderStatus.OPEN, companyId: 'c1' } });
    setIsModalOpen(false);
    setFormData({ title: '', clientId: '', description: '' });
    loadData();
  };

  const updateStatus = async (id: string, status: OrderStatus) => {
    await prisma.workOrder.update({ where: { id }, data: { status } });
    loadData();
  };

  const filteredOrders = activeTab === 'ALL' 
    ? orders 
    : orders.filter(o => o.status === activeTab);

  const getStatusConfig = (status: OrderStatus) => {
    switch(status) {
      case OrderStatus.COMPLETED:
        return { label: 'Zakończone', classes: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2, accent: 'bg-emerald-500' };
      case OrderStatus.IN_PROGRESS:
        return { label: 'W realizacji', classes: 'bg-blue-50 text-blue-700 border-blue-200', icon: Clock, accent: 'bg-blue-500' };
      default:
        return { label: 'Nowe', classes: 'bg-orange-50 text-orange-700 border-orange-200', icon: AlertCircle, accent: 'bg-orange-500' };
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Warsztat Zleceń</h1>
          <p className="text-slate-500 font-medium">Bieżące prace serwisowe i harmonogram.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-5 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          <Plus className="mr-2 h-5 w-5" /> Nowe Zlecenie
        </button>
      </div>

      {/* Tabs Filter */}
      <div className="flex p-1 bg-slate-100 rounded-2xl w-fit">
        {[
          { id: 'ALL', label: 'Wszystkie' },
          { id: OrderStatus.OPEN, label: 'Nowe' },
          { id: OrderStatus.IN_PROGRESS, label: 'W realizacji' },
          { id: OrderStatus.COMPLETED, label: 'Zakończone' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === tab.id 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredOrders.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-slate-200">
            <ClipboardList className="mx-auto h-12 w-12 text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold italic">Brak zleceń w wybranej kategorii</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const config = getStatusConfig(order.status);
            const StatusIcon = config.icon;
            const client = (order as any).client;
            
            return (
              <div key={order.id} className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col hover:border-indigo-200 transition-all shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${config.classes} flex items-center`}>
                    <StatusIcon size={12} className="mr-1" /> {config.label}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">{order.title}</h3>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed flex-1 italic line-clamp-2">
                  {order.description || "Brak dodatkowego opisu usterki."}
                </p>

                <div className="p-4 bg-slate-50 rounded-2xl mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                      <UserIcon size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{client?.name || 'Klient nieznany'}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{client?.phone || 'Brak telefonu'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {order.status === OrderStatus.OPEN && (
                    <button 
                      onClick={() => updateStatus(order.id, OrderStatus.IN_PROGRESS)}
                      className="flex-1 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors"
                    >
                      Rozpocznij prace
                    </button>
                  )}
                  {order.status === OrderStatus.IN_PROGRESS && (
                    <button 
                      onClick={() => updateStatus(order.id, OrderStatus.COMPLETED)}
                      className="flex-1 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-colors"
                    >
                      Zakończ serwis
                    </button>
                  )}
                  {order.status === OrderStatus.COMPLETED && (
                    <div className="flex-1 text-center py-2.5 bg-slate-50 text-slate-400 text-xs font-bold rounded-xl border border-slate-100">
                      Zadanie Wykonane
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Dodawania */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 ring-1 ring-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Nowe Zlecenie</h2>
            <form onSubmit={handleAddOrder} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Rodzaj usterki / Tytuł</label>
                <input 
                  type="text" required placeholder="np. Naprawa sterownika kotła"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Klient z bazy</label>
                <select 
                  required className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500"
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                >
                  <option value="">Wybierz klienta...</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Opis zgłoszenia</label>
                <textarea 
                  rows={4} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors">Anuluj</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">Zarejestruj Zlecenie</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkOrdersPage;
