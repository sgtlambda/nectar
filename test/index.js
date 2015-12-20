'use strict';

const fs      = require('fs');
const pify    = require('pify');
const del     = require('del');
const tar     = require('tar');
const nectar  = require('./../lib/index');
const Promise = require('pinkie-promise');

describe('nectar', () => {
    beforeEach(() => del(['test/tmp/*']));
    it('should pack only the files matched by the provided glob(s)', () => {
        let pack    = nectar(['test/sample/*bar*']);
        let parse   = tar.Parse();
        let entries = [];
        parse.on('entry', e => entries.push(e));
        pack.pipe(parse);
        return new Promise(resolve => {
            pack.on('end', () => resolve());
        }).then(() => {
            entries.length.should.equal(1);
            entries[0].path.should.equal('test/sample/foobar.txt');
        });
    });
    it('should accept a destination file as the second argument', () => {
        return nectar(['test/sample/*'], 'test/tmp/out.tar')
            .then(() => pify(fs.access)('test/tmp/out.tar'));
    });
    it('should accept a write stream as the second argument', () => {
        let writeStream = fs.createWriteStream('test/tmp/out.tar');
        return nectar(['test/sample/**/*'], writeStream)
            .then(() => pify(fs.access)('test/tmp/out.tar'));
    });
    it('should return a promise for an array of the paths of packed files', () => {
        return nectar(['test/sample/**/*'], 'test/tmp/out.tar').should.eventually.have.length(3);
    });
});