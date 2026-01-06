import {Button} from "@/components/ui/button"
import {Sheet, SheetContent, SheetTrigger,} from "@/components/ui/sheet"
import { Menu } from 'lucide-react';
import {ModeToggle} from "@/components/theme/ThemeToggle.tsx";
import {useContext, useState} from "react";
import {MobileAppViewContext} from "@/contexts/mobile-app-view-context.tsx";
import {cn} from "@/lib/utils.ts";

export function MobileNav({triggerClassName}: {triggerClassName?: string}) {
    const [open, setOpen] = useState(false);
    const {mobileView, setMobileView} = useContext(MobileAppViewContext);
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className={triggerClassName}>
                <Button variant="ghost"><Menu /></Button>
            </SheetTrigger>
            <SheetContent className="pt-12 gap-0">
                <Button variant="ghost" className={cn('rounded-none', {
                    "bg-primary/20": mobileView === 'medications'
                })} onClick={() => {
                    setMobileView('medications');
                    setOpen(false);
                }}>Medications</Button>
                <Button variant="ghost" className={cn('rounded-none', {
                    "bg-primary/20": mobileView === 'doses'
                })} onClick={() => {
                    setMobileView('doses');
                    setOpen(false);
                }}>Doses</Button>
                <span className="absolute bottom-5 right-5"><ModeToggle /></span>
            </SheetContent>
        </Sheet>
    )
}
