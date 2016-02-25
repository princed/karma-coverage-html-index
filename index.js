var path = require('path');
var fs = require('fs');
var util = require('util');

var linkTemplate = '<li><a class="link%s" href="%s">%s</a></li>';
var linkActiveClass = ' link_active';

var templateFile = 'index.html';
var indexFile = 'index.html';

function reporter(rootConfig, helper, logger) {
  var log = logger.create('coverage-html-index');

  var config = rootConfig.coverageReporter || {};
  var reporterConfig = {};

  if (config.reporters) {
    config.reporters.forEach(function (currentReporterConfig) {
      if (currentReporterConfig.type === 'html') {
        reporterConfig = currentReporterConfig;
      }
    });
  }

  // Taken from karma-coverage
  var mainDir = reporterConfig.dir || config.dir;
  var resolvedOutputDir = path.resolve(rootConfig.basePath, mainDir);
  var outputDir = helper.normalizeWinPath(resolvedOutputDir);

  var coverageIndexPath = path.resolve(outputDir, indexFile);
  var templatePath = path.resolve(__dirname, templateFile);

  this.onRunComplete = function (browsers) {
    var browsersArray = browsers.
      serialize().
      sort(function (a, b) {
        return a.name > b.name;
      }).
      map(function (browser) {
        var browserDir = typeof reporterConfig.subdir === 'function' ? reporterConfig.subdir(browser.name) : browser.name;

        return {
          name: browser.name.replace(' 0.0.0', ''), // strip meaningless versions
          path: path.join(encodeURIComponent(browserDir), indexFile)
        }
      });

    var browsersList = browsersArray.map(function (browser, index) {
      var additionalClass = index === 0 ? linkActiveClass : '';

      return util.format(linkTemplate, additionalClass, browser.path, browser.name);
    }).join('\n');

    function writeFile(err, template) {
      if (err) {
        log.error(util.format('Unable to write template from "%s"', templatePath));
        return;
      }

      var defaultPath = browsersArray[0].path;
      var content = util.format(template.toString(), browsersList, defaultPath);

      log.debug('Writing coverage index.html to %s', coverageIndexPath);
      fs.writeFile(coverageIndexPath, content, function (err) {
        if (err) {
          log.error('Unable to write index.html to disk');
        }
      });
    }

    function readTemplate() {
      fs.readFile(templatePath, writeFile);
    }

    helper.mkdirIfNotExists(outputDir, readTemplate);
  };
}


reporter.$inject = ['config', 'helper', 'logger'];

module.exports = {
  'reporter:coverage-html-index': ['type', reporter]
};
