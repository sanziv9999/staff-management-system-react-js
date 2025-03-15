module.exports = {
    webpack: {
      configure: (webpackConfig) => {
        const sourceMapLoader = webpackConfig.module.rules.find(rule =>
          rule.loader && rule.loader.includes('source-map-loader')
        );
        if (sourceMapLoader) {
          sourceMapLoader.exclude = [/node_modules\/react-datepicker/];
        }
        return webpackConfig;
      },
    },
  };