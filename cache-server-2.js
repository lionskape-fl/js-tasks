import http from 'http';
import { AsyncCache, TimedCache } from './cache'

const expensiveCalculation = {
  /**
   * Very expensive calculations, reuslts are valid for 5+ seconds
   *
   * @param {string} param some query parameter
   * @returns {Promise<String>} some result
   */
  async calculateData(param) {
    return await (new Promise(resolve => setTimeout(() => {
      resolve(`result for ${param}`)
    }, 1000)))
  }
}

/* ---------- edit below this line ---------------- */
const cache = new AsyncCache(new TimedCache(4000));

http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`)
  const param = url.searchParams.get('query_param')

  const result = await cache.getOrSet(
    param,
    async () => await expensiveCalculation.calculateData(param)
  );
  res.write(`${result}`)
  res.end()
}).listen(5000)
