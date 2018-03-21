[![Coverage Status](https://coveralls.io/repos/github/belchior/time-traveler/badge.svg)](https://coveralls.io/github/belchior/time-traveler)
[![License MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

# TimeTraveler
TimeTraveler é uma biblioteca para gerenciamento de estado. Ela torna-se útil em cenários onde é necessário
compor um objeto (_estado_) baseado em uma sequência de passos (_linha do tempo_), ela permite alterarnar
entre os estados produzidos usando uma alegoria de viagem no tempo.

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


## A Alegoria (O viajante do tempo)
Parece incomum pensar em resolver um problema usando uma alegoria de viagem no tempo, soa como se a metáfora
fosse mais complexa de ser entendida do que o problema em si. Com isso em mente tentarei explicar ...

Imagine um instalador de programas tradicional, aqueles do tipo "next, next, next, finish." este é um exemplo
básico de programa com recurso de viagem no tempo, imagine que o tempo do são todas as telas que o usuário irá
interagir, e quando ele clica "next, next, next" ele estará trocando de tela e também viajando no tempo do
instalador de uma forma linear. Porem se acontecer dele decidir voltar afim de certificar-se que desmarcou
a opição "Instalar spyware" o que ele precisa fazer é clicar em "prev, prev" e constatar que desmarcou,
apartir dai o usuário pode continuar avançando linearmente ou ir para o final e concluir a instalação.

Note que neste exemplo o usuário é o viajante do tempo e as telas do instalador são a linha do tempo
ao qual ele viaja. O instalador por sua vez permite que usuário viage para o "passado" e para o "futuro"
de forma sequêncial ou salte para o "futuro" ignorando as telas que ele já havia passado.

Este é um típico problema que o TimeTraveler resolve, onde se tem um conjunto conhecido de passos a ser
dado com a possibilidade de transitar entre eles de uma forma linear ou não linear.
