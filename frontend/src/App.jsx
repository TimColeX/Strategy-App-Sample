import React, { useState } from 'react';
import {
    Target,
    BarChart3,
    AlertTriangle,
    Layers,
    TrendingUp,
    LayoutDashboard,
    Settings,
    Menu,
    ChevronDown
} from 'lucide-react';
import {
    LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

function App() {
    const [activeTab, setActiveTab] = useState('canvas');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Mock Data mimicking the "APAC Expansion" Strategy
    const strategyData = {
        title: "Corporate Strategy 2025-2027",
        status: "Active",
        themes: [
            {
                id: "1",
                title: "APAC Expansion",
                description: "Aggressive growth in Asian markets via M&A",
                health: "green",
                objectives: [
                    {
                        title: "Establish Regional HQ",
                        metric: "Operational Readiness",
                        progress: 75,
                        target: 100,
                        status: "green"
                    },
                    {
                        title: "Acquire Market Share",
                        metric: "Indian Market %",
                        progress: 8,
                        target: 15,
                        status: "amber"
                    }
                ]
            },
            {
                id: "2",
                title: "Digital Transformation",
                description: "AI-first operations model",
                health: "green",
                objectives: [
                    {
                        title: "Automate Support",
                        metric: "% Tickets AI-Handled",
                        progress: 45,
                        target: 60,
                        status: "green"
                    }
                ]
            }
        ]
    };

    const chartData = [
        { name: 'Jan', revenue: 4000, ebitda: 2400 },
        { name: 'Feb', revenue: 3000, ebitda: 1398 },
        { name: 'Mar', revenue: 2000, ebitda: 9800 },
        { name: 'Apr', revenue: 2780, ebitda: 3908 },
        { name: 'May', revenue: 1890, ebitda: 4800 },
        { name: 'Jun', revenue: 2390, ebitda: 3800 },
    ];

    return (
        <div className="flex h-screen bg-slate-950 text-slate-50 font-sans overflow-hidden">

            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col`}>
                <div className="p-6 flex items-center justify-between">
                    {sidebarOpen && <span className="text-xl font-bold tracking-tight text-indigo-400">Strategy<span className="text-white">OS</span></span>}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-slate-800 rounded">
                        <Menu className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <nav className="flex-1 px-3 space-y-2 mt-4">
                    <NavItem icon={<LayoutDashboard />} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} open={sidebarOpen} />
                    <NavItem icon={<Target />} label="Strategy Canvas" active={activeTab === 'canvas'} onClick={() => setActiveTab('canvas')} open={sidebarOpen} />
                    <NavItem icon={<Layers />} label="Initiatives" active={activeTab === 'initiatives'} onClick={() => setActiveTab('initiatives')} open={sidebarOpen} />
                    <NavItem icon={<AlertTriangle />} label="Risks & Assumptions" active={activeTab === 'risks'} onClick={() => setActiveTab('risks')} open={sidebarOpen} />
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center'}`}>
                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold">TC</div>
                        {sidebarOpen && <div className="text-sm"><p className="font-medium">Tim Cole</p><p className="text-xs text-slate-400">CSO</p></div>}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <header className="h-16 border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-8">
                    <div className="flex items-center gap-4">
                        <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20">Active Cycle</span>
                        <h1 className="text-lg font-semibold text-slate-100">{strategyData.title}</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-indigo-600/20">
                            Refresh Data
                        </button>
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto space-y-8">

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <MetricCard title="Total Revenue" value="$42.5M" change="+12.5%" trend="up" />
                        <MetricCard title="Strategic Health" value="85%" change="+2.1%" trend="up" />
                        <MetricCard title="Critical Risks" value="3" change="1 New" trend="down" isBad={true} />
                    </div>

                    {/* Canvas View */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold tracking-tight">Strategy Canvas</h2>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {strategyData.themes.map((theme) => (
                                <div key={theme.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all">
                                    <div className="flex items-start justify-between mb-6">
                                        <div>
                                            <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-3">
                                                {theme.title}
                                                <span className={`w-2 h-2 rounded-full ${theme.health === 'green' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                                            </h3>
                                            <p className="text-slate-400">{theme.description}</p>
                                        </div>
                                        <div className="px-3 py-1 bg-slate-800 rounded text-xs font-mono text-slate-400">Theme Owner: Board</div>
                                    </div>

                                    <div className="space-y-4">
                                        {theme.objectives.map((obj, i) => (
                                            <div key={i} className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex items-center justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="font-medium text-slate-200">{obj.title}</span>
                                                        <span className="text-xs text-slate-500">{obj.metric}</span>
                                                    </div>
                                                    <div className="w-full bg-slate-900 rounded-full h-2">
                                                        <div
                                                            className={`h-2 rounded-full ${obj.status === 'green' ? 'bg-indigo-500' : 'bg-amber-500'}`}
                                                            style={{ width: `${(obj.progress / obj.target) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                                <div className="ml-6 text-right">
                                                    <div className="text-sm font-bold text-white">{obj.progress}{obj.target === 100 ? '%' : ''}</div>
                                                    <div className="text-xs text-slate-500">Target: {obj.target}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Charts Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 h-80">
                            <h3 className="text-sm font-medium text-slate-400 mb-6">Revenue Trend</h3>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" stroke="#475569" tickLine={false} axisLine={false} />
                                    <YAxis stroke="#475569" tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                        itemStyle={{ color: '#818cf8' }}
                                    />
                                    <CartesianGrid vertical={false} stroke="#334155" strokeDasharray="3 3" />
                                    <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorPv)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 h-80 flex items-center justify-center">
                            <div className="text-center">
                                <AlertTriangle className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                                <p className="text-slate-400">Risk Assessment Module</p>
                                <p className="text-xs text-slate-600 mt-2">Connect to live API to load data</p>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}

function NavItem({ icon, label, active, onClick, open }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${active
                    ? 'bg-indigo-600/10 text-indigo-400'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
        >
            {React.cloneElement(icon, { size: 20 })}
            {open && <span className="text-sm font-medium">{label}</span>}
        </button>
    );
}

function MetricCard({ title, value, change, trend, isBad }) {
    const isUp = trend === 'up';
    const colorClass = isBad
        ? (isUp ? 'text-red-400' : 'text-green-400') // If "Risks" go up, it's bad (red)
        : (isUp ? 'text-green-400' : 'text-red-400'); // If "Revenue" goes up, it's good (green)

    const Icon = isUp ? TrendingUp : TrendingUp; // React Icon logic simplified

    return (
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl hover:bg-slate-900/80 transition-all">
            <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
            <div className="flex items-end justify-between">
                <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
                <div className={`flex items-center gap-1 text-sm font-medium ${colorClass} bg-slate-950 px-2 py-1 rounded border border-slate-800`}>
                    <span>{change}</span>
                </div>
            </div>
        </div>
    );
}

export default App;
