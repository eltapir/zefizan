// -------------------------------------------------------------------------------------------------
// IMPORTS
// -------------------------------------------------------------------------------------------------

// nodejs
const path = require('path');

// eleventy plugins
const eleventyPluginNavigation = require('@11ty/eleventy-navigation');
const eleventyPluginRev = require('eleventy-plugin-rev');
const eleventyPluginRollup = require('eleventy-plugin-rollup');
const eleventyPluginSass = require('eleventy-sass');
const Image = require('@11ty/eleventy-img');

// post css plugins
const autoprefixer = require('autoprefixer');
const postcss = require("postcss");

// post html plugins
const htmlMinifier = require ('html-minifier');

// rollup plugins
const commonjs = require('@rollup/plugin-commonjs');
const resolve = require('@rollup/plugin-node-resolve').nodeResolve;
const terser = require('@rollup/plugin-terser');


// -------------------------------------------------------------------------------------------------
// CONSTANTS / VARIABLES
// -------------------------------------------------------------------------------------------------

const isProduction = process.env.NODE_ENV === 'production';
const isFinal = process.env.FINAL === 'true';
const outputFolderName = '_site';
const pathPrefix = isFinal ? 'zefizan' : `${outputFolderName}`;
// const pathPrefix = isFinal ? '/' : `${outputFolderName}`;


// -------------------------------------------------------------------------------------------------
// CONFIGURATION
// -------------------------------------------------------------------------------------------------

module.exports = function(eleventyConfig) {


    // statics to copy
    // ---------------------------------------------------------------------------------------------

    eleventyConfig.addPassthroughCopy({ 'src/_assets/favicon': '_assets/favicon'});
    eleventyConfig.addPassthroughCopy({ 'src/_assets/fonts': '_assets/fonts'});
    eleventyConfig.addPassthroughCopy({ 'src/_assets/images': '_assets/images'});


    // targets to watch
    // ---------------------------------------------------------------------------------------------

    eleventyConfig.addWatchTarget('src/_assets/js/');


    // plugins
    // ---------------------------------------------------------------------------------------------

    eleventyConfig.addPlugin(eleventyPluginNavigation);
    
    eleventyConfig.addPlugin(eleventyPluginRev);

    eleventyConfig.addPlugin(eleventyPluginRollup, {

        rollupOptions: {

            output: {

                format: 'esm',
                dir: path.join(outputFolderName, '_assets', 'js'),
            },

            plugins: [

                commonjs(),
                resolve(),
                isProduction && terser()   
            ]
        },

        scriptGenerator: filePath  => {

            return `<script type="module" src="${path.join('/', pathPrefix, '_assets', 'js', path.basename(filePath))}"></script>`
        }

    });

    eleventyConfig.addPlugin(eleventyPluginSass, {

        compileOptions: {

            permalink: function(contents, inputPath) {

                return (data) => data.page.filePathStem.replace(/^\/scss\//, '/css/') + '.css';
            }
        },

        sass: {
            
            style: (isProduction ? 'compressed' : 'expanded'),
            sourceMap: false
        },

        postcss: postcss([ autoprefixer ]),

        rev: true // add hashes to files (eleventy-plugin-rev)

    });


    // transforms
    // ---------------------------------------------------------------------------------------------
    
    eleventyConfig.addTransform ('htmlMinifier', (content, outputPath) => {

        if (isProduction && outputPath.endsWith('.html')) {

            return htmlMinifier.minify (content, {

                useShortDoctype: true,
                removeComments: true,
                collapseWhitespace: true,
            });
        }

        return content;
    });


    // shortcodes
    // ---------------------------------------------------------------------------------------------
    
    async function menuLabelShortcode(lbl) {

        const lblArr = lbl.split(' ');
        let labelHTML = lblArr[0];

        if (lblArr.length > 1) {

            for (let i = 1; i < lblArr.length; i++) {

                labelHTML += `<span>${lblArr[i]}</span>`;
            }
        }

        console.log(labelHTML);

        return labelHTML;
    }

    async function imageLinkShortcode(imageData, widths = [480]) {

        const imagePath = path.join('..', '_assets', 'gallery');
        const imageURL = path.join('src', '_assets', 'gallery', '/') + imageData.file;
        const maxIndex = widths.length - 1;
        const imageMeta = await Image(imageURL, {

            widths,
            formats: ['webp'],

            outputDir: path.join(__dirname, outputFolderName, '_assets', 'gallery')
        });


        console.log(imageMeta);


        let linkHTML = `
            <a
                class="image-link"
                href="${path.join(imagePath, imageMeta.webp[maxIndex].filename)}"
                data-caption="${imageData.title}"
        `;

        widths.forEach((w, i) => {

            linkHTML += `data-at-${w}="${path.join(imagePath, imageMeta.webp[i].filename)}"`;
        });

        linkHTML += `>`;

        linkHTML += `
            <div class="image-thumb">
                <img
                    src="${path.join(imagePath, imageMeta.webp[0].filename)}"
                    alt="${imageData.title}"
                    width="${imageMeta.webp[0].width}"
                    height="${imageMeta.webp[0].height}"
                    loading="lazy"
                >
            </div>
            <div class="image-props">
                <h3>${imageData.title}</h3>
                <p>${imageData.year}</p>
            </div>
        `;

        linkHTML += `</a>`;
                
        return linkHTML;
    }

    eleventyConfig.addNunjucksAsyncShortcode("menuLabel", menuLabelShortcode);
    eleventyConfig.addNunjucksAsyncShortcode("imageLink", imageLinkShortcode);


    // return configuration
    // ---------------------------------------------------------------------------------------------
    
    return {

        pathPrefix,

        dir: {

            input: 'src',
            data: '_data',
            includes: '_includes',
            layouts: '_layouts',
            output: outputFolderName
        },

        templateFormats: [ 'md', 'njk', 'html' ],
        markdownTemplateEngine: 'njk',
        htmlTemplateEngine: 'njk',
        dataTemplateEngine: 'njk'
    };    
}

