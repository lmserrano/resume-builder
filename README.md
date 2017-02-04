[![NPM version][npm-version-image]][npm-url] [![NPM downloads][npm-downloads-image]][npm-url] [![MIT License][license-image]][license-url]

# resume-builder

Resume Builder (resume-builder) is a node.js cli tool for running configurable resume-building tasks.

Currently it is focused on exporting a final .html resume file.

The tool allows performs the following steps (preserving the original resume file and filters):
- Strip eventual comments from the input JSON file (and filters)
- Merge the input json resume with eventual filter json files (which will overwrite specific parts of the JSON)
- Apply a JSON Resume theme (from a local repo)
- Generate an output .html file with the resume output result

All this can be done without need for an internet connection (provided that everything was previously setup).

In order to use the tool, the CV should be a valid JSON Resume file.

With this tool, it is possible to easily have a single json resume file, and some specific filters, and a jobs.json which will allow the tool to generate multiple CV files for specific purposes, with a single command call.

## Usage

Install by running: `npm install -g resume-builder`

For a list of the available options and commands run: `resume-builder --help`

### Using a jobs file

You can provide a file with a list of json jobs to be executed as follows:

```sh
resume-builder -j src/config/jobs.json
```

The file describing the jobs should be in the format specified in `jobs.json.template`

```json
// Jobs List
[
  // Job
  {
    "resume_path": "path/to/resume.json",
    "theme_js_path": "path/to/theme/folder/index.js",
    "filters": [ "path/to/filter1.json", "path/to/filter2.json" ],
    "output_folder": "path/output/folder",
    // Optional
    "output_filename": "my_exported_resume.html"
  }
]
```

### Specifying the set of files to use

Run as follows:

```sh
resume-builder -r path/to/resume.json -o path/to/output.html -t path/to/theme/index.js
```

## Related

- [JSONResume GitHub Page](https://github.com/jsonresume) - JSON Resume projects

## License

MIT © [Luis Miguel Serrano](https://github.com/lmserrano)


[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: LICENSE

[npm-url]: https://npmjs.org/package/resume-builder
[npm-version-image]: https://img.shields.io/npm/v/resume-builder.svg?style=flat
[npm-downloads-image]: http://img.shields.io/npm/dm/resume-builder.svg?style=flat