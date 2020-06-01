'use strict';

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

    pageTemplate = {
        name: null,
        pathname: null,
        extension: null,
        data: null
    };

    addPage(pathname) {
        const pathObject = path.parse(path.resolve(pathname));

        const name = pathObject.base;
        const extension = pathObject.ext.substring(1);
        const data = fs.readFileSync(pathname).toString();

        const page = Object.create(this.pageTemplate, {
            name: {
                value: name,
                writable: true,
                enumerable: true,
                configurable: true
            },
            pathname: {
                value: pathname,
                writable: true,
                enumerable: true,
                configurable: true
            },
            extension: {
                value: extension,
                writable: true,
                enumerable: true,
                configurable: true
            },
            data: {
                value: data,
                writable: true,
                enumerable: true,
                configurable: true
            }
        });

        this.pages.push(page);
    }

    removePage(name) {
        const page = this.getPage(name);
        if (this.pages.indexOf(page) > -1) {
            this.pages.splice(page, 1);
        }
    }

    getPage(name) {
        const page = this.pages.find(page => page.name === name);
        if (page) {
            return page;
        } else {
            throw new ReferenceError('404');
        }
    }

    resolvePath(pathname) {
        return path.resolve(pathname);
    }
}

module.exports = {
    PageHandler
};
