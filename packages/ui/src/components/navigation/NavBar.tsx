import {ModeToggle} from "@/components/ThemeToggle.tsx";
import {MobileNav} from "@/components/navigation/MobileNav.tsx";

export default function NavBar() {
  return (
    <div className="bg-primary text-primary-foreground h-[60px] flex items-center">
      <div className="flex justify-between items-center container mx-auto px-4">
        <p className="text-xl font-medium">Medication Manager</p>
          <span className="@max-xl/App:hidden"><ModeToggle /></span>
          <MobileNav triggerClassName="@max-xl/App:block hidden" />
      </div>
    </div>
  );
}
