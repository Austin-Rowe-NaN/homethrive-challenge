import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {PlusIcon} from "lucide-react";
import MedicationCreateForm from "@/components/medications/creation/MedicationCreationForm.tsx";
import {useState} from "react";

export default function MedicationsCreationModal(){
    const [open, setOpen] = useState(false);
 return (
   <Dialog open={open} onOpenChange={setOpen}>
     <DialogTrigger >
       <Button size="icon-sm">
         <PlusIcon />
       </Button>
     </DialogTrigger>
     <DialogContent>
       <DialogHeader>
         <DialogTitle>Add a Medication</DialogTitle>
       </DialogHeader>
       <DialogContent>
           <MedicationCreateForm onSuccess={() => setOpen(false)} />
       </DialogContent>
     </DialogContent>
   </Dialog>
 );
}