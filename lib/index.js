'use strict';

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
 * @param {string} [wd=process.cwd()] The working the directory
 * @param {Object} [options] Options for node-glob
 * @returns {Promise.<stream.Readable>|Promise.<string[]>} A readable stream of the tar archive if no output argument is provided,
 *      or a promise for writing the tar archive to the given output destination.
 */
const nectar = function (globs, output, wd, options) {

    let writeStream = null;

    // Use process.cwd() as a default for the working directory if the argument was not provided
    if (!wd) wd = process.cwd();

    // Check if wd is an absolute path
    else if (!path.isAbsolute(wd)) throw new Error('Working directory argument needs to be an absolute path');

    if (_.isString(output)) {
        if (!path.isAbsolute(output)) output = path.join(wd, output);
        writeStream = fs.createWriteStream(output);
    } else if (isStream.writable(output))
        writeStream = output;

    globs = dirGlob.sync(makeGlobsAbsolute(arrify(globs), wd), {
        dot: true
    });

    return globby(globs, _.defaults(options, {
        nodir: true
    }))

        .then(entries => {
            let relativePaths = _.map(entries, entry => path.relative(wd, entry));

            let pack = tar.pack(wd, {entries: relativePaths.slice()});

            if (writeStream !== null) {
                pack.pipe(writeStream);
                return new Promise(resolve => pack.on('end', () => resolve(relativePaths)));
            } else
                return pack;
        });
};

module.exports = nectar;