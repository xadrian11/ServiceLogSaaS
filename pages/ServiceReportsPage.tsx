
import React, { useState, useEffect, useRef } from 'react';
/* Fix: Removed non-existent icon 'Tool' and other unused icons (Camera, ImageIcon, CreditCard) */
import { FileText, Eye, Plus, X, Printer } from 'lucide-react';
import { prisma } from '../app/api/_db/prisma.ts';
import { ServiceReport, WorkOrder } from '../app/types.ts';

const ServiceReportsPage: React.FC = () => {
  const [reports, setReports] = useState<ServiceReport[]>([]);
  const [orders, setOrders] = useState<WorkOrder[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [formData, setFormData] = useState({
    workOrderId: '',
    equipment: '',
    notes: '',
    partsCost: '0',
    serviceCost: '0'
  });

  const loadData = async () => {
    const rData = await prisma.serviceReport.findMany();
    const oData = await prisma.workOrder.findMany({ include: { client: true } });
    
    const reportsWithOrders = rData.map(r => ({
      ...r,
      order: oData.find(o => o.id === r.workOrderId)
    }));

    setReports(reportsWithOrders);
    setOrders(oData.filter((o: any) => o.status === 'COMPLETED'));
  };

  useEffect(() => { loadData(); }, []);

  const handleAddReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.workOrderId) return alert('Wybierz zlecenie');
    
    await prisma.serviceReport.create({ 
      data: { 
        ...formData, 
        photos,
        partsCost: parseFloat(formData.partsCost),
        serviceCost: parseFloat(formData.serviceCost)
      } 
    });
    setIsModalOpen(false);
    setFormData({ workOrderId: '', equipment: '', notes: '', partsCost: '0', serviceCost: '0' });
    setPhotos([]);
    loadData();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="print:hidden space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Książka Serwisowa</h1>
            <p className="text-slate-500 font-medium">Baza wszystkich wykonanych prac i rozliczeń.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 flex items-center"
          >
            <Plus className="mr-2 h-5 w-5" /> Nowy Protokół
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report: any) => (
            <div key={report.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:border-indigo-200 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <FileText size={24} />
                </div>
                <button 
                  onClick={() => setSelectedReport(report)}
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                >
                  <Eye size={20} />
                </button>
              </div>
              <h3 className="font-bold text-slate-900 truncate">{report.equipment}</h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">{report.order?.client?.name}</p>
              
              <div className="mt-6 pt-6 border-t border-slate-50 flex justify-between items-center">
                <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                  {new Date(report.completedAt).toLocaleDateString()}
                </div>
                <div className="text-sm font-black text-emerald-600">
                  {(report.partsCost + report.serviceCost).toFixed(2)} PLN
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Profesjonalny Widok Druku */}
      {selectedReport && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-8 print:static print:p-0">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md print:hidden" onClick={() => setSelectedReport(null)}></div>
          <div className="relative bg-white sm:rounded-3xl shadow-2xl w-full max-w-4xl h-full sm:h-fit overflow-y-auto print:shadow-none print:rounded-none">
            
            <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 p-4 flex items-center justify-between print:hidden">
              <span className="font-bold text-slate-600">Protokół: {selectedReport.id}</span>
              <div className="flex gap-2">
                <button onClick={handlePrint} className="flex items-center px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-black">
                  <Printer size={16} className="mr-2" /> Drukuj / PDF
                </button>
                <button onClick={() => setSelectedReport(null)} className="p-2 bg-slate-100 text-slate-400 rounded-xl">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-12 print:p-0 space-y-12">
              <div className="flex justify-between">
                <div>
                  <h1 className="text-4xl font-black tracking-tighter text-indigo-600">ServiceLog</h1>
                  <p className="text-slate-400 font-bold text-sm uppercase mt-1">System Zarządzania Serwisem</p>
                </div>
                <div className="text-right">
                  <h2 className="text-2xl font-black text-slate-900 uppercase">Protokół Serwisowy</h2>
                  <p className="text-slate-500 font-bold">Data: {new Date(selectedReport.completedAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-12 pt-8">
                <div className="space-y-1">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Zleceniodawca</h4>
                  <p className="text-lg font-black text-slate-900">{selectedReport.order?.client?.name}</p>
                  <p className="text-sm text-slate-500">{selectedReport.order?.client?.address}</p>
                  <p className="text-sm text-slate-500">Tel: {selectedReport.order?.client?.phone}</p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Urządzenie</h4>
                  <p className="text-lg font-black text-slate-900">{selectedReport.equipment}</p>
                  <p className="text-sm text-slate-500">ID Zlecenia: {selectedReport.workOrderId}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Wykonane czynności</h4>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-sm">{selectedReport.notes}</p>
              </div>

              <div className="bg-slate-50 rounded-3xl p-8 space-y-4 print:bg-white print:border print:border-slate-100">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Podsumowanie kosztów</h4>
                <div className="flex justify-between text-sm py-2 border-b border-slate-100">
                  <span className="text-slate-500">Części zamienne i materiały</span>
                  <span className="font-bold">{selectedReport.partsCost?.toFixed(2)} PLN</span>
                </div>
                <div className="flex justify-between text-sm py-2 border-b border-slate-100">
                  <span className="text-slate-500">Usługa serwisowa / Robocizna</span>
                  <span className="font-bold">{selectedReport.serviceCost?.toFixed(2)} PLN</span>
                </div>
                <div className="flex justify-between text-lg pt-2">
                  <span className="font-black text-slate-900 uppercase">Razem do zapłaty</span>
                  <span className="font-black text-indigo-600">{(selectedReport.partsCost + selectedReport.serviceCost).toFixed(2)} PLN</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-24 pt-16">
                <div className="border-t border-slate-200 pt-4 text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Podpis Klienta</p>
                </div>
                <div className="border-t border-slate-200 pt-4 text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Pieczęć i Podpis Serwisanta</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nowego Raportu */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-black text-slate-900 mb-8">Finalizacja Serwisu</h2>
            <form onSubmit={handleAddReport} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Zlecenie</label>
                  <select required className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.workOrderId} onChange={e => setFormData({...formData, workOrderId: e.target.value})}>
                    <option value="">Wybierz...</option>
                    {orders.map(o => <option key={o.id} value={o.id}>{o.title}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Serwisowany Sprzęt (Model/SN)</label>
                  <input type="text" required className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.equipment} onChange={e => setFormData({...formData, equipment: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Części (PLN)</label>
                  <input type="number" step="0.01" className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.partsCost} onChange={e => setFormData({...formData, partsCost: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Robocizna (PLN)</label>
                  <input type="number" step="0.01" className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.serviceCost} onChange={e => setFormData({...formData, serviceCost: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Szczegółowy opis prac</label>
                <textarea rows={5} required className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}></textarea>
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 p-4 font-bold text-slate-400">Anuluj</button>
                <button type="submit" className="flex-1 p-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100">Zapisz i zakończ</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceReportsPage;
