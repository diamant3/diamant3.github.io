import eleventyNavigationPlugin from "@11ty/eleventy-navigation";
import { compileString } from "sass";
import { parse } from "node:path";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/images");

  // Sass compilation
  eleventyConfig.addTemplateFormats("scss");
  eleventyConfig.addExtension("scss", {
    outputFileExtension: "css",
    compile: function (inputContent, inputPath) {
      let parsed = parse(inputPath);
      if (parsed.name.startsWith("_")) return; // skip partials like _variables.scss

      let result = compileString(inputContent, {
        loadPaths: [parsed.dir || ".", this.config.dir.includes],
      });

      return () => result.css;
    },
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
  };
};

