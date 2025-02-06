import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, Sun, Moon } from "lucide-react";

import { useTheme } from "@/components/theme-provider";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto flex h-14 items-center px-4 sm:px-6 lg:px-8">
        <div className="mr-4 hidden md:flex">
          <a href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">Convert Fast</span>
          </a>
          <nav className="flex items-center space-x-6 text-sm">
            <a href="/about">Documents</a>
            <a href="/products">Components</a>
            <a href="/contact">Contact</a>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="flex items-center space-x-4 md:w-auto md:flex-none">
            <Button variant="outline">Sign In</Button>
            <div
              className="w-14 h-8 rounded-full p-1 cursor-pointer bg-secondary"
              onClick={toggleTheme}
            >
              <div
                className={`absolute flex items-center justify-center w-6 h-6 rounded-full bg-white shadow transition-transform ${
                  theme === "dark" ? "translate-x-6" : "translate-x-0"
                }`}
              >
                {theme === "dark" ? (
                  <Moon className="h-4 w-4 text-primary-foreground" />
                ) : (
                  <Sun className="h-4 w-4 text-primary" />
                )}
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <a href="/about" className="w-full">
                  About
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a href="/products" className="w-full">
                  Products
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a href="/contact" className="w-full">
                  Contact
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
