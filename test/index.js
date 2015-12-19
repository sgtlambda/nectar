'use strict';

const fs      = require('fs');
const pify    = require('pify');
const del     = require('del');
const tar     = require('tar');
const nectar  = require('./../lib/index');
const Promise = require('pinkie-promise');

describe('nectar', () => {
    it('packs only the files matched by the provided glob(s)', () => {
        let pack    = nectar(['test/sample/*bar*']);
        let parse   = tar.Parse();
        let entries = [];
        parse.on('entry', e => entries.push(e));
        pack.pipe(parse);
        return new Promise(resolve => {
            pack.on('end', () => resolve())
        }).then(() => {
            entries.length.should.equal(1);
            entries[0].path.should.equal('test/sample/foobar.txt');
        });
    });
    it('should write the archive to a file when a second argument is provided', () => {
        return del(['test/tmp/out.tar'])
            .then(nectar(['test/sample/*'], 'test/tmp/out.tar'))
            .then(() => pify(fs.access)('test/tmp/out.tar'));
    });
});