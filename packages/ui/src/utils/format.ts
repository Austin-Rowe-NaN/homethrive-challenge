import type {inferOutput} from "@trpc/tanstack-react-query";
import {trpc} from "@/utils/trpc.ts";
import {DateTime, type WeekdayNumbers} from "luxon";

export const formatDateString = (dateString: string) => {
    return DateTime.fromISO(dateString).toFormat("MM/dd/yyyy");
}

type InferredMedication = inferOutput<typeof trpc.getCareRecipientMedicationsById>[number];

export const formatMedicationDateRange = (medication: InferredMedication) => {
    if(!medication.schedule.endDate) return `Started: ${formatDateString(medication.schedule.startDate)}`;
    return `${formatDateString(medication.schedule.startDate)} - ${formatDateString(medication.schedule.endDate)}`;
};

export const formatHour = (hour: number) => {
    if(hour < 0 || hour > 23) {
        console.error(`Invalid hour: ${hour}`);
        return 'Invalid hour';
    }
    return DateTime.fromObject({hour}).toFormat("h a");
}

export const formatWeekDayNumber = (dayNumber: number) => {
    if(dayNumber < 1 || dayNumber > 7) {
        console.error(`Invalid day number: ${dayNumber}`);
        return 'Invalid day';
    }
    return DateTime.fromObject({weekday: dayNumber as WeekdayNumbers}).toFormat("ccc");
};

export const formatMedicationDoseInstructions = (medication: InferredMedication) => {
    const time = formatHour(medication.schedule.timeOfDay);
    switch (medication.schedule.recurrence) {
        case "DAILY":
            return `Take daily at ${time}`;
        case "WEEKLY":
            if(!medication.schedule.daysOfWeek || medication.schedule.daysOfWeek.length === 0) {
                return `Take weekly`;
            }
            const days = medication.schedule.daysOfWeek
            .map(formatWeekDayNumber).join(", ")
            return `${days}-${time}`;
        default:
            return `Take on an unknown schedule`;
    }
}