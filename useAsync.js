import { useCallback, useState } from 'react';

/**
 * Executor function
 * @callback executorFunction
 * @return {Promise} async response
 */

/**
 * Wrapper for simple promise state management.
 * There is another way to implement it:
 *  - instead of running immediate after click it can be run after state change via useEffect
 *
 * @param {executorFunction} executor
 * @return {[executorFunction, init|success|error|loading, any|null, any|null]}
 */
export const useAsync = (executor) => {
  const [state, setState] = useState('init');
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);

  const run = useCallback(async () => {
    setState('loading');
    try {
      setValue(await executor());
      setState('success');
      setError(null);
    } catch (e) {
      setError(e);
      setState('error');
      setValue(null);
    }

  }, []);

  return [run, state, value, error];
}
