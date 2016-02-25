[karma](https://github.com/karma-runner/karma)-[coverage](https://github.com/karma-runner/karma-coverage)-html-index-reporter
=========================

Quick and dirty solution to the problem of separate coverage html report for each browser.
It creates `index.html` and shows reports in iframe allowing to switch between then in one click. 

Installation
------------

Install the `karma-chai-plugins`:

```sh
$ npm install karma-coverage-html-index-reporter --save-dev
```

Add `coverage-html-index` alongside the `coverage` to the `reporters` key in your Karma configuration:

```js
module.exports = function (config) {
  config.set({
    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress', 'coverage', 'coverage-html-index']

    // ...
  })
}  
```

Acknowledgements
----------------

Small portions of code are taken from [karma-coverage](https://github.com/karma-runner/karma-coverage).


Contribution guidelines
-----------------------

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using `npm test`.
