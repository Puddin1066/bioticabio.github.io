import { GraphQLClient } from 'graphql-request';
import { loadQuery } from './loadQuery.js';
export const DEFAULT_API_URL = 'https://api.platform.opentargets.org/api/v4/graphql';
/**
 * Low-level Open Targets GraphQL client. Loads queries from package queries/
 * and executes them. For provider abstraction (live vs mocked), use OpenTargetsProvider.
 */
export function createClient(config = {}) {
    const apiUrl = config.apiUrl ?? DEFAULT_API_URL;
    return new GraphQLClient(apiUrl);
}
/**
 * Execute a named query with variables. Query is loaded from queries/<name>.graphql.
 */
export async function request(client, queryName, variables) {
    const query = loadQuery(queryName);
    return client.request(query, variables);
}
//# sourceMappingURL=client.js.map