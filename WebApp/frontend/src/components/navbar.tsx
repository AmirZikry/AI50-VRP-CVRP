import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

export function Navbar() {
  return (
    <header className="border-b px-6 py-3 flex items-center justify-between">
      <div className="font-bold text-lg">MyApp</div>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Features</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4">
                <li>
                  <NavigationMenuLink asChild>
                    <a className="block p-2 hover:bg-accent rounded-md" href="#optimizer">
                      <div className="font-medium">Optimizer</div>
                      <p className="text-sm text-muted-foreground">Route and fleet calculations</p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <a className="block p-2 hover:bg-accent rounded-md" href="#benchmarks">
                      <div className="font-medium">Benchmarks</div>
                      <p className="text-sm text-muted-foreground">CVRP benchmark metrics</p>
                    </a>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <a href="#docs" className={navigationMenuTriggerStyle()}>
              Documentation
            </a>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  )
}