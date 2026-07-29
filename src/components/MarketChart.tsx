import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";

interface MarketChartProps {
  chartData: {
    name: string;
    value: number; // in millions
    label: string;
  }[];
}

export default function MarketChart({ chartData }: MarketChartProps) {
  // Color palette for TAM, SAM, SOM (Golds & Bronzes)
  const COLORS = {
    TAM: "#544630", // Deepest Gold/Bronze (gold-800)
    SAM: "#8b7651", // Muted Gold (gold-600)
    SOM: "#a38e64", // Signature Bright Gold (gold-500)
  };

  const formattedData = chartData.map((item) => ({
    ...item,
    color: COLORS[item.name as keyof typeof COLORS] || "#a38e64",
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-950 border border-slate-200 p-3.5 rounded-sm shadow-2xl text-neutral-900 text-xs font-sans">
          <p className="font-bold text-sm mb-1 text-gold-500">{data.name} Analysis</p>
          <p className="text-neutral-900/80">
            Estimated Value: <span className="font-mono text-gold-600 font-bold">{data.label}</span>
          </p>
          <p className="text-[10px] text-neutral-900/50 mt-1.5 max-w-[200px] leading-relaxed">
            {data.name === "TAM" && "The total global demand if you had 100% market share."}
            {data.name === "SAM" && "The segment of the total market that fits your product and geography."}
            {data.name === "SOM" && "The realistic portion of SAM you can capture within 2-3 years."}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
      <div className="w-full h-[420px] bg-slate-900 p-6 rounded-sm border border-neutral-900/5 shadow-inner">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-gold-500/80">
          TAM / SAM / SOM Market Breakdown
        </h4>
        <span className="text-[9px] uppercase tracking-widest font-mono text-neutral-900/30">Values in Millions ($ USD)</span>
      </div>
      <div className="w-full h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={formattedData}
            margin={{ top: 10, right: 15, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.08)" />
            <XAxis
              dataKey="name"
              stroke="rgba(0,0,0,0.45)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="rgba(0,0,0,0.45)"
              fontSize={9}
              width={55}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => {
                  if (value >= 1000) {
                 return `$${(value / 1000).toFixed(1)}B`;
               }

               return `$${value}M`;
            }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.03)" }} />
            <Bar dataKey="value" radius={[2, 2, 0, 0]} barSize={44}>
              {formattedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-6 mt-1 text-[11px] uppercase tracking-wider font-semibold">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-[#544630] border border-slate-200"></span>
          <span className="text-neutral-900/60">TAM</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-[#8b7651] border border-slate-200"></span>
          <span className="text-neutral-900/60">SAM</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-[#a38e64] border border-slate-200"></span>
          <span className="text-neutral-900/60">SOM</span>
        </div>
      </div>
    </div>
  );
}