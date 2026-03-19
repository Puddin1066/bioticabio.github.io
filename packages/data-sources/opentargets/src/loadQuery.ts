import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

let _queriesDir: string | null = null;

/** Resolve path to queries directory (works from src/ and from dist/). */
function queriesDir(): string {
  if (_queriesDir !== null) return _queriesDir;
  const fromDist = join(__dirname, '..', 'queries');
  const fromSrc = join(__dirname, '..', '..', 'queries');
  try {
    readFileSync(join(fromDist, 'drug-assessment.graphql'), 'utf8');
    _queriesDir = fromDist;
  } catch {
    _queriesDir = fromSrc;
  }
  return _queriesDir as string;
}

/**
 * Load a GraphQL query by name from the package queries directory.
 * @param name - Query file name without .graphql (e.g. 'drug-assessment', 'search-entities')
 */
export function loadQuery(name: string): string {
  const path = join(queriesDir(), `${name}.graphql`);
  return readFileSync(path, 'utf8');
}
