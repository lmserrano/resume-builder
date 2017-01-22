'use strict';

/**
 * resume-cli has no way of exporting with a local theme yet, export it manually
 *
 * Created by LuisMiguelSerrano on 20/01/2017.
 */

const config = require('../config');

var fs = require('fs');

var exportResume = function(input_filepath, output_filepath, theme_index_filepath) {
    var resumeJsonFileContent = fs.readFileSync(input_filepath, 'utf-8');
    var resumeJson = JSON.parse(resumeJsonFileContent);
    var render = require(theme_index_filepath).render;
    fs.writeFileSync(output_filepath, render(resumeJson));
};

// --External Usage--
var resumeExport = function (){
    var self = this;
    self.export = exportResume;
};

module.exports = resumeExport;
