import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from "recharts";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { statisticsChartData } from "@/data/patientData";

const StatisticsChart = () => {
  const [timeRange, setTimeRange] = useState<"weekly" | "monthly">("weekly");
  const data = timeRange === "weekly" ? statisticsChartData.weekly : statisticsChartData.monthly;
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="health-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Statistics</h3>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-secondary">
              {timeRange === "weekly" ? "Weekly" : "Monthly"}
              <ChevronDown className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setTimeRange("weekly")}>Weekly</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange("monthly")}>Monthly</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
            <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="h-[220px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="20%">
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--primary) / 0.7)" />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              dy={10}
            />
            <YAxis hide />
            <Tooltip
              cursor={{ fill: 'hsl(var(--secondary))' }}
              contentStyle={{
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
              formatter={(value: number | undefined) => {
                if (value === undefined) return ['', ''];
                if (timeRange === "weekly") return [`${value} min`, 'Active Minutes'];
                return [`${value.toLocaleString()} steps`, 'Avg Steps'];
              }}
            />
            <Bar 
              dataKey="value" 
              radius={[8, 8, 0, 0]}
              maxBarSize={40}
              animationBegin={200}
              animationDuration={800}
              animationEasing="ease-out"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  fill={entry.highlighted ? 'url(#barGradient)' : 'hsl(var(--primary) / 0.15)'}
                  className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatisticsChart;
