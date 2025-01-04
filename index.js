const fs = require('fs');
const path = require('path');
const marked = require('marked'); // when using Markdown
const contentDir = path.join(__dirname, 'content');
const templatesDir = path.join(__dirname, 'templates');
const publicDir = path.join(__dirname, 'public');

// make sure the public directory exists
fs.mkdirSync(publicDir, { recursive: true });

function generateSite() {
    const template = fs.readFileSync(path.join(templatesDir, 'page.html'), 'utf-8');
    const files = fs.readdirSync(contentDir);

    files.forEach(file => {
        const filePath = path.join(contentDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');

        let htmlContent;
        if (path.extname(file) === '.md') {
            htmlContent = marked.parse(fileContent);
        } else if(path.extname(file) === '.html'){
            htmlContent = fileContent
        } else {
            console.log("Warning! Unsupported file type")
            return;
        }

        const pageTitle = path.basename(file, path.extname(file));
        const output = template
            .replace('{{ title }}', pageTitle)
            .replace('{{ content }}', htmlContent);

        const outputFileName = path.basename(file, path.extname(file)) + ".html"
        fs.writeFileSync(path.join(publicDir, outputFileName), output);
    });

    // copy assets
    const assetsDir = path.join(__dirname, 'assets');
        const assets = fs.readdirSync(assetsDir);
        assets.forEach(asset => {
            fs.copyFileSync(path.join(assetsDir, asset), path.join(publicDir, asset));
        })

    console.log('Static site generation successful.');
}

generateSite();