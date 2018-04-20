[![Coverage Status](https://coveralls.io/repos/github/belchior/time-traveler/badge.svg)](https://coveralls.io/github/belchior/time-traveler)
[![License MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

# TimeTraveler
TimeTraveler é uma biblioteca para gerenciamento de estado. Ela torna-se útil em cenários onde é necessário
compor um objeto (_state_) baseado em uma sequência de passos (_timeline_), ela permite alterarnar
entre os estados produzidos usando uma alegoria de viagem no tempo.

**Demo:** [https://belchior.github.io/time-traveler/](https://belchior.github.io/time-traveler/)


## Installation
Execute o comando abaixo para instalar
```shell
npm i @belchior/time-traveler
```

## Import
```js
// Default
import TimeTraveler from '@belchior/time-traveler';

// Node ECMAScript module
import TimeTraveler from '@belchior/time-traveler/lib/mjs';

// Node CommonJS
const TimeTraveler = require('@belchior/time-traveler/lib/cjs');
```

## API
### constructor(_timeline_, _initialState_)
_**timeline**_ `obrigatório` - Lista de funções que servirá de base para produzir os estados usando os métodos a seguir.

_**initialState**_ `opicional` - Caso seja fornacido será o primeiro passo criado pela biblioteca TimeTraveler, caso contrário o estado inicial será produzido pela primeira função da _**timeline**_.

### add(_fn_) - return _this_
_**fn**_ `obrigatório` - Função

Adiciona _**fn**_ ao final da lista  _**timeline**_

### getState() - return _current state_
Retorna o estado atual produzido pela _timeline_

### goTo(_fn_) - return _this_
_**fn**_ `obrigatório` - Função pertencente a lista _**timeline**_

Salta para um passo específico na _timeline_ podendo ser tanto para o passado quanto futuro.

### next() - return _this_
Avança para o próximo passo na _timeline_

### prev() - return _this_
Volta para o passo anterior na _timeline_

### reset() - return _this_
Exclui os estados produzidos e define o estado atual como o mesmo produzido pelo _**initialState**_


## How to use
```js
import TimeTraveler from '@belchior/time-traveler';

const initialState = () => ({ stepA: '', stepB: '', });
const stepA = state => ({ ...state, stepA: 'done', });
const stepB = state => ({ ...state, stepB: 'done', });
const timeLine = [ initialState, stepA, stepB, ];

const tt = new TimeTraveler(timeLine);

console.log('initialState:', tt.getState());
tt.next();             console.log('next (stepA)', tt.getState());
tt.next();             console.log('next (stepB)', tt.getState());
tt.prev();             console.log('prev (stepA)', tt.getState());
tt.goTo(initialState); console.log('goTo (initialState):', tt.getState());
tt.goTo(stepB);        console.log('goTo (stepB):', tt.getState());
```
