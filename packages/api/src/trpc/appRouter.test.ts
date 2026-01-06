import { describe, it, expect, vi, beforeEach } from 'vitest';
import { appRouter } from './appRouter';
import {
    MedicationModel,
} from "@homethrive-challenge/api/schemas";
import {Recurrence} from "@homethrive-challenge/api/types";

vi.mock("@homethrive-challenge/api/schemas", async (importOriginal) => {
    const originalModule: any = await importOriginal();
    return {
        MedicationModel: {
            find: vi.fn(),
            create: vi.fn(),
            findByIdAndUpdate: vi.fn(),
        },
        zodCareRecipientId: vi.fn(originalModule.zodCareRecipientId),
        zodMedication: vi.fn(originalModule.zodMedication),
        zodAddCompletedDoseInput: vi.fn(originalModule.zodAddCompletedDoseInput),
    };
});

describe('appRouter', () => {
    const appRouterCaller = appRouter.createCaller({});
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getCareRecipientMedicationsById', () => {
        it('should call MedicationModel.find with correct careRecipientId and return the result', async () => {
            const mockMedications = [{ id: '1' }, { id: '2' }];
            vi.spyOn(MedicationModel, 'find').mockResolvedValueOnce(mockMedications as unknown as Awaited<ReturnType<typeof MedicationModel.find>>);

            const result = await appRouterCaller.getCareRecipientMedicationsById(1234);

            expect(MedicationModel.find).toHaveBeenCalledWith({ careRecipientId: 1234 });
            expect(result).toEqual(mockMedications);
        })

        it("should throw an error if it's passed something other than a number", async () => {
            await expect(appRouterCaller.getCareRecipientMedicationsById("not-a-number" as unknown as number)).rejects.toThrow();
            await expect(appRouterCaller.getCareRecipientMedicationsById({random: true} as unknown as number)).rejects.toThrow();
            await expect(appRouterCaller.getCareRecipientMedicationsById(['not-a-number'] as unknown as number)).rejects.toThrow();
            await expect(appRouterCaller.getCareRecipientMedicationsById([1] as unknown as number)).rejects.toThrow();
        })
    });

    describe('createMedication', () => {
        it('should call MedicationModel.create with correct input and return the created medication', async () => {
            const mockInput = {
                name: "new_med",
                careRecipientId: 2193,
                schedule: {
                    recurrence: Recurrence.WEEKLY,
                    timeOfDay: 9,
                    daysOfWeek: [3,5,7],
                    startDate: "2024-06-10T00:00:00.000Z",
                    endDate: "2024-06-10T00:00:00.000Z"
                }
            };
            const mockResult = { ...mockInput, _id: 'med-id' };
            vi.spyOn(MedicationModel, 'create').mockResolvedValueOnce(mockResult as unknown as Awaited<ReturnType<typeof MedicationModel.create>>);

            const result = await appRouterCaller.createMedication(mockInput);

            expect(MedicationModel.create).toHaveBeenCalledWith({...mockInput, schedule: {
                ...mockInput.schedule,
                // this is important because it ensures it's properly converting string dates to Date objects
                startDate: new Date(mockInput.schedule.startDate),
                endDate: new Date(mockInput.schedule.endDate)
            }});
            expect(result).toEqual(mockResult);
        });

        it('should throw an error if the recurrence is WEEKLY and daysOfWeek is missing', async () => {
            await expect(appRouterCaller.createMedication({
                name: "new_med",
                careRecipientId: 2193,
                schedule: {
                    recurrence: Recurrence.WEEKLY,
                    timeOfDay: 9,
                    startDate: "2024-06-10T00:00:00.000Z",
                    endDate: "2024-06-10T00:00:00.000Z"
                }
            })).rejects.toThrow();
        })
    })

    describe('addCompletedDose', () => {
        it('should call MedicationModel.findByIdAndUpdate with correct input and return the updated medication', async () => {
            const mockInput = {
                medicationId: "695b5a18fc81705c183c6b6d",
                doseDate: "2024-06-09"
            };
            const mockUpdated = { id: 'med-id', completedDoses: ['2024-06-10'] };
            vi.spyOn(MedicationModel, 'findByIdAndUpdate').mockResolvedValueOnce(mockUpdated as unknown as Awaited<ReturnType<typeof MedicationModel.findByIdAndUpdate>>);

            const result = await appRouterCaller.addCompletedDose(mockInput);

            expect(MedicationModel.findByIdAndUpdate).toHaveBeenCalledWith(
                mockInput.medicationId,
                [
                    {
                        $set: {
                            completedDoses: {
                                $sortArray: {
                                    input: {
                                        $setUnion: ["$completedDoses", [new Date(mockInput.doseDate)]] // once again, important that date string is converted to Date object
                                    },
                                    sortBy: 1
                                }
                            }
                        }
                    }
                ],
                { new: true, updatePipeline: true });
            expect(result).toEqual(mockUpdated);
        })
    })
});

