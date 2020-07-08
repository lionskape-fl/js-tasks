import React from 'react'
import { useAsync } from './useAsync'

const api = {
  /**
   * This method must be called when user clicks the "purchase" button
   */
  purchase: async () => {
    // an errror may be thrown
    // throw new Error("Request error")

    return 42
  }
}

export default () => {
  const [run, state] = useAsync(api.purchase);

  return (
    <div>
      <button onClick={run} disabled={state === 'loading'}>Purchase</button>
      {state === 'success' && (
        <p className="successText">Purchase completed!</p>
      )}
      {state === 'error' && (
        <p className="errorText">An error occurred!</p>
      )}
    </div>
  )
}
