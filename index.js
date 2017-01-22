#!/usr/bin/env node
'use strict';

/**
 * resume-builder
 *
 * Created by LuisMiguelSerrano on 20/01/2017.
 */

// Dependencies
const config = require('./config');
const program = require('commander');

var chalk = require('chalk');
var figlet = require('figlet');
var fs = require('fs');
var path = require('path');
var prompt = require('synchronous-user-input');
var stripJsonComments = require('strip-json-comments');
var jsonMergePatch = require('json-merge-patch');

// Internal dependencies
var resumeExport = require('./lib/resumeExport.js');
var resumeExportInstance = new resumeExport();
var files = require('./lib/files.js');

var resume_builder = {};


console.log(
    chalk.yellow(
        figlet.textSync('Resume Builder', { horizontalLayout: 'full' })
    )
);

program
    .version(config.version)
    .usage('[-j /path/to/jobs.json] | [-r /path/to/resume.json -o /path/to/output.html -t /path/to/theme/index.js]')
    .option('-j, --jobs <jobs>', 'Execute the export jobs described in the provided JSON file')
    .option('-r, --resume <resume>', 'Input resume json file')
    .option('-o, --output <output>', 'Output resume filepath')
    .option('-t, --theme <theme>', 'JSON Resume index.js filepath of the theme to use when exporting')
    .option('-f, --force', 'Force overwrite output file and temp folder')
    .parse(process.argv);


if (!program.jobs &&
    (!program.resume || !program.output || !program.theme)) {
    console.log('The resume-builder script must be run with either -j or the set of -r -o -t');

    program.help();
    process.exit();
}

var jobs_file = fs.readFileSync(program.jobs, 'utf8');
resume_builder.jobs = JSON.parse(jobs_file);

processJobs(resume_builder.jobs);
process.exit();

// Functions
function processJobs(jobs) {
    for(var i = 0; i!=jobs.length; ++i) {
        console.log('Processing job #' + i);
        processJob(jobs[i]);
    }
    console.log('Done processing all ' + jobs.length + ' jobs');
}

function processJob(job) {
    var proceed;

    // --Safety Checks and Preparation--
    // Create output folder if it doesn't exist
    if(!files.isDirSync(job.output_folder)) {
        fs.mkdirSync(job.output_folder);
    }
    // Check if output file exists (if the force flag wasn't provided)
    var output_filename = job.output_filename ? job.output_filename : config.defaults.output_filename;
    var output_filepath = job.output_folder + '/' + output_filename;
    if(files.isFileSync(output_filepath)) {
        if(!program.force) {
            console.log("Warning! The output file " + output_filename + " already exists in path: " + job.output_folder);
            proceed = prompt("If you continue, the existing file will be deleted and overwritten. Proceed anyway? (Y/n)");
            if(proceed !== 'Y' && proceed !== 'y') {
                console.log('Aborting execution by user request');
                return;
            }
        }
        fs.unlinkSync(output_filepath);
    }
    // Warn if temp folder already exists
    var temp_folder_path = job.output_folder + '/' + config.temp_folder;
    if(files.isDirSync(temp_folder_path)) {
        if(!program.force) {
            console.log("Warning! A " + config.temp_folder + " folder already exists in path: " + job.output_folder);
            proceed = prompt("If you continue, the contents of that temp folder will be deleted. Proceed anyway? (Y/n)");
            if(proceed !== 'Y' && proceed !== 'y') {
                console.log('Aborting execution by user request');
                return;
            }
        }
    }
    else {
        fs.mkdirSync(temp_folder_path);
    }

    var list_files_for_cleanup = [];
    var filter_filepaths = [];

    // Remove comments from all the JSON files and create temporary files
    var resume_file = fs.readFileSync(job.resume_path, 'utf8');
    var commentless_resume_filepath = temp_folder_path + '/' + 'base_full_resume.json';
    fs.writeFileSync(commentless_resume_filepath, stripJsonComments(resume_file));
    list_files_for_cleanup.push(commentless_resume_filepath);
    for(var i = 0; i!=job.filters.length; ++i) {
        var filter_file = fs.readFileSync(job.filters[i], 'utf8');
        var commentless_filter = 'filter_' + i + '.json';
        var filter_filepath = temp_folder_path + '/' + commentless_filter;
        fs.writeFileSync(filter_filepath, stripJsonComments(filter_file));
        filter_filepaths.push(filter_filepath);
        list_files_for_cleanup.push(filter_filepath);
    }

    var merged_result = JSON.parse(fs.readFileSync(commentless_resume_filepath, 'utf8'));
    for(i = 0; i != filter_filepaths.length; ++i) {
        var filter = JSON.parse(fs.readFileSync(filter_filepaths[i], 'utf-8'));
        merged_result = jsonMergePatch.apply(merged_result, filter);
    }
    var merged_filepath = temp_folder_path + '/' + 'merged_resume.json';
    fs.writeFileSync(merged_filepath, JSON.stringify(merged_result, null, 4));
    list_files_for_cleanup.push(merged_filepath);

    // Export with theme
    resumeExportInstance.export(merged_filepath, output_filepath, job.theme_js_path);
    console.log('Successfully exported: ' + output_filepath);

    // -- Cleanup --
    list_files_for_cleanup.forEach(function(filename) {
        fs.unlinkSync(filename);
    });
    fs.rmdirSync(temp_folder_path);
}
