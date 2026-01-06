import {cn} from "@/lib/utils.ts";
import {Card} from "@/components/ui/card.tsx";
import {type MobileAppView, MobileAppViewContext} from "@/contexts/mobile-app-view-context.tsx";
import {type ReactNode, useContext} from "react";

export default function MedicationsDosesCard({cardType, cardHeader, cardContent}: { cardType: MobileAppView; cardHeader: ReactNode; cardContent: ReactNode; }) {
    const { mobileView } = useContext(MobileAppViewContext);

    return (
        <Card
            className={cn(
                "h-full overflow-y-auto",
                {
                    "@max-xl/App:hidden": mobileView !== cardType,
                    "@max-xl/App:w-full @xl/App:basis-1/2 @3xl/App:basis-1/3 @6xl/App:basis-1/4": cardType === 'medications',
                    "@max-xl/App:w-full @xl/App:basis-1/2 @3xl/App:basis-2/3 @6xl/App:basis-3/4 @container/MedicationsCard": cardType === 'doses'
                }
            )}
        >
            {cardHeader}
            {cardContent}
        </Card>
    )
}