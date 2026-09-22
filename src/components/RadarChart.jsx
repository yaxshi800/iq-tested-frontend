import {
  Radar, RadarChart as RC, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, ResponsiveContainer,
} from "recharts";

export default function CategoryRadar({ data }) {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RC data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis dataKey="category" tick={{ fill: "#cbd5e1", fontSize: 12 }} />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: "#64748b", fontSize: 10 }}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#818cf8"
            fill="#6366f1"
            fillOpacity={0.45}
          />
        </RC>
      </ResponsiveContainer>
    </div>
  );
}