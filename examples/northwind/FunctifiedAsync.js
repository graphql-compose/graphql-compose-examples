/* eslint-disable prefer-destructuring */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-lonely-if */

// https://gist.github.com/OliverJAsh/2c327ae63941a237594eed34fe60a47b
export class FunctifiedAsync {
  constructor(iterable) {
    this.iterable = iterable;
  }

  async *[Symbol.asyncIterator]() {
    for await (const value of this.iterable) {
      yield value;
    }
  }

  map(callback) {
    const iterable = this.iterable;
    return FunctifiedAsync.fromGenerator(async function* () {
      for await (const value of iterable) {
        yield callback(value);
      }
    });
  }

  skipWhile(predicate) {
    const iterable = this.iterable;
    return FunctifiedAsync.fromGenerator(async function* () {
      let skip = true;
      for await (const value of iterable) {
        if (!predicate(value)) {
          skip = false;
        }
        if (!skip) {
          yield value;
        }
      }
    });
  }

  flatten() {
    const iterable = this.iterable;
    return FunctifiedAsync.fromGenerator(async function* () {
      for await (const value of iterable) {
        if (value[Symbol.iterator] || value[Symbol.asyncIterator]) {
          yield* new FunctifiedAsync(value);
        } else {
          yield value;
        }
      }
    });
  }

  takeUntil(predicate) {
    const iterator = this.iterable[Symbol.asyncIterator]();
    const self = this;
    return FunctifiedAsync.fromGenerator(async function* () {
      if (self.hasOwnProperty('startValue')) {
        yield self.startValue;
      }
      while (true) {
        const result = await iterator.next();
        if (result.done) {
          break;
        } else {
          if (predicate(result.value)) {
            // save the value so we can yield if takeUntil is called again
            self.startValue = result.value;
            break;
          } else {
            yield result.value;
          }
        }
      }
    });
  }

  static load(iterable) {
    return new FunctifiedAsync(iterable);
  }

  static map(iterable, cb) {
    return this.load(iterable).map(cb);
  }

  static fromGenerator(generator) {
    return new FunctifiedAsync({
      [Symbol.asyncIterator]: generator,
    });
  }
}
