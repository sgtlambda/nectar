'use strict';

require('./support/bootstrap');

const isStream = require('is-stream');
const zlib     = require('zlib');
const fs       = require('fs');
const pify     = require('pify');
const del      = require('del');
const nectar   = require('./../lib/index');
const Promise  = require('pinkie-promise');

describe('nectar', () => {

    beforeEach(() => del(['test/tmp/*']));

    it('should pack only the files matched by the provided glob(s)', () => {
        return nectar(['test/sample/*azba*'], 'test/tmp/out.tar').should.eventually.have.length(1);
    });

    it('should accept a destination file as the second argument', () => {
        return nectar(['test/sample/*'], 'test/tmp/out.tar')
            .then(() => pify(fs.access)('test/tmp/out.tar'));
    });

    it('should accept a write stream as the second argument', () => {
        let gZip        = zlib.createGzip();
        let writeStream = gZip.pipe(fs.createWriteStream('test/tmp/out.tar.gz'));
        return nectar(['test/sample/**/*'], writeStream)
            .then(() => pify(fs.access)('test/tmp/out.tar.gz'));
    });

    it('should include dotfiles when using the short-style directory syntax', () => {
        return nectar(['test/sample'], 'test/tmp/out.tar').should.eventually.have.length(4);
    });

    it('should allow passing options for node-glob', () => {
        return nectar(['test/sample'], 'test/tmp/out.tar', {
            glob: {dot: false},
        }).should.eventually.have.length(2);
    });

    it('should allow negating globs', () => Promise.all([
        nectar(['test/sample'], 'test/tmp/out.tar').should.eventually.have.length(4),
        nectar(['test/sample', '!test/sample/bar'], 'test/tmp/out.tar').should.eventually.have.length(3),
    ]));

    it('should return a readable stream if no output argument is provided', () => {
        return nectar(['test/sample/*bar*']).then(stream => isStream.readable(stream).should.be.true);
    });
});
