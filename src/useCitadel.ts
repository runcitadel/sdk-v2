import Citadel from './citadel.ts';
import {useRef} from "https://esm.sh/react@18.2.0";

/**
 * React hook for the Citadel SDK
 */
export function useCitadel() {
  //On first load set up a client-side Citadel instance that persists between re-renders
  const ref = useRef<Citadel | null>(null);
  //Todo: dynamically determine URL maybe with Citadel.discover() but currently getting CORs errors with that
  //Once that's working it should replace the hardcoded string below "http://citadel.local"
  if (!ref.current) {
    console.log('useCitadel setting ref');
    ref.current = new Citadel('http://citadel.local');
  }

  return ref.current;
}
