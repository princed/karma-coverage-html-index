var path = require('path');
var fs = require('fs');
var util = require('util');

var linkTemplate = '<li><a class="link%s" href="%s">%s</a></li>';
var linkActiveClass = ' link_active';

function reporter(rootConfig, helper, logger) {
  var log = logger.create('coverage-html-index');

  var config = rootConfig.coverageReporter || {};
  var reporterConfig;

  if (config.reporters) {
    config.reporters.forEach(function (currentReporterConfig) {
      if (currentReporterConfig.type === 'html') {
        reporterConfig = currentReporterConfig;
      }
    });
  }

  //
  var mainDir = reporterConfig && reporterConfig.dir || config.dir;
  var resolvedOutputDir = path.resolve(rootConfig.basePath, mainDir);
  var outputDir = helper.normalizeWinPath(resolvedOutputDir);

  var coverageIndexPath = path.resolve(outputDir, 'index.html');
  var templatePath = path.resolve(__dirname, 'index.html');

  this.onRunComplete = function (browsers) {
    var browsersArray = browsers.serialize().sort(function (a, b) {
      return a.name < b.name;
    });
    var browsersList = browsersArray.map(function (browser, index) {
      var shortBrowserName = browser.name.replace(' 0.0.0', ''); // strip meaningless versions
      var additionalClass = index === 0 ? linkActiveClass : '';

      return util.format(linkTemplate, additionalClass, browser.name, shortBrowserName);
    }).join('\n');

    function writeFile(err, template) {
      if (err) {
        log.error(util.format('Unable to write template from "%s"', templatePath));
        return;
      }

      var content = util.format(template.toString(), browsersList, browsersArray[0].name);

      log.warn('Writing coverage index.html to %s', coverageIndexPath);
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
