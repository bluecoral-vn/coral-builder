const fs = require("fs");
const fs_Extra = require("fs-extra");
const path = require("path");
const replace = require("replace-in-file");
const escapeRegExp = require("lodash.escaperegexp");

const WORDPRESS_THEME = "wp-theme-name";

// the directory in which you're outputting your build
let baseDir = "../statics";
// the name for the directory where your static files will be moved to
let staticDir = "images";
// the directory where your built files (css and JavaScript) will be moved  to
let assetsDir = "assets";
let cssDir = "assets/css";
let jsDir = "assets/js";
let fontsDir = "assets/fonts";
let imagesDir = "assets/images";

// same for the assetsDir directory
if (!fs.existsSync(path.join(__dirname, baseDir, assetsDir))) {
  fs.mkdirSync(path.join(__dirname, baseDir, assetsDir));
}

if (!fs.existsSync(path.join(__dirname, baseDir, cssDir))) {
  fs.mkdirSync(path.join(__dirname, baseDir, cssDir));
}

if (!fs.existsSync(path.join(__dirname, baseDir, jsDir))) {
  fs.mkdirSync(path.join(__dirname, baseDir, jsDir));
}

if (!fs.existsSync(path.join(__dirname, baseDir, fontsDir))) {
  fs.mkdirSync(path.join(__dirname, baseDir, fontsDir));
}

if (!fs.existsSync(path.join(__dirname, baseDir, imagesDir))) {
  fs.mkdirSync(path.join(__dirname, baseDir, imagesDir));
}

// wordpress
let baseWPDir = "../wp-content";
let themeWPDir = `/themes/${WORDPRESS_THEME}`;
let assetsWPDir = `/themes/${WORDPRESS_THEME}/assets`;
let cssWPDir = `/themes/${WORDPRESS_THEME}/assets/css`;
let jsWPDir = `/themes/${WORDPRESS_THEME}/assets/js`;
let fontsWPDir = `/themes/${WORDPRESS_THEME}/assets/fonts`;
let imagesWPDir = `/themes/${WORDPRESS_THEME}/assets/images`;

if (!fs.existsSync(path.join(__dirname, baseWPDir, themeWPDir))) {
  fs.mkdirSync(path.join(__dirname, baseWPDir, themeWPDir));
}

if (!fs.existsSync(path.join(__dirname, baseWPDir, assetsWPDir))) {
  fs.mkdirSync(path.join(__dirname, baseWPDir, assetsWPDir));
}

if (!fs.existsSync(path.join(__dirname, baseWPDir, cssWPDir))) {
  fs.mkdirSync(path.join(__dirname, baseWPDir, cssWPDir));
}

if (!fs.existsSync(path.join(__dirname, baseWPDir, jsWPDir))) {
  fs.mkdirSync(path.join(__dirname, baseWPDir, jsWPDir));
}

if (!fs.existsSync(path.join(__dirname, baseWPDir, fontsWPDir))) {
  fs.mkdirSync(path.join(__dirname, baseWPDir, fontsWPDir));
}

if (!fs.existsSync(path.join(__dirname, baseWPDir, imagesWPDir))) {
  fs.mkdirSync(path.join(__dirname, baseWPDir, imagesWPDir));
}

// Loop through the baseDir directory
fs.readdir(`./${baseDir}`, (err, files) => {
  // store all files in custom arrays by type
  let html = [];
  let js = [];
  let css = [];
  let fonts = [];
  let maps = [];
  let staticAssets = [];

  files.forEach((file) => {
    // first HTML files
    if (file.match(/.+\.(html)$/)) {
      // console.log("html match", file);
      html.push(file);
    } else if (file.match(/.+\.(js)$/) || file.match(/.+\.(js.map)$/)) {
      // then JavaScripts
      js.push(file);
    } else if (file.match(/.+\.(css)$/) || file.match(/.+\.(css.map)$/)) {
      // then CSS
      css.push(file);
    } else if (
      file.match(/.+\.(woff)$/) ||
      file.match(/.+\.(woff2)$/) ||
      file.match(/.+\.(woff2)$/) ||
      file.match(/.+\.(ttf)$/) ||
      file.match(/.+\.(eot)$/)
    ) {
      // then fonts
      fonts.push(file);
    } else if (file.match(/.+\.(map)$/)) {
      // then sourcemaps
      maps.push(file);
    } else if (file.match(/.+\..+$/)) {
      // all other files, exclude current directory and directory one level up
      staticAssets.push(file);
    }
  });
  // check what went where
  console.log(
    "html",
    html,
    "css",
    css,
    "fonts",
    fonts,
    "js",
    js,
    "staticAssets",
    staticAssets
  );

  // create an array for all compiled assets
  let assets = css.concat(js).concat(fonts).concat(maps);

  // replace all other resources in html
  html.forEach((file) => {
    staticAssets.forEach((name) => {
      let options = {
        files: path.join("../statics", file),
        from: new RegExp(escapeRegExp(name), "g"),
        to: imagesDir + "/" + name,
      };
      try {
        let changedFiles = replace.sync(options);
        // console.log("Modified files:", changedFiles.join(", "));
      } catch (error) {
        console.error("Error occurred:", error);
      }
    });

    assets.forEach((name) => {
      let options = {
        files: path.join("../statics", file),
        from: new RegExp(escapeRegExp(name), "g"),
        to: assetsDir + "/" + name,
      };

      if (name.match(/.+\.(js)$/) || name.match(/.+\.(js.map)$/)) {
        // JavaScripts
        options.to = jsDir + "/" + name;
      } else if (name.match(/.+\.(css)$/) || name.match(/.+\.(css.map)$/)) {
        // CSS
        options.to = cssDir + "/" + name;
      } else if (
        name.match(/.+\.(woff)$/) ||
        name.match(/.+\.(woff2)$/) ||
        name.match(/.+\.(woff2)$/) ||
        name.match(/.+\.(ttf)$/) ||
        name.match(/.+\.(eot)$/) ||
        name.match(/.+\.(svg)$/)
      ) {
        // fonts
        options.to = fontsDir + "/" + name;
      }

      try {
        let changedFiles = replace.sync(options);
        // console.log("Modified files:", changedFiles.join(", "));
      } catch (error) {
        console.error("Error occurred:", error);
      }
    });
  });

  // replace map links in js
  js.forEach((file) => {
    maps.forEach((name) => {
      let options = {
        files: path.join("../statics", file),
        from: name,
        to: "../" + assetsDir + "/" + name,
      };
      try {
        let changedFiles = replace.sync(options);
        console.log("Modified files:", changedFiles.join(", "));
      } catch (error) {
        console.error("Error occurred:", error);
      }
    });
  });

  // replace links in css
  css.forEach((file) => {
    staticAssets.forEach((name) => {
      let options = {
        files: path.join("../statics", file),
        from: new RegExp(escapeRegExp(name), "g"),
        to: "../" + staticDir + "/" + name,
      };
      try {
        let changedFiles = replace.sync(options);
        // console.log("Modified files:", changedFiles.join(", "));
      } catch (error) {
        console.error("Error occurred:", error);
      }
    });

    fonts.forEach((name) => {
      let options = {
        files: path.join("../statics", file),
        from: new RegExp(escapeRegExp(name), "g"),
        to: "../fonts/" + name,
      };
      try {
        let changedFiles = replace.sync(options);
        // console.log("Modified files:", changedFiles.join(", "));
      } catch (error) {
        console.error("Error occurred:", error);
      }
    });
  });

  // move js and css and maps
  assets.forEach((name) => {
    let p = assetsDir;
    if (name.match(/.+\.(js)$/) || name.match(/.+\.(js.map)$/)) {
      // JavaScripts
      p = jsDir;
    } else if (name.match(/.+\.(css)$/) || name.match(/.+\.(css.map)$/)) {
      // CSS
      p = cssDir;
    } else if (
      name.match(/.+\.(woff)$/) ||
      name.match(/.+\.(woff2)$/) ||
      name.match(/.+\.(woff2)$/) ||
      name.match(/.+\.(ttf)$/) ||
      name.match(/.+\.(eot)$/) ||
      name.match(/.+\.(svg)$/)
    ) {
      // fonts
      p = fontsDir;
    }

    fs.rename(
      path.join(__dirname, "../statics", name),
      path.join(__dirname, "../statics", p, name),
      function (err) {
        if (err) throw err;
        // console.log(`Successfully moved ${name}`);
      }
    );
  });

  // move staticAssets
  staticAssets.forEach((name) => {
    fs.rename(
      path.join(__dirname, "../statics", name),
      path.join(__dirname, "../statics", imagesDir, name),
      function (err) {
        if (err) throw err;
        // console.log(`Successfully moved ${name}`);
      }
    );
  });

  // replace wp files
  var sourceDir = path.join(__dirname, "../statics/assets");
  var destinationDir = path.join(
    __dirname,
    `../wp-content/themes/${WORDPRESS_THEME}/assets`
  );

  if (!fs.existsSync(destinationDir)) {
    fs.mkdirSync(sourceDir, { recursive: true });
  }

  fs_Extra.copy(sourceDir, destinationDir, function (err) {
    if (err) {
      console.error(err);
    } else {
      console.log("Success update to Wordpress!");
    }
  });

  // move js and css and maps
  // assets.forEach((name) => {
  //   let modifiedName = "";
  //   if (name.indexOf(".css") !== -1) {
  //     const parts = name.split(".");
  //     parts.shift();

  //     modifiedName = `styles.${parts.join(".")}`;
  //   } else if (name.indexOf(".js") !== -1) {
  //     const parts = name.split(".");
  //     parts.shift();

  //     modifiedName = `scripts.${parts.join(".")}`;
  //   }

  //   fs.rename(
  //     path.join(__dirname, "../statics", name),
  //     path.join(__dirname, "../statics", assetsDir, name),
  //     function (err) {
  //       if (err) throw err;

  //       if (name.indexOf(".css") !== -1) {
  //         fs.copyFile(
  //           `../statics/assets/${name}`,
  //           `../wp-content/themes/tabb/assets/css/${modifiedName}`,
  //           (err) => {
  //             if (err) throw err;
  //             console.log(
  //               `${name} was copied to ../wp-content/themes/tabb/assets/css/${modifiedName}`
  //             );
  //             const options = {
  //               files: `../wp-content/themes/tabb/assets/css/${modifiedName}`,
  //               from: new RegExp(escapeRegExp("../images/../images"), "g"),
  //               to: "../images",
  //             };
  //             replace(options, (error, results) => {
  //               if (error) {
  //                 return console.error("Error occurred:", error);
  //               }
  //               console.log("Replacement results:", results);
  //               replace(
  //                 {
  //                   files: `../statics/assets/${name}`,
  //                   from: new RegExp(escapeRegExp("../images/../images"), "g"),
  //                   to: "../images",
  //                 },
  //                 (error, results) => {
  //                   if (error) {
  //                     return console.error("Error occurred:", error);
  //                   }
  //                   console.log("Replacement results:", results);
  //                 }
  //               );
  //             });
  //           }
  //         );
  //       } else {
  //         fs.copyFile(
  //           `../statics/assets/${name}`,
  //           `../wp-content/themes/tabb/assets/js/${modifiedName}`,
  //           (err) => {
  //             if (err) throw err;
  //             console.log(
  //               `${name} was copied to ../wp-content/themes/tabb/assets/js/${modifiedName}`
  //             );
  //           }
  //         );
  //       }
  //     }
  //   );
  // });
  // move staticAssets
  // staticAssets.forEach((name) => {
  //   fs.rename(
  //     path.join(__dirname, "../statics", name),
  //     path.join(__dirname, "../statics", staticDir, name),
  //     function (err) {
  //       if (err) throw err;
  //       // console.log(`Successfully moved ${name}`);

  //       try {
  //         fs.copyFile(
  //           `../statics/images/${name}`,
  //           `../wp-content/themes/tabb/assets/images/${name}`,
  //           function (error) {
  //             if (error) {
  //               throw error;
  //             } else {
  //               console.log(
  //                 `${name} was copied to ../wp-content/themes/tabb/assets/images/${name}`
  //               );
  //             }
  //           }
  //         );
  //       } catch (err) {
  //         console.error(err);
  //       }
  //     }
  //   );
  // });
});
