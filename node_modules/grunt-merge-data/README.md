# grunt-merge-data

[![NPM version](https://img.shields.io/npm/v/grunt-merge-data.svg)](https://www.npmjs.com/package/grunt-merge-data)
[![Build Status](https://travis-ci.org/shinnn/grunt-merge-data.svg?branch=master)](https://travis-ci.org/shinnn/grunt-merge-data)
[![Build status](https://ci.appveyor.com/api/projects/status/ckiescfon6xcce0f?svg=true)](https://ci.appveyor.com/project/ShinnosukeWatanabe/grunt-merge-data)
[![Dependency Status](https://david-dm.org/shinnn/grunt-merge-data.svg)](https://david-dm.org/shinnn/grunt-merge-data)
[![devDependency Status](https://david-dm.org/shinnn/grunt-merge-data/dev-status.svg)](https://david-dm.org/shinnn/grunt-merge-data#info=devDependencies)

Merge multiple data into a single JSON file or Grunt config, based on their basename

## Installation

[Use npm](https://docs.npmjs.com/cli/install).

```sh
npm install --save-dev grunt-merge-data
```

## Usage

The plugin may be enabled inside your Gruntfile with this line of JavaScript:

```javascript
grunt.loadNpmTasks('grunt-merge-data');
```

### The `merge_data` task

In your project's Gruntfile, add a section named `merge_data` to the data object passed into `grunt.initConfig()`.

```javascript
grunt.initConfig({
  merge_data: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      src: ['path/to/src/*.{json,y{,a}ml}']
      dest: 'path/to/dest/all.json'
    }
  }
})
```

Running `merge_data` task task with `grunt merge_data` command will merge all data of specified JSON or YAML files into a single JavaScript object, and write it as a JSON file.

Each of the data will be formatted as `{<basename of file>: <data of file>}`.
For example, when the source path of task target specifies two files, such as:

data1.json:

```json
["Classic", "Jazz", "Rock"]
```
data2.yaml:

```yaml
first_name: John
family_name: Smith
```

they will be merged into a JSON file like this:

```json
{
  "data1": ["Classic", "Jazz", "Rock"],
  "data2": {
    "first_name": "John",
    "family_name": "Smith"
  }
}
```

### Options

#### options.data
Type: `Object|Function`
Default: `null`

This is an additional data that will be merged together with the sources files.

This option will overrides existing data of source files.
For example, when `option.data` is `{data1: 'something'}`, the data of `data1.json` won't be reflected in the output.

This value also might be a function taking a data object of source files as the first argument and returns a data object.

```javascript
options: {
  data: function (data) {
    return {
      next_year: data.year + 1,
      prev_year: data.year - 1
    };
  }
}
```

#### options.space
Type: `Number|String`
Default: `null`

This option will be directly passed to the [`space` argument](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#space_argument) of `JSON.stringify`. You can control indent style of output file with this option. 

#### options.asConfig
Type: `String|Array|Boolean`
Default: `false`

If you specified the project's Grunt configuration in this option, merge result will be assigned to it. See [Accessing Config Data](http://gruntjs.com/api/grunt.config#accessing-config-data) to use this option.

Or, if you set this option `true`, the `context` property of the task traget will be overwritten with the merge result.

For example, if the task is configured such as:

```javascript
grunt.initConfig({
  merge_data: {
    target1: {
      options: {
        asConfig: true
      },
      src: ['path/to/src/*.{json,y{,a}ml}']
    }
  }
})
``` 

the merge result will be assigned to `merge_data.target1.context`.

When you use this option, you can also specify the destination path of task target but don't need to.
If you do so, at the same time the Grunt configuration will be updated, the JSON file will be output. Both the configuration and the JSON file will have the same value.

### Usage Examples

#### Default Options

```javascript
grunt.initConfig({
  merge_data: {  
    files: {
      'dest/all.json': ['src/data1.json', 'src/data2.json'],
    }
  }
})
```

#### Updating Grunt configuration

```javascript
grunt.initConfig({
  merge_data: {
    options: {
      asConfig: 'someConfig.data' 
    },
    src: ['src/data1.json', 'src/data2.json']
  }
  
  someConfig: {}
})
```

## License

Copyright (c) 2013 - 2015 [Shinnosuke Watanabe](https://github.com/shinnn).

Licensed under [the MIT license](./LICENSE).
