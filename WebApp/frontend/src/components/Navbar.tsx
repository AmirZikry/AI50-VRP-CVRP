import { useLocation, useNavigate } from "react-router-dom";
import { ChartBarIcon, HouseIcon, Route as RouteIcon, ChartPie } from "lucide-react";
import {
  MenuDock, MenuDockIcon, MenuDockItem, MenuDockLabel,
} from "@/components/ui/menu-dock";

const items = [
  { to: "/", label: "Solve", Icon: HouseIcon },
  { to: "/benchmark", label: "Benchmark", Icon: ChartBarIcon },
  { to: "", label:"Visualization", Icon: ChartPie}
];

export function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card/90 backdrop-blur-md px-6 py-3">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between">
        {/* logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
            <RouteIcon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-sm font-semibold leading-none tracking-tight text-foreground">
              CVRP Benchmark
            </h1>
            <p className="mt-0.5 text-[11px] text-muted-foreground">Team 4 · Optimization Lab</p>
          </div>
        </div>

        {/* navigation tab*/}
        <MenuDock
            aria-label="Main"
            value={pathname}
            onValueChange={(v) => navigate(v)}
            className="p-1 shadow-none"
            >
            {items.map(({ to, label, Icon }) => (
                <MenuDockItem key={to} value={to} className="min-w-0 flex-row gap-2 px-3 py-1">
                <MenuDockIcon><Icon className="size-4" /></MenuDockIcon>
                <MenuDockLabel>{label}</MenuDockLabel>
                </MenuDockItem>
            ))}
        </MenuDock>
      </div>
    </header>
  );
}