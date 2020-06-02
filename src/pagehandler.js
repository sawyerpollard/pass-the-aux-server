const path = require('path');
const fs = require('fs');

class PageHandler {
    constructor(pages) {
        if (pages) {
            this.pages = pages;
        } else {
            this.pages = [];
        }
    }

    addPage(pathname) {
        const pathObject = path.parse(path.resolve(pathname));

        const name = pathObject.base;
        const extension = pathObject.ext.substring(1);
        const data = fs.readFileSync(pathname).toString();

        const page = {
            name,
            pathname,
            extension,
            data,
        };

        this.pages.push(page);
    }

    removePage(name) {
        const page = this.getPage(name);
        if (this.pages.indexOf(page) > -1) {
            this.pages.splice(page, 1);
        }
    }

    getPage(name) {
        const foundPage = this.pages.find((page) => page.name === name);
        if (foundPage) {
            return foundPage;
        }
        throw new ReferenceError('404');
    }
}

module.exports = {
    PageHandler,
};
