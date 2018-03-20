[![Coverage Status](https://coveralls.io/repos/github/belchior/time-traveler/badge.svg)](https://coveralls.io/github/belchior/time-traveler)
[![License MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

# TimeTraveler
TimeTraveler é uma biblioteca para gerenciamento de estado. Ela torna-se útil em cenários onde é necessário
compor um objeto (_estado_) baseado em uma sequência de passos (_linha do tempo_), ela permite alterarnar entre os
estados produzidos usando uma alegoria de viagem no tempo.

Demo: [https://belchior.github.io/time-traveler/](https://belchior.github.io/time-traveler/)


## Instalação
Execute o comando abaixo para instalar
```bash
npm i @belchior/time-traveler
```

## Import
```js
import TimeTraveler from '@belchior/time-traveler';
```

## API

### next() - return _this_
### prev() - return _this_
### goTo(fn) - return _this_
### getState() - return _current state_
