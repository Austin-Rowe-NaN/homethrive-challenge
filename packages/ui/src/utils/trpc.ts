import type {AppRouter} from "@homethrive-challenge/api";
import {QueryClient} from '@tanstack/react-query';
import {createTRPCClient, httpBatchLink} from '@trpc/client';
import {createTRPCOptionsProxy} from '@trpc/tanstack-react-query';

export const queryClient = new QueryClient();

const trpcClient = createTRPCClient<AppRouter>({
    links: [httpBatchLink({ url: 'http://localhost:8080' })],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
    client: trpcClient,
    queryClient,
});
