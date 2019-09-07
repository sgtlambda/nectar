const globby = require('globby');
const path   = require('path');

const micromatch = require('micromatch');

console.log(micromatch([
    'sample/file/file.txt',
    'sample/.file/file.txt',
], ['sample/{.,}**/{.,}**']));

(async () => {
    const patterns = [
        'test/sample/{.,}**/{.,}*',
        'test/sample/{.,}*',
    ];
    const r        = await globby(patterns);
    console.log(r);
})();
