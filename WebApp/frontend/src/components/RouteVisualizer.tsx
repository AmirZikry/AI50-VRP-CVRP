import { useState, useMemo } from "react";
import { useRunStore } from "@/store/runStore";

/* ── colour palette for routes ─────────────────────────────── */
const ROUTE_COLORS = [
  "#3b82f6", "#ef4444", "#22c55e", "#f59e0b", "#8b5cf6",
  "#ec4899", "#14b8a6", "#f97316", "#6366f1", "#06b6d4",
  "#84cc16", "#e11d48", "#0ea5e9", "#a855f7", "#10b981",
  "#d946ef", "#eab308", "#64748b", "#f43f5e", "#2dd4bf",
  "#7c3aed", "#fb923c", "#0284c7", "#c026d3", "#16a34a",
];

/* ── Tooltip floating card ─────────────────────────────────── */
function NodeTooltip({
  x, y, nodeIdx, demand, coord,
}: { x: number; y: number; nodeIdx: number; demand: number; coord: [number, number] }) {
  return (
    <g>
      <foreignObject x={x + 8} y={y - 40} width={170} height={68}>
        <div
          style={{
            background: "white",
            border: "1px solid #dce4ee",
            borderRadius: 8,
            padding: "6px 10px",
            fontSize: 11,
            lineHeight: 1.5,
            boxShadow: "0 4px 12px rgba(0,0,0,.12)",
            pointerEvents: "none",
          }}
        >
          <div style={{ fontWeight: 700 }}>
            {nodeIdx === 0 ? "Depot" : `Customer ${nodeIdx}`}
          </div>
          <div style={{ color: "#64748b" }}>
            Demand: {demand} &nbsp;|&nbsp; ({coord[0]}, {coord[1]})
          </div>
        </div>
      </foreignObject>
    </g>
  );
}

export default function RouteVisualizer() {
  const run = useRunStore((s) => s.currentRun);
  const instanceData = useRunStore((s) => s.instanceData);
  const [activeRoute, setActiveRoute] = useState<number | null>(null);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  /* ── derived geometry ─────────────────────────────────────── */
  const { nodes, viewBox, scale } = useMemo(() => {
    if (!instanceData?.coords || instanceData.coords.length === 0)
      return { nodes: [], viewBox: "0 0 600 400", scale: 1 };

    const coords = instanceData.coords;
    const xs = coords.map((c) => c[0]);
    const ys = coords.map((c) => c[1]);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const PAD = 40;
    const W = 600;
    const H = 400;
    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;
    const sc = Math.min((W - 2 * PAD) / rangeX, (H - 2 * PAD) / rangeY);

    const mapped = coords.map(([cx, cy], i) => ({
      idx: i,
      sx: PAD + (cx - minX) * sc,
      sy: H - PAD - (cy - minY) * sc, // flip Y so up is up
      demand: instanceData.demands?.[i] ?? 0,
      coord: [cx, cy] as [number, number],
    }));

    return { nodes: mapped, viewBox: `0 0 ${W} ${H}`, scale: sc };
  }, [instanceData]);

  /* ── no data guard ────────────────────────────────────────── */
  if (!run || !instanceData) {
    return (
      <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
        Run a solver to display routes
      </div>
    );
  }

  if (nodes.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
        No coordinate data available for this instance
      </div>
    );
  }

  const routes = run.routes ?? [];
  const hovered = hoveredNode !== null ? nodes[hoveredNode] : null;

  return (
    <div className="h-full w-full flex flex-col gap-2 overflow-hidden">
      {/* ── Route legend / selector ───────────────────────────── */}
      <div className="shrink-0 flex flex-wrap gap-1.5 px-1">
        <button
          onClick={() => setActiveRoute(null)}
          className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors cursor-pointer ${
            activeRoute === null
              ? "bg-foreground text-card border-foreground"
              : "bg-card text-muted-foreground border-border hover:border-foreground/40"
          }`}
        >
          All
        </button>
        {routes.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveRoute(activeRoute === i ? null : i)}
            className="text-[10px] px-2 py-0.5 rounded-full border transition-colors cursor-pointer"
            style={{
              background: activeRoute === i ? ROUTE_COLORS[i % ROUTE_COLORS.length] : "white",
              color: activeRoute === i ? "white" : ROUTE_COLORS[i % ROUTE_COLORS.length],
              borderColor: ROUTE_COLORS[i % ROUTE_COLORS.length],
            }}
          >
            R{i + 1}
          </button>
        ))}
      </div>

      {/* ── SVG Canvas ────────────────────────────────────────── */}
      <svg
        viewBox={viewBox}
        className="flex-1 min-h-0 w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Route edges */}
        {routes.map((route, ri) => {
          const show = activeRoute === null || activeRoute === ri;
          const color = ROUTE_COLORS[ri % ROUTE_COLORS.length];
          const opacity = activeRoute === null ? 0.6 : show ? 1 : 0.08;
          const width = show && activeRoute !== null ? 2.5 : 1.4;

          const pts = route
            .filter((idx) => idx < nodes.length)
            .map((idx) => `${nodes[idx].sx},${nodes[idx].sy}`)
            .join(" ");

          return (
            <polyline
              key={`route-${ri}`}
              points={pts}
              fill="none"
              stroke={color}
              strokeWidth={width}
              strokeOpacity={opacity}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          );
        })}

        {/* Customer nodes */}
        {nodes.map((n) => {
          const isDepot = n.idx === 0;
          const inActiveRoute =
            activeRoute !== null && routes[activeRoute]?.includes(n.idx);
          const dimmed = activeRoute !== null && !inActiveRoute && !isDepot;

          return (
            <circle
              key={n.idx}
              cx={n.sx}
              cy={n.sy}
              r={isDepot ? 6 : 3.5}
              fill={isDepot ? "#ef4444" : dimmed ? "#cbd5e1" : "#3973b9"}
              stroke={isDepot ? "#fff" : "none"}
              strokeWidth={isDepot ? 2 : 0}
              opacity={dimmed ? 0.3 : 1}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode(n.idx)}
              onMouseLeave={() => setHoveredNode(null)}
            />
          );
        })}

        {/* Depot label */}
        {nodes.length > 0 && (
          <text
            x={nodes[0].sx}
            y={nodes[0].sy - 10}
            textAnchor="middle"
            fontSize={9}
            fontWeight={700}
            fill="#ef4444"
          >
            Depot
          </text>
        )}

        {/* Tooltip */}
        {hovered && (
          <NodeTooltip
            x={hovered.sx}
            y={hovered.sy}
            nodeIdx={hovered.idx}
            demand={hovered.demand}
            coord={hovered.coord}
          />
        )}
      </svg>
    </div>
  );
}
