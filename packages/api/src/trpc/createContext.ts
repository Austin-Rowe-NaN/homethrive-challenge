import { APIGatewayProxyEventV2 } from "aws-lambda";
import { CreateAWSLambdaContextOptions } from "@trpc/server/adapters/aws-lambda";
import { dbConnect } from "@homethrive-challenge/api/db";

export const createContext = async ({
  event,
  context,
}: CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>) => {
  await dbConnect();
};
export type Context = Awaited<ReturnType<typeof createContext>>;
