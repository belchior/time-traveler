
export class TimeTraveler {
  constructor(initialTimeLine, initialState) {
    if (Array.isArray(initialTimeLine) === false) {
      throw new TypeError('TimeTraveler: The first parameter must be an array');
    }
    if (initialTimeLine.length <= 0 && initialState == null) {
      throw new Error('TimeTraveler: At least must be provided one function at timeLine or an initialState');
    }

    initialTimeLine = initialState ? [() => initialState, ...initialTimeLine] : initialTimeLine;
    this.index = 0;
    this.cache = new Map();
    this.timeLine = new Map(initialTimeLine.map(func => [func, func]));
    this.end = this.timeLine.length;
    this.state = initialTimeLine[0]();
    this.cache.set(initialTimeLine[0], this.state);
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

    if (done === true || this.timeLine.size === this.cache.size) {
      return this;
    }

    isTheNext = false;
    this.timeLine.forEach((value, funcKey) => {
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

  goTo(func) {
    if (this.cache.has(func)) {
      this.state = this.cache.get(func);
      return this;
    }
    if (typeof func === 'function' && this.timeLine.has(func) === true) {
      this.setState(func);
    }
    return this;
  }

  getState() {
    return this.state;
  }

  setState(func) {
    this.state = func(this.state);
    this.cache.set(func, this.state);
  }
}
