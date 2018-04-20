
export default class TimeTraveler {
  constructor(timeline, initialState) {
    if (Array.isArray(timeline) === false) {
      throw new TypeError('TimeTraveler: The first parameter must be an array');
    }
    if (timeline.length <= 0 && initialState == null) {
      throw new Error('TimeTraveler: At least must be provided one function at timeline or an initialState');
    }

    timeline = initialState ? [() => initialState, ...timeline] : timeline;
    this.cache = new Map();
    this.timeline = new Map(timeline.map(func => [func, func]));
    this.state = timeline[0]();
    this.cache.set(timeline[0], this.state);
  }

  add(func) {
    if (typeof func !== 'function') {
      throw new TypeError(`TimeTraveler: It's not possible to add ${func} to timeline. The parameter must be a function`);
    }
    this.timeline.set(func, func);
    return this;
  }

  getState() {
    return this.state;
  }

  goTo(func) {
    if (this.cache.has(func)) {
      this.state = this.cache.get(func);
      return this;
    }
    if (typeof func === 'function' && this.timeline.has(func) === true) {
      this.setState(func);
    }
    return this;
  }

  next() {
    let isTheNext = false;
    let done = false;
    let key;

    this.cache.forEach((state, funcKey) => {
      if (isTheNext === false && this.state === state) {
        isTheNext = true;
        key = funcKey;

      } else if (isTheNext === true && done === false) {
        this.state = state;
        done = true;
        isTheNext = false;
      }
    });

    if (done === true || this.timeline.size === this.cache.size) {
      return this;
    }

    isTheNext = false;
    this.timeline.forEach((value, funcKey) => {
      if (isTheNext === false && key === funcKey) {
        isTheNext = true;

      } else if (isTheNext === true && done === false) {
        this.setState(funcKey);
        done = true;
      }
    });
    return this;
  }

  prev() {
    let prevState;
    let done = false;

    this.cache.forEach((state) => {
      if (done === false && this.state === state) {
        done = true;
      }
      if (done === false) {
        prevState = state;
      }
    });

    if (prevState) {
      this.state = prevState;
    }
    return this;
  }

  reset() {
    let done = false;
    this.cache.clear();
    this.timeline.forEach((value, funcKey) => {
      if (done === false) {
        this.state = funcKey();
        this.cache.set(funcKey, this.state);
        done = true;
      }
    });
    return this;
  }

  setState(func) {
    this.state = func(this.state);
    this.cache.set(func, this.state);
    return this;
  }
}
