import { EventEmitter }  from 'events';

export class Mutex {
  #ee = new EventEmitter();
  #locked = false;

  constructor () {
    // disable memory leak warnings for PoC. Can be set to the connection limit.
    this.#ee.setMaxListeners(Infinity);
  }

  acquire() {
    return new Promise(resolve => {
      // If nobody has the lock, take it and resolve immediately
      if (!this.#locked) {
        // Safe because JS doesn't interrupt you on synchronous operations,
        // so no need for compare-and-swap or anything like that.
        this.#locked = true;
        return resolve();
      }

      // Otherwise, wait until somebody releases the lock and try again
      const tryAcquire = () => {
        if (!this.#locked) {
          this.#locked = true;
          this.#ee.removeListener('release', tryAcquire);
          return resolve();
        }
      };
      this.#ee.on('release', tryAcquire);
    });
  }

  release() {
    // Release the lock immediately
    this.#locked = false;
    setImmediate(() => this.#ee.emit('release'));
  }
}

export class MutexMap {

  /**
   * @type {Map<any, Mutex>}
   */
  #map = new Map();

  acquire(key) {
    if(!this.#map.has(key)) {
      this.#map.set(key, new Mutex());
    }

    return this.#map.get(key);
  }

  release(key) {
    if (this.#map.has(key)) {
      this.#map.get(key).release();
      this.#map.delete(key);
    }
  }
}
