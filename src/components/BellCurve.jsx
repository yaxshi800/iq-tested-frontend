import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, ReferenceDot, CartesianGrid,
} from "recharts";
import { useTranslation } from "react-i18next";

function buildBellCurve() {
  const data = [];
  for (let x = 55; x <= 145; x += 2) {
    const y =
      (1 / (15 * Math.sqrt(2 * Math.PI))) *
      Math.exp(-0.5 * Math.pow((x - 100) / 15, 2));
    data.push({ x, y: +(y * 1000).toFixed(3) });
  }
  return data;
}

export default function BellCurve({ iq }) {
  const { t } = useTranslation();
  const data = buildBellCurve();
  const nearest = data.reduce((a, p) =>
    Math.abs(p.x - iq) < Math.abs(a.x - iq) ? p : a
  );

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="x" stroke="#64748b" tick={{ fontSize: 12 }} />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              background: "rgba(15,23,42,0.95)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12,
              color: "#e2e8f0",
            }}
            labelFormatter={(v) => `IQ ${v}`}
          />
          <Line type="monotone" dataKey="y" stroke="#818cf8" strokeWidth={2.5} dot={false} />
          <ReferenceDot
            x={iq}
            y={nearest.y}
            r={7}
            fill="#f472b6"
            stroke="#fff"
            strokeWidth={2}
            label={{
              value: t("results.your_position"),
              position: "top",
              fill: "#fbcfe8",
              fontSize: 12,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}