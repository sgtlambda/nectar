# [![nectar](media/logo.png)](https://github.com/sgtlambda/nectar)

> Create `.tar` archive of files matching glob(s)

Makes a great team with [extrakt](https://github.com/sgtlambda/extrakt).

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

await nectar(['resources/**/*.js'], 'bundle.tar');
// packs all .js files inside 'resources' into 'bundle.tar'
```

#### Create `.tar.gz` (using streaming mode)

```js
const fs     = require('fs');
const zlib   = require('zlib');

const gZip   = zlib.createGzip();

nectar(['resources/**/*.js'])
    .pipe(gZip)
    .pipe(fs.createWriteStream('bundle.tar.gz'));
```

## API

### nectar(input, [output], [options])

Creates a `.tar` archive containing all files matched by the given input glob(s). The directory structure, relative to the working directory, is preserved.

If the `output` argument is provided, the archive is written to `output` and a promise is returned for an array of the paths of the matches entries.
If no `output` argument is provided, a promise for a readable stream for the archive will be returned.

#### input

Type: `string|string[]`

Input glob(s).

#### output

Type: `string|WritableStream`

Optional output path or a writable stream.

#### options.cwd

Type: `string`
Default: `process.cwd()`

Optional working directory for glob matching

## License

MIT © [sgtlambda](http://github.com/sgtlambda)

[![dependency Status][david-image]][david-url]
[![devDependency Status][david-dev-image]][david-dev-url]

[travis-image]: https://img.shields.io/travis/sgtlambda/nectar.svg?style=flat-square
[travis-url]: https://travis-ci.org/sgtlambda/nectar

[codeclimate-image]: https://img.shields.io/codeclimate/github/sgtlambda/nectar.svg?style=flat-square
[codeclimate-url]: https://codeclimate.com/github/sgtlambda/nectar

[david-image]: https://img.shields.io/david/sgtlambda/nectar.svg?style=flat-square
[david-url]: https://david-dm.org/sgtlambda/nectar

[david-dev-image]: https://img.shields.io/david/dev/sgtlambda/nectar.svg?style=flat-square
[david-dev-url]: https://david-dm.org/sgtlambda/nectar#info=devDependencies

[coveralls-image]: https://img.shields.io/coveralls/sgtlambda/nectar.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/sgtlambda/nectar

[npm-image]: https://img.shields.io/npm/v/nectar.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/nectar
