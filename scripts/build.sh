rm -rf out
babel src -d out/lib
# for testing as a bundle in browser using browserify
mkdir -p out/bundle/
browserify src/index.js -t babelify --standalone jsua --outfile out/bundle/jsua.js
