import { Medication } from "@homethrive-challenge/api/schemas";
import { DateTime } from "luxon";
import { Types } from "mongoose";
import { Dose } from "@homethrive-challenge/api/types";
import { normalizeDate } from "@homethrive-challenge/api/utils/normalize-date";

export const generateSingleMedicationDoseForDate = (
  medication: Medication & { _id: Types.ObjectId },
  passedDate: Date
): Dose | null => {
  const date = normalizeDate(passedDate);
  const completedDosesMatchingDate = medication.completedDoses?.filter(
    (doseDate) => normalizeDate(doseDate).toString() === date.toString()
  );
  // we currently only support 1 dose per day so if there is a completed dose for that date, return it as completed
  if (completedDosesMatchingDate && completedDosesMatchingDate?.length > 0)
    return {
      medicationId: medication._id.toString(),
      doseDate: completedDosesMatchingDate[0],
      completed: true,
    };

  // given date falls outside of medication date range
  if (
    normalizeDate(medication.schedule.startDate) > date ||
    (medication.schedule.endDate &&
      normalizeDate(medication.schedule.endDate) < date)
  )
    return null;

  // given date does not match days of week for weekly medications
  if (
    medication.schedule.daysOfWeek &&
    !medication.schedule.daysOfWeek.includes(DateTime.fromJSDate(date).weekday)
  )
    return null;

  return {
    medicationId: medication._id.toString(),
    doseDate: date,
    completed: false,
  };
};
