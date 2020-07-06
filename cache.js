import { MutexMap } from './mutex'

export class Cache {
  /**
   * @type {Map<any, any>}
   */
  #cacheMap = new Map();

  /**
   * @param key
   * @returns {*}
   */
  get(key) {
    return this.#cacheMap.get(key);
  }

  /**
   * @param key
   * @param value
   */
  set(key, value) {
    this.#cacheMap.set(key, value);
  }

  /**
   * @param key
   * @returns {boolean}
   */
  has(key) {
    return this.#cacheMap.has(key);
  }

  /**
   * @param key
   */
  delete(key) {
    this.#cacheMap.delete(key);
  }
}

/**
 * There is a two ways to implement such cache strategy.
 * First one - store key creation date
 * Second one - create a key deletion timer
 *
 * Probably, timer approach is more stable, but can consumes a lot of resources if there is a lot of key inside.
 */
export class TimedCache {
  /**
   * Cache time to live.
   * @type {number}
   */
  #ttl;

  /**
   * @type {Map<any, number>}
   */
  #createdTimeMap = new Map();

  /**
   * @type {Cache}
   */
  #storage;

  /**
   * Timer, which clears outdated cache values
   */
  #timer;

  /**
   * @param ttl {number} ttl timeout miliseconds
   * @param storage {Cache}
   */
  constructor (ttl, storage= new Cache()) {
    this.#ttl = ttl;
    this.#storage = storage;

    // extra cleaning interval, to free some memory
    this.#timer = setInterval(() => {
      this.#createdTimeMap.forEach((expireTime, key) => {
        if(this.#isExpired(key)) {
          this.delete(key);
        }
      });
    }, this.#ttl);
  }

  set(key, value) {
    this.#createdTimeMap.set(key, Date.now());

    super.set(key, value);
  }

  delete (key) {
    this.#createdTimeMap.delete(key);
    super.delete(key)
  }

  /**
   * @param key
   * @returns {*}
   */
  get(key) {
    if (this.#createdTimeMap.has(key)) {
      if (this.#isExpired(key)) {
        return undefined;
      }
    }

    return this.#storage.get(key);
  }

  /**
   * @param key
   * @returns {boolean}
   */
  has(key) {
    return !this.#isExpired(key) && this.#storage.has(key);
  }

  #isExpired(key) {
    return this.#createdTimeMap.has(key) && (Date.now() - this.#createdTimeMap.get(key)) < this.#ttl;
  }
}

/**
 * Implementation of cache with async method "getOrSet"
 */
export class AsyncCache {
  /**
   * @type {MutexMap}
   */
  #mutexMap = new MutexMap();

  /**
   * @type {Cache}
   */
  #storage;

  constructor (storage = new Cache()) {
    this.#storage = storage;
  }

  /**
   * @param key
   * @returns {*}
   */
  get(key) {
    return this.#storage.get(key);
  }

  /**
   * @param key
   * @param value
   */
  set(key, value) {
    this.#storage.set(key, value);
  }

  /**
   * @param key
   * @returns {boolean}
   */
  has(key) {
    return this.#storage.has(key);
  }

  /**
   * @param key
   */
  delete(key) {
    this.#storage.delete(key);
  }

  /**
   * Value creator have to return a promise, which resolves with a created value
   * @callback valueCreator
   * @return {Promise<*>} value
   */
  /**
   * It supports passing an async valueCreator function
   * Mutex was used for synchronization
   *
   * @param key
   * @param {valueCreator} valueCreator
   * @returns {Promise<*>}
   */
  async getOrSet(key, valueCreator) {
    if (!this.has(key)) {
      await this.#mutexMap.acquire(key);

      try {
        if (!this.has(key)) {
          this.set(key, await valueCreator());
        }
      } finally {
        this.#mutexMap.release(key);
      }
    }

    return this.get(key);
  }
}
