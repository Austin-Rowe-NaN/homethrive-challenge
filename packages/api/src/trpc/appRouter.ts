import { initTRPC } from '@trpc/server';
import {MedicationModel, zodMedication} from "@homethrive-challenge/api/schemas";

export const t = initTRPC.create();

export const appRouter = t.router({
    getMedications: t.procedure.query(async () => {
        try {
            console.log('Fetching medications...');
            return MedicationModel.find({})
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
    })
});

export type AppRouter = typeof appRouter;