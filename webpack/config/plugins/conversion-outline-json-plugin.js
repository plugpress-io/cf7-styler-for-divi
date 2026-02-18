/* eslint-disable class-methods-use-this */
const jscodeshift = require('jscodeshift');
const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const glob = require('glob');
const extractStaticProperties = require('./extract-static-properties');

/**
 * Webpack plugin that generates conversion-outline.json from conversion-outline.js/ts files.
 * Looks for a variable named conversionOutline, extracts its properties, and writes
 * conversion-outline.json in the same directory. JSON is also required at plugin root
 * (modules-json) via CopyWebpackPlugin; this plugin emits in src so copy can run.
 */
class ConversionOutlineJsonPlugin {
  apply(compiler) {
    compiler.hooks.beforeCompile.tapAsync(
      'ConversionOutlineJsonPlugin',
      (params, callback) => {
        const searchPattern = 'src/divi5/modules/**/conversion-outline.{js,ts}';

        try {
          const files = glob.sync(searchPattern);

          Promise.all(
            files.map(async (fullFilePath) => {
              try {
                const source = await fsp.readFile(fullFilePath, 'utf8');
                const ext = path.extname(fullFilePath);
                const parser = ext === '.ts' ? 'ts' : 'babel';
                const root = jscodeshift.withParser(parser)(source);

                const outlineCollection = root
                  .find(jscodeshift.VariableDeclarator)
                  .filter(
                    (astPath) => astPath.value.id?.name === 'conversionOutline'
                  );

                if (outlineCollection.size() === 0) {
                  return;
                }

                const init = outlineCollection.get().node.init;
                if (!init || init.type !== 'ObjectExpression') {
                  return;
                }

                const conversionOutlineProperties = extractStaticProperties(
                  init.properties
                );

                const conversionOutlineJson = {
                  _comment:
                    '!!! THIS IS AN AUTOMATICALLY GENERATED FILE - DO NOT EDIT !!!',
                  ...conversionOutlineProperties,
                };

                const jsonContent = JSON.stringify(conversionOutlineJson, null, 2);
                const outputPath = path.join(
                  path.dirname(fullFilePath),
                  'conversion-outline.json'
                );

                await fsp.writeFile(outputPath, jsonContent);
              } catch (fsError) {
                throw fsError;
              }
            })
          )
            .then(() => callback())
            .catch((err) => callback(err));
        } catch (error) {
          callback(error);
        }
      }
    );
  }
}

module.exports = ConversionOutlineJsonPlugin;
