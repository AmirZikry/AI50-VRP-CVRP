import { NavLink } from "react-router-dom";
import { Route } from "lucide-react"; 

const links = [
  { to: "/", label: "Home" },
  { to: "/benchmark", label: "Benchmark" },
  { to: "/compare", label: "Visualization" },
];

export function Navbar() {
  return (
    <header className=" bg-foreground sticky top-0 z-40 w-full border-b border-border bg-card/80 backdrop-blur-md px-6 py-3">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between">
        
        {/* logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary">
            <Route className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-sm font-semibold tracking-tight leading-none text-primary-foreground">
              CVRP Benchmark
            </h1>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Team 4 · Optimization Lab
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center bg-muted/60 p-1 rounded-lg border border-border/50">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `px-3.5 py-1.5 text-xs font-medium rounded-md transition-all ${
                  isActive
                    ? "bg-card text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/40"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}