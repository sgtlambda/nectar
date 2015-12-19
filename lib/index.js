'use strict';

const Promise = require('pinkie-promise');
const Worqer  = require('worq');
const globby  = require('globby');
const pify    = require('pify');
const tar     = require('tar-stream');
const fs      = require('fs');
const _       = require('lodash');

/**
 * @param {string|string[]} globs
 * @param {string} [output]
 * @returns {stream.Readable|Promise}
 */
const nectar = function (globs, output) {
    let writeStream = _.isString(output) ? fs.createWriteStream(output) : null;
    let pack        = tar.pack();
    let handler     = new Worqer(name => {
        return pify(fs.stat)(name)
            .then(stat => {
                let readStream = fs.createReadStream(name);
                let entry      = pack.entry(_.assign(stat, {name}));
                return new Promise((resolve) => {
                    readStream.on('end', resolve);
                    readStream.pipe(entry);
                });
            });
    });
    globby(globs).then(paths => {
        _.each(paths, path => handler.process(path));
        handler.close().then(() => pack.finalize());
    });
    if (writeStream !== null) {
        pack.pipe(writeStream);
        return new Promise(resolve => pack.on('end', resolve));
    } else {
        return pack;
    }
};

module.exports = nectar;