import { initTRPC } from "@trpc/server";
import {
  zodAddCompletedDoseInput,
  MedicationModel,
  zodMedication,
  zodCareRecipientId,
  zodGetCareRecipientDoses,
} from "@homethrive-challenge/api/schemas";
import {
  generateSingleMedicationDoseForDate,
  normalizeDate,
} from "@homethrive-challenge/api/utils";
import { Dose } from "@homethrive-challenge/api/types";

export const t = initTRPC.create();

export const appRouter = t.router({
  getCareRecipientMedicationsById: t.procedure
    .input(zodCareRecipientId)
    .query(async (opts) => {
      try {
        const { input: careRecipientId } = opts;
        return MedicationModel.find({ careRecipientId }).lean();
      } catch (e) {
        console.error(e);
        throw new Error("Failed to fetch medications");
      }
    }),
  getCareRecipientDosesForGivenDate: t.procedure
    .input(zodGetCareRecipientDoses)
    .query(async (opts): Promise<Dose[]> => {
      const {
        input: { careRecipientId, date: passedDate },
      } = opts;
      const date = normalizeDate(passedDate);
      const medicationsWithinDate = await MedicationModel.find({
        careRecipientId,
        "schedule.startDate": { $lte: date },
        $or: [
          { "schedule.endDate": { $gte: date } },
          { "schedule.endDate": { $exists: false } },
        ],
      }).lean();

      return medicationsWithinDate
        .map((med) => generateSingleMedicationDoseForDate(med, date))
        .filter(
          (medicationDose) =>
            !!(
              medicationDose &&
              normalizeDate(medicationDose.doseDate).toString() ===
                date.toString()
            )
        ) as unknown as Dose[];
    }),
  createMedication: t.procedure.input(zodMedication).mutation(async (opts) => {
    try {
      const { input } = opts;
      const newMedication = await MedicationModel.create(input);
      return newMedication.toObject();
    } catch (e) {
      console.error(e);
      throw new Error("Failed to create medication");
    }
  }),
  addCompletedDose: t.procedure
    .input(zodAddCompletedDoseInput)
    .mutation(async (opts) => {
      try {
        const { input } = opts;
        const { medicationId, doseDate } = input;
        // Add doseDate, ensure uniqueness and ascending order
        return MedicationModel.findByIdAndUpdate(
          medicationId,
          [
            {
              $set: {
                completedDoses: {
                  $sortArray: {
                    input: {
                      $setUnion: ["$completedDoses", [normalizeDate(doseDate)]],
                    },
                    sortBy: 1,
                  },
                },
              },
            },
          ],
          { new: true, updatePipeline: true, lean: true }
        );
      } catch (e) {
        console.error(e);
        throw new Error("Failed to add completed dose");
      }
    }),
});

export type AppRouter = typeof appRouter;
