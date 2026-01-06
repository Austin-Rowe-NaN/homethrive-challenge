import NavBar from "@/components/navigation/NavBar.tsx";
import DosesCard from "@/components/doses/DosesCard.tsx";
import MedicationsCard from "@/components/medications/MedicationsCard.tsx";

/*
TODO - Integrate with API
 */
export default function App() {

  return (
    <div className="h-screen w-screen overflow-hidden @container/App">
      <NavBar />
      <div className="h-[calc(100vh-50px)]">
        <div className="flex h-full justify-between container mx-auto px-4 py-8 gap-6">
          <MedicationsCard />
          <DosesCard />
        </div>
      </div>
    </div>
  );
}
