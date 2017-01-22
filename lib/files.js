'use strict';

/**
 * Utility methods for working with filepaths and directories
 *
 * Created by LuisMiguelSerrano on 22/01/2017.
 */

var fs = require('fs');

var exports = {};

function isDirSync(aPath) {
    try {
        return fs.statSync(aPath).isDirectory();
    } catch (e) {
        if (e.code === 'ENOENT') {
            return false;
        } else {
            throw e;
        }
    }
}

function isFileSync(aPath) {
    try {
        return fs.statSync(aPath).isFile();
    } catch (e) {
        if (e.code === 'ENOENT') {
            return false;
        } else {
            throw e;
        }
    }
}

// --External Usage--
exports.isDirSync = isDirSync;
exports.isFileSync = isFileSync;

module.exports = exports;