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

const timeLine = [ initialState, buyACar, buyABike, sellCar, pedalingToWork, ];

describe('TimeTraveler', () => {
  it('should be instantiable', () => {
    const tt = new TimeTraveler(timeLine);
    expect(tt).toBeInstanceOf(TimeTraveler);
  });

  it('should be extendable', () => {
    const CustomTimeTraveler = class CustomTimeTraveler extends TimeTraveler {};
    const ctt = new CustomTimeTraveler(timeLine);

    expect(ctt).toBeInstanceOf(TimeTraveler);
  });

  it('should be instantiable with two paramenter and the last may be anything', () => {
    let tt = new TimeTraveler(timeLine, true);
    expect(tt).toBeInstanceOf(TimeTraveler);

    tt = new TimeTraveler(timeLine, 'We have to go back');
    expect(tt).toBeInstanceOf(TimeTraveler);

    tt = new TimeTraveler(timeLine, 42);
    expect(tt).toBeInstanceOf(TimeTraveler);

    tt = new TimeTraveler(timeLine, []);
    expect(tt).toBeInstanceOf(TimeTraveler);

    tt = new TimeTraveler(timeLine, {});
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
    expect(wrap).toThrow('TimeTraveler: At least must be provided one function at timeLine or an initialState');
  });

  it('should expose the method next when instantiated', () => {
    const tt = new TimeTraveler(timeLine);
    expect(tt).toHaveProperty('next');
  });
  it('should expose the method prev when instantiated', () => {
    const tt = new TimeTraveler(timeLine);
    expect(tt).toHaveProperty('prev');
  });
  it('should expose the method goTo when instantiated', () => {
    const tt = new TimeTraveler(timeLine);
    expect(tt).toHaveProperty('goTo');
  });
  it('should expose the method getState when instantiated', () => {
    const tt = new TimeTraveler(timeLine);
    expect(tt).toHaveProperty('getState');
  });

  it('should produces the first state calling the first item at timeLine', () => {
    const fn = jest.fn(initialState);
    const tt = new TimeTraveler([fn]);

    expect(fn).toHaveBeenCalled();
    expect(tt.getState()).toEqual(initialState());
  });
});

describe('TimeTraveler constructor', () => {
  it('should receive an array of function as the first parameter (the timeTine)', () => {
    const tt = new TimeTraveler(timeLine);
    expect(tt).toBeInstanceOf(TimeTraveler);
  });
  it('optionaly receive a state as the second parameter', () => {
    const tt = new TimeTraveler(timeLine, {});
    expect(tt).toBeInstanceOf(TimeTraveler);
  });
  it('with one parameter should produce the first state calling the first item at timeLine', () => {
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

describe('Method next', () => {
  it('should produces a new state when called if there are no cache yet', () => {
    const tt = new TimeTraveler(timeLine);
    const state = buyACar(initialState());

    tt.next();
    expect(tt.getState()).toEqual(state);
  });
  it('should return from the cache when the state was previously produced ', () => {
    const tt = new TimeTraveler(timeLine);
    const prevState = initialState();
    const state = buyACar(initialState());

    tt.next(); expect(tt.getState()).toEqual(state);
    tt.prev(); expect(tt.getState()).toEqual(prevState);
    tt.next(); expect(tt.getState()).toEqual(state);
  });
  it('should not change the state when the current state was produced by the last item from timeLine (linear)', () => {
    const tt = new TimeTraveler([initialState, buyACar, buyABike]);

    let state = initialState();
    expect(tt.getState()).toEqual(state);

    state = buyACar(state);
    tt.next(); expect(tt.getState()).toEqual(state);

    state = buyABike(state);
    tt.next(); expect(tt.getState()).toEqual(state);
    tt.next(); expect(tt.getState()).toEqual(state);
  });
  it('should not change the state when the current state was produced by the last item from timeLine (non linear)', () => {
    const tt = new TimeTraveler([initialState, buyACar, buyABike]);
    let state = buyABike(initialState());
    tt.goTo(buyABike); expect(tt.getState()).toEqual(state);

    state = buyACar(state);
    tt.goTo(buyACar); expect(tt.getState()).toEqual(state);
    tt.next(); expect(tt.getState()).toEqual(state);
  });
  it('should return the TimeTraveler instance when called', () => {
    const tt = new TimeTraveler(timeLine);

    expect(tt.next()).toBe(tt);
  });
});

describe('Method prev', () => {
  it('should not change the state when the current state is the initial state', () => {
    const tt = new TimeTraveler(timeLine);
    const state = initialState();

    expect(tt.getState()).toEqual(state);

    tt.prev(); expect(tt.getState()).toEqual(state);
    tt.prev(); expect(tt.getState()).toEqual(state);
  });
  it('should set the state to the previously produced state', () => {
    const tt = new TimeTraveler(timeLine);
    const prevState = initialState();
    const state = buyACar(initialState());

    expect(tt.getState()).toEqual(prevState);
    tt.next(); expect(tt.getState()).toEqual(state);
    tt.prev(); expect(tt.getState()).toEqual(prevState);
  });
  it('should return the TimeTraveler instance when called', () => {
    const tt = new TimeTraveler(timeLine);

    expect(tt.next()).toBe(tt);
  });
});

describe('Method goTo', () => {
  it('should set the state getting from de cache', () => {
    const tt = new TimeTraveler(timeLine);
    const state = buyACar(initialState());

    tt.next();
    tt.next();
    tt.goTo(buyACar); expect(tt.getState()).toEqual(state);
  });
  it('should produce state when the state is not found into the cache', () => {
    const tt = new TimeTraveler(timeLine);

    let state = buyACar(initialState());
    tt.goTo(buyACar); expect(tt.getState()).toEqual(state);

    state = buyABike(state);
    tt.goTo(buyABike); expect(tt.getState()).toEqual(state);

    state = sellCar(state);
    tt.goTo(sellCar); expect(tt.getState()).toEqual(state);
  });
  it('should return the TimeTraveler instance when called', () => {
    const tt = new TimeTraveler(timeLine);

    expect(tt.next()).toBe(tt);
  });
});

describe('Method getState', () => {
  it('should return the current state', () => {
    const tt = new TimeTraveler(timeLine);

    let state = initialState();
    expect(tt.getState()).toEqual(state);

    state = buyACar(state);
    tt.next();
    expect(tt.getState()).toEqual(state);
  });
});
