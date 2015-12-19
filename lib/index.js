'use strict';

const Promise = require('pinkie-promise');
const globby  = require('globby');
const pify    = require('pify');
const tar     = require('tar-stream');
const fs      = require('fs');
const _       = require('lodash');

/**
 * Creates a tar archive containing all files matched by the given input glob(s). The directory structure is preserved.
 * @param {string|string[]} globs
 * @param {string} [output]
 * @returns {stream.Readable|Promise} A readable if no output argument is provided, or a promise for writing the tar archive to the given output destination.
 */
const nectar = function (globs, output) {
    let writeStream = _.isString(output) ? fs.createWriteStream(output) : null;
    let pack        = tar.pack();
    globby(globs).then(paths => {
        let queue = Promise.resolve();
        _.each(paths, path => {
            queue = queue.then(() => pify(fs.stat)(path)
                .then(stat => {
                    let readStream = fs.createReadStream(path);
                    let entry      = pack.entry(_.assign(stat, {name: path}));
                    return new Promise((resolve) => {
                        readStream.on('end', resolve);
                        readStream.pipe(entry);
                    });
                })
            );
        });
        queue.then(() => pack.finalize());
    });
    if (writeStream !== null) {
        pack.pipe(writeStream);
        return new Promise(resolve => pack.on('end', resolve));
    } else {
        return pack;
    }
};

module.exports = nectar;