/**
 * Internal Configurations
 * Created by LuisMiguelSerrano on 20/01/2017.
 */

// Dependencies
const pkg = require('./../../package.json');

// Edit here
const TEMP_FOLDER_FOR_GENERATION = "TEMP_FOLDER";
const MAX_FILTERS_DIGITS = 3;

const DEFAULT_OUTPUT_FILENAME = 'resume.html';


// Config object
var config = {};

config.version = pkg.version;
config.temp_folder = TEMP_FOLDER_FOR_GENERATION;
config.max_filters_digits = MAX_FILTERS_DIGITS;

config.defaults = {};
config.defaults.output_filename = DEFAULT_OUTPUT_FILENAME;


module.exports = config;
