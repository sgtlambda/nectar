'use strict';

const defaults          = require('defa');
const isStream          = require('is-stream');
const Promise           = require('pinkie-promise');
const globby            = require('globby');
const tar               = require('tar-fs');
const fs                = require('fs');
const _                 = require('lodash');
const arrify            = require('arrify');
const dirGlob           = require('dir-glob');
const path              = require('path');
const makeGlobsAbsolute = require('make-globs-absolute');

/**
 * Creates a tar archive containing all files matched by the given input glob(s). The directory structure is preserved.
 * @param {string|string[]} globs
 * @param {string|stream.Writable} [output]
 * @param {Object} [options = {}] Options
 * @param {string} [options.cwd=process.cwd()] The working the directory
 * @param {Object} [options.glob] Options for node-glob
 * @param {Object} [options.tar] Options for tar-fs (tar.pack)
 * @returns {Promise.<stream.Readable>|Promise.<string[]>} A readable stream of the tar archive if no output argument is provided,
 *      or a promise for writing the tar archive to the given output destination.
 */
const nectar = function (globs, output, options) {

    options = defaults(options, {
        cwd: process.cwd()
    });

    let cwd = options.cwd;

    let writeStream = null;

    // Check if wd is an absolute path
    if (!path.isAbsolute(cwd)) throw new Error('Working directory argument needs to be an absolute path');

    if (_.isString(output)) {
        if (!path.isAbsolute(output)) output = path.join(cwd, output);
        writeStream = fs.createWriteStream(output);
    } else if (isStream.writable(output))
        writeStream = output;

    globs = dirGlob.sync(makeGlobsAbsolute(arrify(globs), cwd), {
        dot: true
    });

    return globby(globs, defaults(options.glob, {
        nodir: true
    }))

        .then(entries => {
            let relativePaths = _.map(entries, entry => path.relative(cwd, entry));

            let pack = tar.pack(cwd, defaults(options.tar, {
                entries: relativePaths.slice()
            }));

            if (writeStream !== null) {
                pack.pipe(writeStream);
                return new Promise(resolve => pack.on('end', () => resolve(relativePaths)));
            } else
                return pack;
        });
};

module.exports = nectar;