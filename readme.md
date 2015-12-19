# nectar [![Build Status](https://travis-ci.org/jmversteeg/nectar.svg?branch=master)](https://travis-ci.org/jmversteeg/nectar)

> Pack files by glob


## Install

```
$ npm install --save nectar
```


## Usage

```js
const nectar = require('nectar');

nectar(['resources/**/*.js']);
// returns a readable stream for an archive containing all .js files inside 'resources'

nectar(['resources/**/*.js'], 'bundle.tar');
// returns a promise for packing all .js files inside 'resources' into 'bundle.tar'
```


## API

### nectar(input, [output])

#### input

Type: `string|string[]`

Input glob(s).

#### output

Type: `string`

Optional output path.

## License

MIT © [JM Versteeg](http://github.com/jmversteeg)
