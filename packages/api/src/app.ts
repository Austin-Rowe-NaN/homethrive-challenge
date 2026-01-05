import {awsLambdaRequestHandler} from "@trpc/server/adapters/aws-lambda";
import {appRouter, createContext} from "@homethrive-challenge/api/trpc";

export const handler = awsLambdaRequestHandler({
    router: appRouter,
    createContext
})
