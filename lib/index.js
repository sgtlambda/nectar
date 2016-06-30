'use strict';

const isStream = require('is-stream');
const Promise  = require('pinkie-promise');
const globby   = require('globby');
const tar      = require('tar-fs');
const fs       = require('fs');
const _        = require('lodash');
const dirGlob  = require('dir-glob');
const path     = require('path');

/**
 * Make the given glob absolute based on the given working directory
 * Takes into account the possibility of a leading "!"
 * @param {string} glob
 * @param {string} wd
 * @returns {string}
 */
const makeGlobAbsolute = (glob, wd) =>
    _.startsWith(glob, '!') ? ('!' + path.join(wd, glob.substring(1))) : path.join(wd, glob);

/**
 * Creates a tar archive containing all files matched by the given input glob(s). The directory structure is preserved.
 * @param {string|string[]} globs
 * @param {string|stream.Writable} [output]
 * @param {string} [wd=process.cwd()] The working the directory
 * @returns {Promise.<stream.Readable>|Promise.<string[]>} A readable stream of the tar archive if no output argument is provided,
 *      or a promise for writing the tar archive to the given output destination.
 */
const nectar = function (globs, output, wd) {

    let writeStream = null;

    // Use process.cwd() as a default for the working directory if the argument was not provided
    if (!wd) wd = process.cwd();

    // Check if wd is an absolute path
    else if (!path.isAbsolute(wd)) throw new Error('Working directory argument needs to be an absolute path');

    // Make all globs absolute
    globs = _.map(globs, glob => path.isAbsolute(glob) ? glob : makeGlobAbsolute(glob, wd));

    if (_.isString(output)) {
        if (!path.isAbsolute(output)) output = path.join(wd, output);
        writeStream = fs.createWriteStream(output);
    } else if (isStream.writable(output))
        writeStream = output;

    return dirGlob(_.isArray(globs) ? globs : [globs])

        .then(globs => globby(globs, {nodir: true}))

        .then(entries => {
            let relativePaths = _.map(entries, entry => path.relative(wd, entry));

            let pack = tar.pack(process.cwd(), {entries: relativePaths.slice()});

            if (writeStream !== null) {
                pack.pipe(writeStream);
                return new Promise(resolve => pack.on('end', () => resolve(relativePaths)));
            } else
                return pack;
        });
};

module.exports = nectar;