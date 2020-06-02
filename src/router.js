class Router {
    constructor(routes) {
        if (routes) {
            this.routes = routes;
        } else {
            this.routes = [];
        }
    }

    handle(pathname, func) {
        const route = {
            path: Router.parsePath(pathname),
            func,
            result: null,
        };

        this.routes.push(route);
    }

    removeRoute(pathname) {
        const route = this.findRoute(Router.parsePath(pathname));
        if (this.routes.indexOf(route) > -1) {
            this.routes.splice(route, 1);
        }
    }

    resolve(pathname, ...args) {
        const route = this.findRoute(Router.parsePath(pathname));
        route.result = route.func(...args);

        return route;
    }

    findRoute(pathname) {
        const foundRoute = this.routes.find((route) => route.path === Router.parsePath(pathname));
        if (foundRoute) {
            return foundRoute;
        }
        throw new ReferenceError('404');
    }

    static parsePath(pathname) {
        return pathname;
    }
}

module.exports = {
    Router,
};
