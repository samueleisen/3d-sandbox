const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');

if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

const filesToBundle = [
    path.join(projectRoot, 'js', 'scene.js'),
    path.join(projectRoot, 'js', 'grass.js'),
    path.join(projectRoot, 'js', 'player.js'),
    path.join(projectRoot, 'js', 'preloader.js')
];

console.log('[build] Bundling JavaScript modules...');

let concatenatedCode = '/* 3D Sandbox Production Engine Bundle */\n(function() {\n"use strict";\n';

for (const filePath of filesToBundle) {
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        concatenatedCode += `\n/* --- ${path.basename(filePath)} --- */\n` + content + '\n';
    } else {
        console.warn(`[build] Warning: ${filePath} not found.`);
    }
}

concatenatedCode += '\n})();\n';

const bundlePath = path.join(distDir, 'bundle.js');
fs.writeFileSync(bundlePath, concatenatedCode, 'utf8');
console.log(`[build] Created ${bundlePath} (${(concatenatedCode.length / 1024).toFixed(2)} KB)`);

// Attempt minification & obfuscation if javascript-obfuscator is available
try {
    const JavaScriptObfuscator = require('javascript-obfuscator');
    console.log('[build] Obfuscating bundle for production...');
    const obfuscatedResult = JavaScriptObfuscator.obfuscate(concatenatedCode, {
        compact: true,
        controlFlowFlattening: false,
        deadCodeInjection: false,
        debugProtection: false,
        disableConsoleOutput: false,
        identifierNamesGenerator: 'hexadecimal',
        log: false,
        numbersToExpressions: false,
        renameGlobals: false,
        selfDefending: false,
        simplify: true,
        splitStrings: false,
        stringArray: true,
        stringArrayCallsTransform: true,
        stringArrayEncoding: [],
        stringArrayIndexShift: true,
        stringArrayRotate: true,
        stringArrayShuffle: true,
        stringArrayWrappersCount: 1,
        stringArrayWrappersType: 'variable',
        stringArrayThreshold: 0.75,
        unicodeEscapeSequence: false
    });

    const bundleMinPath = path.join(distDir, 'bundle.min.js');
    fs.writeFileSync(bundleMinPath, obfuscatedResult.getObfuscatedCode(), 'utf8');
    console.log(`[build] Created obfuscated release bundle: ${bundleMinPath} (${(obfuscatedResult.getObfuscatedCode().length / 1024).toFixed(2)} KB)`);
} catch (err) {
    console.log('[build] Note: Generating bundle.min.js from bundle.js');
    const bundleMinPath = path.join(distDir, 'bundle.min.js');
    fs.writeFileSync(bundleMinPath, concatenatedCode, 'utf8');
}

console.log('[build] Build complete successfully!');
