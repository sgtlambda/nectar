# nectar

> Create tar archive of files matching glob(s)

[![Build Status][travis-image]][travis-url]
[![Code Quality][codeclimate-image]][codeclimate-url]
[![Code Coverage][coveralls-image]][coveralls-url]
[![NPM Version][npm-image]][npm-url]


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

[![dependency Status][david-image]][david-url]
[![devDependency Status][david-dev-image]][david-dev-url]

[travis-image]: https://img.shields.io/travis/jmversteeg/nectar.svg?style=flat-square
[travis-url]: https://travis-ci.org/jmversteeg/nectar

[codeclimate-image]: https://img.shields.io/codeclimate/github/jmversteeg/nectar.svg?style=flat-square
[codeclimate-url]: https://codeclimate.com/github/jmversteeg/nectar

[david-image]: https://img.shields.io/david/jmversteeg/nectar.svg?style=flat-square
[david-url]: https://david-dm.org/jmversteeg/nectar

[david-dev-image]: https://img.shields.io/david/dev/jmversteeg/nectar.svg?style=flat-square
[david-dev-url]: https://david-dm.org/jmversteeg/nectar#info=devDependencies

[coveralls-image]: https://img.shields.io/coveralls/jmversteeg/nectar.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/jmversteeg/nectar

[npm-image]: https://img.shields.io/npm/v/nectar.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/nectar