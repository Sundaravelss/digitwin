import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, PieChart, Pie, LineChart, Line, Tooltip } from "recharts";
import { TrendingUp, Users, DollarSign, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { insurerDashboardData } from "@/data/patientData";

const iconConfig = [
  { icon: Users, iconBg: "bg-primary/10", iconColor: "text-primary" },
  { icon: Target, iconBg: "bg-success/10", iconColor: "text-success" },
  { icon: DollarSign, iconBg: "bg-warning/10", iconColor: "text-warning" },
  { icon: TrendingUp, iconBg: "bg-purple-500/10", iconColor: "text-purple-500" },
];

const kpiData = insurerDashboardData.kpis.map((kpi, i) => ({ ...kpi, ...iconConfig[i] }));
const enrollmentData = insurerDashboardData.enrollmentData;
const categoryData = insurerDashboardData.categoryData;

const InsurerPromosDashboard = () => {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {kpiData.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.title} className="health-card p-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/30" />
              <div className="flex items-center justify-between mb-3">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", kpi.iconBg)}>
                  <Icon className={cn("w-5 h-5", kpi.iconColor)} />
                </div>
                <span className={`text-sm font-medium ${kpi.positive ? 'text-success' : 'text-destructive'}`}>
                  {kpi.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">{kpi.value}</div>
              <div className="text-sm text-muted-foreground">{kpi.title}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-[1fr_340px] gap-6">
        {/* Enrollment Trend */}
        <div className="health-card p-6 animate-fade-in-up">
          <h3 className="font-semibold text-foreground mb-6">Enrollment Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={enrollmentData}>
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: 'hsl(var(--card))', 
                    border: 'none', 
                    borderRadius: '12px',
                    boxShadow: 'var(--shadow-md)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="health-card p-6 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
          <h3 className="font-semibold text-foreground mb-6">Category Breakdown</h3>
          <div className="h-48 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ background: cat.color }} />
                  <span className="text-sm text-muted-foreground">{cat.name}</span>
                </div>
                <span className="text-sm font-medium text-foreground">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsurerPromosDashboard;
