import http from 'http';
import { AsyncCache, TimedCache } from './cache'

const expensiveCalculation = {
  calculationMutex: new Mutex(),
  /**
   * Very expensive calculations, reuslts are valid for 5+ seconds
   *
   * @returns {Promise<String>} some result
   */
  async calculateData() {
    return await (new Promise(resolve => setTimeout(() => {
      resolve('result')
    }, 1000)));
  }
}

/* ---------- edit below this line ---------------- */

const cache = new AsyncCache(new TimedCache(4000));

http.createServer(async (req, res) => {
  const result = await cache.getOrSet('calculateData', expensiveCalculation.calculateData);
  res.write(`${result}`)
  res.end()
}).listen(5000)
