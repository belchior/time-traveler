import { TimeTraveler } from './time-traveler.js';

const initialState = () => {
  return { checkingAccount: 100000, activeButton: 'btn-initial' };
};

const buyACar = (state) => {
  return {
    ...state,
    car: 70000,
    checkingAccount: state.checkingAccount - 70000,
    activeButton: 'btn-buy-car',
  };
};

const buyABike = (state) => {
  return {
    ...state,
    bike: 3000,
    checkingAccount: state.checkingAccount - 3000,
    activeButton: 'btn-buy-bike',
  };
};

const sellCar = (state) => {
  const newState = {
    ...state,
    checkingAccount: state.checkingAccount + state.car - 20000,
    activeButton: 'btn-sell-car',
  };
  delete newState.car;
  return newState;
};

const pedalingToWork = (state) => {
  return {
    ...state,
    pedaling: true,
    activeButton: 'btn-pedaling',
  };
};

const timeLine = [ initialState, buyACar, buyABike, sellCar, pedalingToWork, ];
const tt = new TimeTraveler(timeLine);


const timeLineButtons = Array.from(document.querySelectorAll('.time-line .btn'));

const activeTheCurrentButton = buttonList => {
  const activeButton = tt.getState().activeButton;
  buttonList.map(btn => {
    if (btn.classList.contains(activeButton)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
};

const updateStateBox = currentState => {
  currentState = {...currentState};
  delete currentState.activeButton;
  document.querySelector('.state').innerHTML = JSON.stringify(currentState);
};

document.querySelector('.btn-prev').addEventListener('click', () => tt.prev());
document.querySelector('.btn-next').addEventListener('click', () => tt.next());
document.querySelector('.btn-initial').addEventListener('click', () => tt.goTo(initialState));
document.querySelector('.btn-buy-car').addEventListener('click', () => tt.goTo(buyACar));
document.querySelector('.btn-buy-bike').addEventListener('click', () => tt.goTo(buyABike));
document.querySelector('.btn-sell-car').addEventListener('click', () => tt.goTo(sellCar));
document.querySelector('.btn-pedaling').addEventListener('click', () => tt.goTo(pedalingToWork));

Array.from(
  document.querySelectorAll('.navigation .btn'),
  button => button.addEventListener('click', () => {
    activeTheCurrentButton(timeLineButtons);
    updateStateBox(tt.getState());
  })
);


activeTheCurrentButton(timeLineButtons);
updateStateBox(tt.getState());
