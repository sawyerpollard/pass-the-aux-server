'use strict';

const path = require('path');

class Router {
    constructor(routes) {
        if (routes) {
            this.routes = routes;
        } else {
            this.routes = [];
        }
    }

    routeTemplate = {
        path: null,
        func: null,
        result: null
    };

    addRoute(pathname, func) {
        const path = this.parsePath(pathname);

        const route = Object.create(this.routeTemplate, {
            path: {
                value: path,
                writable: true,
                enumerable: true,
                configurable: true
            },
            func: {
                value: func,
                writable: true,
                enumerable: true,
                configurable: true
            },
            result: {
                value: null,
                writable: true,
                enumerable: true,
                configurable: true
            }
        });

        this.routes.push(route)
    }

    removeRoute(pathname) {
        const path = this.parsePath(pathname);

        const route = this.findRoute(path);
        if (this.routes.indexOf(route) > -1) {
            this.routes.splice(route, 1);
        }
    }

    resolve(pathname, ...args) {
        const path = this.parsePath(pathname);
        const route = this.findRoute(path);
        route.result = route.func(...args);

        return route;
    }

    findRoute(pathname) {
        const path = this.parsePath(pathname);

        const route = this.routes.find(route => route.path === path);
        if (route) {
            return route;
        } else {
            throw new ReferenceError('404');
        }
    }

    parsePath(pathname) {
        return pathname;
    }
}

module.exports = {
    Router
};
