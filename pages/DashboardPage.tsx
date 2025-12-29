
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  CheckCircle2, 
  Clock,
  TrendingUp,
  FilePlus,
  Activity,
  ArrowUpRight,
  FileText,
  DollarSign
} from 'lucide-react';
import { prisma } from '../app/api/_db/prisma.ts';
import AiAssistant from '../components/AiAssistant.tsx';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = React.useState({
    clients: 0,
    openOrders: 0,
    completedTotal: 0,
    revenue: 0
  });
  const [recentOrders, setRecentOrders] = React.useState<any[]>([]);
  const [recentReports, setRecentReports] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const clients = await prisma.client.findMany();
        const orders = await prisma.workOrder.findMany({ include: { client: true } });
        const reports = await prisma.serviceReport.findMany();
        
        const totalRevenue = reports.reduce((acc, r: any) => acc + (r.partsCost || 0) + (r.serviceCost || 0), 0);

        setStats({
          clients: clients.length,
          openOrders: orders.filter((o: any) => o.status === 'OPEN' || o.status === 'IN_PROGRESS').length,
          completedTotal: orders.filter((o: any) => o.status === 'COMPLETED').length,
          revenue: totalRevenue
        });

        setRecentOrders(orders.slice(-5).reverse());
        setRecentReports(reports.slice(-4).reverse());
      } catch (err) {
        console.error("Dashboard data fetch error:", err);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { label: 'Baza Klientów', value: stats.clients, icon: Users, color: 'indigo' },
    { label: 'W Realizacji', value: stats.openOrders, icon: Clock, color: 'orange' },
    { label: 'Przychód (Suma)', value: `${stats.revenue.toLocaleString()} zł`, icon: DollarSign, color: 'emerald' },
    { label: 'Efektywność', value: '94%', icon: TrendingUp, color: 'blue' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Centrum Operacyjne</h1>
          <p className="text-slate-500 font-medium">Bieżący status firmy i wyniki finansowe.</p>
        </div>
        <button onClick={() => navigate('/work-orders')} className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 flex items-center hover:bg-indigo-700 transition-all">
          <FilePlus className="mr-2 h-5 w-5" /> Nowe Zlecenie
        </button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center mb-6`}>
              <stat.icon size={24} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <h2 className="font-black text-slate-900 flex items-center gap-2">
                <Activity size={18} className="text-indigo-600" /> Aktywność Serwisu
              </h2>
            </div>
            <div className="divide-y divide-slate-50">
              {recentOrders.map((order) => (
                <div key={order.id} className="p-5 hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer" onClick={() => navigate('/work-orders')}>
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${order.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-orange-500'}`}></div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{order.title}</p>
                      <p className="text-xs text-slate-500 font-medium">{order.client?.name}</p>
                    </div>
                  </div>
                  <ArrowUpRight size={16} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="font-black mb-6 flex items-center gap-2 text-indigo-400 uppercase tracking-widest text-xs">
                <FileText size={16} /> Ostatnie Rozliczenia
              </h3>
              <div className="space-y-4">
                {recentReports.map(report => (
                  <div key={report.id} className="flex justify-between items-center border-b border-white/5 pb-3">
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold truncate">{report.equipment}</p>
                      <p className="text-[9px] text-slate-500 uppercase">{new Date(report.completedAt).toLocaleDateString()}</p>
                    </div>
                    <p className="text-xs font-black text-emerald-400">{(report.partsCost + report.serviceCost).toFixed(0)} zł</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 text-white/[0.03] group-hover:scale-110 transition-transform">
              <DollarSign size={200} />
            </div>
          </div>
        </div>
      </div>
      
      {/* AI Assistant jest tylko tutaj, jako doradca biznesowy/techniczny */}
      <AiAssistant />
    </div>
  );
};

export default DashboardPage;
