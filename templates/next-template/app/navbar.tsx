"use client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, Sun, Moon, Monitor, Languages } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const handleThemeChange = (selectedTheme: "light" | "dark" | "system") => {
      setTheme(selectedTheme); 
  };
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 items-center px-4 sm:px-6 lg:px-8">
        <a href="/" className="mr-2 flex items-center space-x-1">
          <img src="/photes-icon-1.svg" alt="Logo" className="h-8 w-8" />
          <span className="hidden font-bold sm:inline-block">Photos</span>
        </a>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <a href="/" className="w-full">
                  Photos
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a href="/pricing" className="w-full">
                  Pricing
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a href="/workspace" className="w-full">
                  Workspace
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a href="/tools" className="w-full">
                  Tools
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a href="/contacts" className="w-full">
                  Contacts
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a href="/explore" className="w-full">
                  Explore
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a href="/usecases" className="w-full">
                  Use Cases
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        <div className="mr-4 space-x-1 hidden lg:flex">   
          <nav className="flex items-center space-x-1 text-sm">
            <a href="/pricing" className="hover:bg-secondary rounded-md p-2">Pricing</a>
            <a href="/workspace" className="flex items-center space-x-1 hover:bg-secondary rounded-md p-2">
              <span className="">Workspace</span>
              <span className="bg-primary text-white px-1 rounded-lg transition hidden lg:inline">
                Get Started
              </span>
            </a>
            <a href="/tools" className="hover:bg-secondary rounded-md p-2">Tools</a>
            <a href="/contacts" className="hover:bg-secondary rounded-md p-2">Contacts</a>
            <a href="/explore" className="hover:bg-secondary rounded-md p-2">Explore</a>
            <a href="/usecases" className="hover:bg-secondary rounded-md p-2">Use Cases</a>
          </nav>
        </div>
        <div className="flex flex-1 items-center space-x-1 justify-end">
          <Button variant="outline">Feedback</Button>
          <a 
            href="/credits" 
            className="items-center text-sm hover:bg-secondary rounded-md p-2"
          >
            <div>
              <span>Credits</span>
              <span className="ml-1 hidden xl:inline">17953 / 18000</span>
            </div>
          </a>
          <button
            aria-label="Change Language"
            className="w-4 h-4 flex items-center justify-center hover:bg-secondary rounded-md"
          >
            <Languages className="h-4 w-4" />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Toggle theme">
                {theme === "dark" ? (
                  <Moon className="h-5 w-5" />
                ) : theme === "light" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Monitor className="h-5 w-5" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleThemeChange("light")}>
                <Sun className="mr-2 h-4 w-4" />
                <span>Light</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleThemeChange("dark")}>
                <Moon className="mr-2 h-4 w-4" />
                <span>Dark</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleThemeChange("system")}>
                <Monitor className="mr-2 h-4 w-4" />
                <span>System</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <a 
            href="/profile" 
            className="block"
            aria-label="View Profile"
          >
            <Avatar className="border border-secondary">
              <AvatarImage
                alt="Author"
                src="https://ui.convertfa.st/avatars/avatar-1.svg"
              />
              <AvatarFallback>Emily Chen</AvatarFallback>
            </Avatar>
          </a>
        </div>
      </div>
    </header>
  );
}
