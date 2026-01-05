import {APIGatewayProxyEventV2} from "aws-lambda";
import {CreateAWSLambdaContextOptions} from "@trpc/server/adapters/aws-lambda";
import {dbConnect} from "../db/connection";

export const createContext = async ({
   event,
   context,
}: CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>) => {
   await dbConnect()
} // no context
export type Context = Awaited<ReturnType<typeof createContext>>;
