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

nectar(['resources/**/*.js'], 'bundle.tar');
// packs all .js files inside 'resources' into 'bundle.tar' and returns a promise for an array of the paths of the packed entries

nectar(['resources/**/*.js']);
// returns a readable stream for an archive containing all .js files inside 'resources'

const fs     = require('fs');
const zlib   = require('zlib');

let gZip = zlib.createGzip();

nectar(['resources/**/*.js'], gZip.pipe(fs.createWriteStream('bundle.tar.gz')));
// compresses all .js files inside 'resources' into 'bundle.tar.gz' and returns a promise for an array of the paths of the packed entries
```


## API

### nectar(input, [output])

Creates a tar archive containing all files matched by the given input glob(s). The directory structure is preserved.

If the `output` argument is provided, the archive is written to `output` and a promise is returned for an array of the paths of the matches entries.
If no `output` argument is provided, a promise for a readable stream for the archive will be returned.

#### input

Type: `string|string[]`

Input glob(s).

#### output

Type: `string|WritableStream`

Optional output path or a writable stream.

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
