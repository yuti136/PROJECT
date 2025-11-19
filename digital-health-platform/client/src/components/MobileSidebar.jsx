// client/src/components/MobileSidebar.jsx
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function MobileSidebar() {
  const role = localStorage.getItem("role");

  const links = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/appointments/patient", label: "Appointments" },
    { href: "/patients", label: "Patients" },
    { href: "/reports", label: "Reports" },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" className="px-2">
          ☰
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-64 p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="text-blue-600">
            Digital Health Platform
          </SheetTitle>
        </SheetHeader>

        {/* NAV LINKS */}
        <nav className="p-4 space-y-2">
          {links.map((l) => {
            if (l.href === "/patients" && role !== "provider") return null;

            return (
              <a
                key={l.href}
                href={l.href}
                className="block px-3 py-2 rounded hover:bg-gray-100"
              >
                {l.label}
              </a>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("role");
              window.location.href = "/login";
            }}
          >
            Logout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
