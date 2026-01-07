import type {inferOutput} from "@trpc/tanstack-react-query";
import {trpc} from "@/utils/trpc.ts";
import {DateTime} from "luxon";

export const formatDateString = (dateString: string) => {
    return DateTime.fromISO(dateString).toFormat("MM/dd/yyyy");
}

export const formatMedicationDateRange = (medication: inferOutput<typeof trpc.getCareRecipientMedicationsById>[number]) => {
    if(!medication.schedule.endDate) return `Started: ${formatDateString(medication.schedule.startDate)}`;
    return `${formatDateString(medication.schedule.startDate)} - ${formatDateString(medication.schedule.endDate)}`;
}