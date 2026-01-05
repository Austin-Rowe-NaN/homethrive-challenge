import {initTRPC} from '@trpc/server';
import {
    zodAddCompletedDoseInput,
    MedicationModel,
    zodMedication,
    zodCareRecipientId
} from "@homethrive-challenge/api/schemas";

export const t = initTRPC.create();

export const appRouter = t.router({
    getCareRecipientMedicationsById: t.procedure.input(zodCareRecipientId).query(async (opts) => {
        try {
            const { input: careRecipientId } = opts;
            return MedicationModel.find({careRecipientId})
        } catch (e){
            console.error(e);
            throw new Error('Failed to fetch medications');
        }
    }),
    createMedication: t.procedure.input(zodMedication).mutation(async (opts) => {
        try {
            const { input } = opts;
            return MedicationModel.create(input);
        } catch (e){
            console.error(e);
            throw new Error('Failed to create medication');
        }
    }),
    addCompletedDose: t.procedure.input(zodAddCompletedDoseInput).mutation(async (opts) => {
        try{
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
                                        $setUnion: ["$completedDoses", [doseDate]]
                                    },
                                    sortBy: 1
                                }
                            }
                        }
                    }
                ],
                { new: true, updatePipeline: true }
            );
        }
        catch(e){
            console.error(e);
            throw new Error('Failed to add completed dose');
        }
    })
});

export type AppRouter = typeof appRouter;