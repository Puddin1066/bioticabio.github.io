import { GraphQLClient } from 'graphql-request';
export declare const DEFAULT_API_URL = "https://api.platform.opentargets.org/api/v4/graphql";
export interface OpenTargetsClientConfig {
    apiUrl?: string;
}
/**
 * Low-level Open Targets GraphQL client. Loads queries from package queries/
 * and executes them. For provider abstraction (live vs mocked), use OpenTargetsProvider.
 */
export declare function createClient(config?: OpenTargetsClientConfig): GraphQLClient;
/**
 * Execute a named query with variables. Query is loaded from queries/<name>.graphql.
 */
export declare function request<T = unknown>(client: GraphQLClient, queryName: string, variables: Record<string, unknown>): Promise<T>;
//# sourceMappingURL=client.d.ts.map