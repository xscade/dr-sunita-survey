'use client';

import { useEffect, useState } from 'react';
import { Login } from '@/components/dashboard/Login';
import { Analytics } from '@/components/dashboard/Analytics';
import { PatientTable } from '@/components/dashboard/PatientTable';
import { Settings } from '@/components/dashboard/Settings';
import { Patient } from '@/types';
import { LayoutDashboard, Table2, LogOut, RefreshCw, Settings as SettingsIcon } from 'lucide-react';

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'table' | 'analytics' | 'settings'>('table');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);

  const checkAuth = () => {
    if (typeof window !== 'undefined') {
      const session = localStorage.getItem('drsunita_admin_session');
      if (session) setIsAuthenticated(true);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/patients');
      if (res.ok) {
        const data = await res.json();
        setPatients(data);
      }
    } catch (error) {
      console.error("Failed to fetch patients", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && activeTab !== 'settings') {
      fetchData();
    }
  }, [isAuthenticated, activeTab]);

  const handleLogin = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('drsunita_admin_session', 'valid');
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('drsunita_admin_session');
      setIsAuthenticated(false);
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white border-b border-[#A1534E]/10 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-4">
           <div className="text-xl font-bold text-[#A1534E]">Dr Sunita Aesthetics Dashboard</div>
           <div className="h-6 w-px bg-gray-200 mx-2"></div>
           <div className="flex bg-white rounded-lg p-1 overflow-x-auto">
             <button 
               onClick={() => setActiveTab('table')}
               className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'table' ? 'bg-white text-[#A1534E] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
             >
               <Table2 size={16} /> Data Table
             </button>
             <button 
               onClick={() => setActiveTab('analytics')}
               className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'analytics' ? 'bg-white text-[#A1534E] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
             >
               <LayoutDashboard size={16} /> Analytics
             </button>
             <button 
               onClick={() => setActiveTab('settings')}
               className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'settings' ? 'bg-white text-[#A1534E] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
             >
               <SettingsIcon size={16} /> Settings
             </button>
           </div>
        </div>
        <div className="flex items-center gap-3">
          {activeTab !== 'settings' && (
            <button 
              onClick={fetchData} 
              className="p-2 text-gray-400 hover:text-[#A1534E] rounded-full hover:bg-gray-50 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
          )}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-red-500 transition-colors"
          >
            <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>

      <main className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {activeTab === 'table' ? 'Patient Records' : activeTab === 'analytics' ? 'Marketing Insights' : 'Form Configuration'}
          </h2>
          <p className="text-gray-500">
            {activeTab === 'table' 
              ? `Showing ${patients.length} total submissions` 
              : activeTab === 'analytics' 
                ? 'Visualizing patient trends and attribution'
                : 'Manage options for the patient check-in form'}
          </p>
        </div>

        <div className="animate-fade-in">
          {activeTab === 'table' && <PatientTable data={patients} />}
          {activeTab === 'analytics' && <Analytics data={patients} />}
          {activeTab === 'settings' && <Settings />}
        </div>
      </main>
    </div>
  );
}

