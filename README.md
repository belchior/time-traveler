[![Coverage Status](https://coveralls.io/repos/github/belchior/time-traveler/badge.svg)](https://coveralls.io/github/belchior/time-traveler)
[![License MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

# TimeTraveler
TimeTraveler is a library to management of state. It becomes useful in scenarios that is necessary compose object (_state_) based on a sequence of steps (_timeline_).

Think in on behavior of your browser when you navigate between pages, it makes available to you go back and forward or jump to an specific page if you press and hold the button of Prev or Next. This concept of time traveling is the major feature of TimeTraveler but you can do more.

**Demo:** [https://belchior.github.io/time-traveler/](https://belchior.github.io/time-traveler/)


## Installation
Run the command to install
```shell
npm i @belchior/time-traveler
```

## Import
```js
// Default / TypeScript
import TimeTraveler from '@belchior/time-traveler';

// Node ECMAScript module
import TimeTraveler from '@belchior/time-traveler/lib/mjs';

// Node CommonJS
const TimeTraveler = require('@belchior/time-traveler/lib/cjs');
```

## API

### Class methods

#### constructor(_timeline_, _initialState_)
_**timeline**_ `required` - A list of functions that will be used to produce new states

_**initialState**_ `optional` - If passed will be the first state produced by TimeTraveler, otherwise the _**initialState**_ will be produced by the execution of the first function into _**timeline**_

Returns a new instance of TimeTraveler

**Usage**
```js
const timeline = [/* ... */];
const tt = new TimeTraveler(timeline);
```

#### create(_timeline_, _initialState_)
`recommended` Alias to constructor method. The lines above are equivalents

```js
const tt = TimeTraveler.create(timeline);
```
```js
const tt = new TimeTraveler(timeline);
```

### Instance methods

#### add(_fn_) - return _this_
_**fn**_ `required` - Function that will produce state

Adds _**fn**_ at the end of the _**timeline**_

**Usage**
```js
const timeline = [/* ... */];
const finalStep = state => {/* ... */};
const tt = TimeTraveler.create(timeline);
const tt.add(finalStep);
```

#### getState() - return _current state_
Return the current state produced by _**timeline**_

**Usage**
```js
const timeline = [/* ... */];
const tt = TimeTraveler.create(timeline);
const currentState = tt.getState(); // the initial state
```

#### goTo(_fn_) - return _this_
_**fn**_ `required` - Function belonging to _**timeline**_

Set the current state traveling the _**timeline**_ in both direction or jumping to some point in "time". In case the received function have already been called the state will be taken from the cache, otherwise will be produced calling the received _**fn**_.

Note that the sequence matters, if _**goTo**_ is used in a way that don't follow the _**timeline**_ the methods _**next()**_ and _**prev()**_ will try to follow the _timeline_ created by _**goTo**_ and then get possibles states from the _**timeline**_. Try the [demo](https://belchior.github.io/time-traveler/) to get more insides.

**Usage**
```js
const initialState = () => {/* ... */}
const stepA = () => {/* ... */}
const timeline = [initialState, stepA];
const tt = TimeTraveler.create(timeline);

tt.goTo(stepA); // the current state is stepA
tt.goTo(initialState); // the current state is initialState
```

#### next() - return _this_
Set the current state traveling the _**timeline**_ to the future.

**Usage**
```js
const initialState = () => {/* ... */}
const stepA = () => {/* ... */}
const timeline = [initialState, stepA];
const tt = TimeTraveler.create(timeline);

tt.next(); // the current state is stepA
```

#### prev() - return _this_
Set the current state traveling the _**timeline**_ to the past.

**Usage**
```js
const initialState = () => {/* ... */}
const stepA = () => {/* ... */}
const timeline = [initialState, stepA];
const tt = TimeTraveler.create(timeline);

tt.next(); // the current state is stepA
tt.prev(); // the current state is initialState
```

#### reset() - return _this_
Clear the states produced by _**goTo(fn)**_ and _**next()**_. Define the current state as the same produced by _**initialState**_

**Usage**
```js
const initialState = () => {/* ... */}
const stepA = () => {/* ... */}
const stepB = () => {/* ... */}
const timeline = [initialState, stepA, stepB];
const tt = TimeTraveler.create(timeline);

tt.next().next(); // the current state is stepB
tt.reset(); // the stepA and stepB was removed and the current state is initialState
```


## How to use
```js
import TimeTraveler from '@belchior/time-traveler';

const initialState = () => ({ stepA: '', stepB: '', });
const stepA = state => ({ ...state, stepA: 'done', });
const stepB = state => ({ ...state, stepB: 'done', });
const timeline = [ initialState, stepA, stepB, ];

const tt = TimeTraveler.create(timeline);

console.log('initialState:', tt.getState());
tt.next();             console.log('next (stepA)', tt.getState());
tt.next();             console.log('next (stepB)', tt.getState());
tt.prev();             console.log('prev (stepA)', tt.getState());
tt.goTo(initialState); console.log('goTo (initialState):', tt.getState());
tt.goTo(stepB);        console.log('goTo (stepB):', tt.getState());
```
