import {ModeToggle} from "@/components/ThemeToggle.tsx";

export default function NavBar() {
  return (
    <div className="bg-primary text-primary-foreground flex justify-center py-2">
      <div className="flex justify-between items-center container">
        <p className="text-xl font-medium">Medication Manager</p>
        <ModeToggle />
      </div>
    </div>
  );
}
