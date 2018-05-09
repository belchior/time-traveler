import TimeTraveler from './time-traveler';

const initialState = () => {
  return { checkingAccount: 100000, };
};

const buyACar = (state) => {
  return { ...state, car: 70000, checkingAccount: state.checkingAccount - 70000, };
};

const buyABike = (state) => {
  return { ...state, bike: 3000, checkingAccount: state.checkingAccount - 3000, };
};

const sellCar = (state) => {
  const newState = { ...state, checkingAccount: state.checkingAccount + state.car - 20000, };
  delete newState.car;
  return newState;
};

const pedalingToWork = (state) => {
  return { ...state, pedaling: true, };
};

const timeline = [ initialState, buyACar, buyABike, sellCar, pedalingToWork, ];

describe('TimeTraveler', () => {
  it('should expose the static method create', () => {
    expect(TimeTraveler).toHaveProperty('create');
  });

  it('should be instantiable', () => {
    const tt = new TimeTraveler(timeline);
    expect(tt).toBeInstanceOf(TimeTraveler);
  });

  it('should be extendable', () => {
    const CustomTimeTraveler = class CustomTimeTraveler extends TimeTraveler {};
    const ctt = new CustomTimeTraveler(timeline);

    expect(ctt).toBeInstanceOf(TimeTraveler);
  });

  it('should be instantiable with two paramenter and the last may be anything', () => {
    let tt = new TimeTraveler(timeline, true);
    expect(tt).toBeInstanceOf(TimeTraveler);

    tt = new TimeTraveler(timeline, 'We have to go back');
    expect(tt).toBeInstanceOf(TimeTraveler);

    tt = new TimeTraveler(timeline, 42);
    expect(tt).toBeInstanceOf(TimeTraveler);

    tt = new TimeTraveler(timeline, []);
    expect(tt).toBeInstanceOf(TimeTraveler);

    tt = new TimeTraveler(timeline, {});
    expect(tt).toBeInstanceOf(TimeTraveler);
  });

  it('should throw a TypeError when passed a non array as the first parameter', () => {
    const wrap = () => {
      new TimeTraveler();
    };
    expect(wrap).toThrow('TimeTraveler: The first parameter must be an array');
  });

  it('should throw an error when is not passed un initial state and an empty array', () => {
    const wrap = () => {
      new TimeTraveler([]);
    };
    expect(wrap).toThrow('TimeTraveler: At least must be provided one function at timeline or an initialState');
  });

  it('should expose the method add when instantiated', () => {
    const tt = new TimeTraveler(timeline);
    expect(tt).toHaveProperty('add');
  });
  it('should expose the method getState when instantiated', () => {
    const tt = new TimeTraveler(timeline);
    expect(tt).toHaveProperty('getState');
  });
  it('should expose the method goTo when instantiated', () => {
    const tt = new TimeTraveler(timeline);
    expect(tt).toHaveProperty('goTo');
  });
  it('should expose the method prev when instantiated', () => {
    const tt = new TimeTraveler(timeline);
    expect(tt).toHaveProperty('prev');
  });
  it('should expose the method next when instantiated', () => {
    const tt = new TimeTraveler(timeline);
    expect(tt).toHaveProperty('next');
  });
  it('should expose the method reset when instantiated', () => {
    const tt = new TimeTraveler(timeline);
    expect(tt).toHaveProperty('reset');
  });

  it('should produces the first state calling the first item at timeline', () => {
    const fn = jest.fn(initialState);
    const tt = new TimeTraveler([fn]);

    expect(fn).toHaveBeenCalled();
    expect(tt.getState()).toEqual(initialState());
  });
});

describe('TimeTraveler constructor', () => {
  it('should receive an array of function as the first parameter (the timeline)', () => {
    const tt = new TimeTraveler(timeline);
    expect(tt).toBeInstanceOf(TimeTraveler);
  });
  it('optionaly receive a state as the second parameter', () => {
    const tt = new TimeTraveler(timeline, {});
    expect(tt).toBeInstanceOf(TimeTraveler);
  });
  it('with one parameter should produce the first state calling the first item at timeline', () => {
    const state = initialState();
    const fn = jest.fn(initialState);
    const tt = new TimeTraveler([fn]);
    expect(tt.getState()).toEqual(state);
    expect(fn).toHaveBeenCalled();
  });
  it('with two parameters should assume the second one as the initial state', () => {
    const state = {jack: 'We have to go back'};
    const fn = jest.fn(initialState);
    const tt = new TimeTraveler([fn], state);
    expect(tt.getState()).toEqual(state);
    expect(fn).not.toHaveBeenCalled();
  });
});

describe('Static method create', () => {
  it('should return the TimeTraveler instance when called', () => {
    const tt = TimeTraveler.create(timeline);

    expect(tt instanceof TimeTraveler).toBe(true);
  });
});

describe('Method add', () => {
  it('should add a function as a new step at timeline', () => {
    const tt = new TimeTraveler([initialState, buyACar]);

    const buyABikeState = buyABike(buyACar(initialState()));
    let state = initialState();
    expect(tt.getState()).toEqual(state);

    state = buyACar(state);
    tt.next();
    expect(tt.getState()).toEqual(state);

    tt.next();
    expect(tt.getState()).toEqual(state);

    tt.add(buyABike);
    tt.next();
    expect(tt.getState()).toEqual(buyABikeState);
  });

  it('should throw a TypeError when the paramenter is not a function', () => {
    const tt = new TimeTraveler([initialState]);

    expect(() => tt.add()).toThrow();
  });

  it('should return the TimeTraveler instance when called', () => {
    const tt = new TimeTraveler([initialState]);

    expect(tt.add(buyABike)).toBe(tt);
  });
});

describe('Method getState', () => {
  it('should return the current state', () => {
    const tt = new TimeTraveler(timeline);

    let state = initialState();
    expect(tt.getState()).toEqual(state);

    state = buyACar(state);
    tt.next();
    expect(tt.getState()).toEqual(state);
  });
});

describe('Method goTo', () => {
  it('should set the state getting from de cache', () => {
    const tt = new TimeTraveler(timeline);
    const state = buyACar(initialState());

    tt.next();
    tt.next();
    tt.goTo(buyACar); expect(tt.getState()).toEqual(state);
  });
  it('should produce state when the state is not found into the cache', () => {
    const tt = new TimeTraveler(timeline);

    let state = buyACar(initialState());
    tt.goTo(buyACar); expect(tt.getState()).toEqual(state);

    state = buyABike(state);
    tt.goTo(buyABike); expect(tt.getState()).toEqual(state);

    state = sellCar(state);
    tt.goTo(sellCar); expect(tt.getState()).toEqual(state);
  });
  it('should return the TimeTraveler instance when called', () => {
    const tt = new TimeTraveler(timeline);

    expect(tt.goTo(buyABike)).toBe(tt);
  });
});

describe('Method next', () => {
  it('should produces a new state when called if there are no cache yet', () => {
    const tt = new TimeTraveler(timeline);
    const state = buyACar(initialState());

    tt.next();
    expect(tt.getState()).toEqual(state);
  });
  it('should return from cache when the state was previously produced', () => {
    const tt = new TimeTraveler(timeline);
    const prevState = initialState();
    const state = buyACar(initialState());

    tt.next(); expect(tt.getState()).toEqual(state);
    tt.prev(); expect(tt.getState()).toEqual(prevState);
    tt.next(); expect(tt.getState()).toEqual(state);
  });
  it('should not change the state when the current state was produced by the last item from timeline (linear)', () => {
    const tt = new TimeTraveler([initialState, buyACar, buyABike]);

    let state = initialState();
    expect(tt.getState()).toEqual(state);

    state = buyACar(state);
    tt.next(); expect(tt.getState()).toEqual(state);

    state = buyABike(state);
    tt.next(); expect(tt.getState()).toEqual(state);
    tt.next(); expect(tt.getState()).toEqual(state);
  });
  it('should not change the state when the current state was produced by the last item from timeline (non linear)', () => {
    const tt = new TimeTraveler([initialState, buyACar, buyABike]);
    let state = buyABike(initialState());
    tt.goTo(buyABike); expect(tt.getState()).toEqual(state);

    state = buyACar(state);
    tt.goTo(buyACar); expect(tt.getState()).toEqual(state);
    tt.next(); expect(tt.getState()).toEqual(state);
  });
  it('should return the TimeTraveler instance when called', () => {
    const tt = new TimeTraveler(timeline);

    expect(tt.next()).toBe(tt);
  });
});

describe('Method prev', () => {
  it('should not change the state when the current state is the initial state', () => {
    const tt = new TimeTraveler(timeline);
    const state = initialState();

    expect(tt.getState()).toEqual(state);

    tt.prev(); expect(tt.getState()).toEqual(state);
    tt.prev(); expect(tt.getState()).toEqual(state);
  });
  it('should set the state to the previously produced state', () => {
    const tt = new TimeTraveler(timeline);
    const prevState = initialState();
    const state = buyACar(initialState());

    expect(tt.getState()).toEqual(prevState);
    tt.next(); expect(tt.getState()).toEqual(state);
    tt.prev(); expect(tt.getState()).toEqual(prevState);
  });
  it('should return the TimeTraveler instance when called', () => {
    const tt = new TimeTraveler(timeline);

    expect(tt.prev()).toBe(tt);
  });
});

describe('Method reset', () => {
  it('should clear the cache and set the state to initialState', () => {
    const tt = new TimeTraveler(timeline);

    let state = initialState();
    expect(tt.getState()).toEqual(state);

    state = buyACar(state);
    tt.next();
    expect(tt.getState()).toEqual(state);

    tt.reset();
    expect(tt.getState()).toEqual(initialState());
  });

  it('should return the TimeTraveler instance when called', () => {
    const tt = new TimeTraveler(timeline);

    expect(tt.reset()).toBe(tt);
  });
});
