'use strict';

const isStream = require('is-stream');
const Promise  = require('pinkie-promise');
const globby   = require('globby');
const pify     = require('pify');
const tar      = require('tar-stream');
const fs       = require('fs');
const _        = require('lodash');

/**
 * Writes the given file to the given tar pack
 * @param {string} file
 * @param {Pack} pack
 * @returns {Promise.<boolean>} A promise for whether the file was packed
 */
const packFile = function (file, pack) {
    return pify(fs.stat)(file)
        .then(stat => !stat.isFile() ? Promise.resolve() : new Promise((resolve, reject) => {
            let entry = pack.entry(_.assign(stat, {name: file}), err => err ? reject(err) : resolve(true));
            fs.createReadStream(file).pipe(entry);
        }));
};

/**
 * Writes the given files to the given tar pack
 * @param {string[]} paths
 * @param {Pack} pack
 * @returns {Promise.<string[]>} A promise for an array of packed files
 */
const packAll = function (paths, pack) {
    let entries = [];
    return _.reduce(paths, (queue, path) => queue.then(() =>
            packFile(path, pack).then(packed => packed ? entries.push(path) : true)), Promise.resolve())
        .then(() => entries);
};

/**
 * Creates a tar archive containing all files matched by the given input glob(s). The directory structure is preserved.
 * @param {string|string[]} globs
 * @param {string} [output]
 * @returns {stream.Readable|Promise.<string[]>} A readable stream of the tar archive if no output argument is provided,
 *      or a promise for writing the tar archive to the given output destination.
 */
const nectar = function (globs, output) {
    let writeStream = null;
    if (_.isString(output))
        writeStream = fs.createWriteStream(output);
    else if (isStream.writable(output))
        writeStream = output;
    let pack          = tar.pack();
    let awaitWriteAll = globby(globs)
        .then(paths => packAll(paths, pack))
        .then(entries => {
            pack.finalize();
            return entries;
        });
    if (writeStream !== null) {
        pack.pipe(writeStream);
        let awaitEndStream = new Promise(resolve => pack.on('end', resolve));
        return Promise.all([awaitWriteAll, awaitEndStream]).then(values => values[0]);
    } else
        return pack;
};

module.exports = nectar;