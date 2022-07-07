import styles from "rollup-plugin-styles";
import babel from "@rollup/plugin-babel";
// import sourcemaps from "rollup-plugin-sourcemaps";
import del from "rollup-plugin-delete";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";

const autoprefixer = require("autoprefixer");

const conf = {
    input: "src/index.tsx",
    // preserveModules: true,
    output: {
        // file: "dist/index.cjs.js",
        dir: "dist",
        format: "cjs",
        exports: "named",
        // sourcemap: true
    },
    // this externelizes react to prevent rollup from compiling it
    external: ["react", /@babel\/runtime/],
    plugins: [
        typescript({
            declaration: true,
            rootDir: "src",
            declarationDir: "dist/types",
        }),
        // these are babel comfigurations
        babel({
            exclude: "node_modules/**",
            plugins: ["@babel/transform-runtime"],
            babelHelpers: "runtime"
        }),
        // this adds sourcemaps
        // sourcemaps(),
        del({targets:"dist/*"}),
        // this adds support for styles
        styles({
            postcss: {
                plugins: [
                    autoprefixer()
                ]
            }
        }),
        nodeResolve({preferBuiltins: false, browser: true }),
        commonjs(),
    ],
};

export default conf;
