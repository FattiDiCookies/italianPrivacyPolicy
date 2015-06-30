# grunt-htmljson

> JSON for yo html templates

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-htmljson --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-htmljson');
```

## The "htmljson" task

### Overview
In your project's Gruntfile, add a section named `htmljson` to the data object passed into `grunt.initConfig()`.

### Options

#### options.separator
Type: `String|Number|Null`
Default value: `null`

A string value that is used to do something with whatever.

### Usage Examples

#### Default Options
In this example, the default options are used to do something with whatever. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result would be `Testing, 1 2 3.`

```js
grunt.initConfig({
  htmljson: {
    src: ['src/templates/**/*.html'],
    dest: 'dist/templates/combined.json'
  }
})
```

#### Custom Options
In this example, custom options are used to do something else with whatever else. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result in this case would be `Testing: 1 2 3 !!!`

```js
grunt.initConfig({
  htmljson: {
    src: ['src/templates/**/*.html'],
    dest: 'dist/templates/combined.json',
    options: {
      separator: 2
    }
  },
})
```

## Todo
- Write some tests

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
```
0.1.0 -- Initial release
```
