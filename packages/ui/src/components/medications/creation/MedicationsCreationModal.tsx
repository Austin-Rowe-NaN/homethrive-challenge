import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {PlusIcon} from "lucide-react";
import MedicationCreateForm from "@/components/medications/creation/MedicationCreationForm.tsx";
import {useState} from "react";
import {Spinner} from "@/components/ui/spinner.tsx";

export default function MedicationsCreationModal(){
    const formId = "medication-create-form";
    const [formSubmitting, setFormSubmitting] = useState(false);
 return (
   <Dialog>
     <DialogTrigger>
       <Button size="icon-sm">
         <PlusIcon />
       </Button>
     </DialogTrigger>
     <DialogContent>
       <DialogHeader>
         <DialogTitle>Add a Medication</DialogTitle>
       </DialogHeader>
       <DialogContent>
           <MedicationCreateForm formId={formId} submitting={formSubmitting} setSubmitting={setFormSubmitting} />
           <DialogFooter>
               <DialogClose asChild>
                   <Button variant="outline">Cancel</Button>
               </DialogClose>
               <Button type="submit" form={formId}>Save changes{formSubmitting && <Spinner />}</Button>
           </DialogFooter>
       </DialogContent>
     </DialogContent>
   </Dialog>
 );
}