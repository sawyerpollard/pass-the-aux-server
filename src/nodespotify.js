const url = require('url');

const fetch = require('node-fetch');

class NodeSpotify {
    static createAuthorizeUrl(clientId, redirectUri, state, scopeArray) {
        const endpoint = {
            pathname: '/authorize',
            hostname: 'accounts.spotify.com',
            method: 'GET',
            protocol: 'https',
        };

        const urlObject = {
            protocol: endpoint.protocol,
            hostname: endpoint.hostname,
            pathname: endpoint.pathname,
            query: {
                client_id: clientId,
                response_type: 'code',
                redirect_uri: redirectUri,
                state,
            },
        };

        if (scopeArray) {
            urlObject.query.scope = scopeArray.join(' ');
        }

        return url.format(urlObject);
    }

    static async authorizeServer(clientId, clientSecret) {
        const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

        const endpoint = {
            pathname: '/api/token',
            hostname: 'accounts.spotify.com',
            method: 'POST',
            protocol: 'https',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${credentials}`,
            },
            params: {
                'grant_type': 'client_credentials',
            },
        };

        const urlObject = {
            protocol: endpoint.protocol,
            hostname: endpoint.hostname,
            pathname: endpoint.pathname,
            query: endpoint.params,
        };

        const response = await fetch(url.format(urlObject), {
            method: endpoint.method,
            headers: endpoint.headers,
        });

        const json = await response.json();

        return json;
    }

    static async search(query, type, market, limit, accessToken) {
        const endpoint = {
            pathname: '/v1/search',
            hostname: 'api.spotify.com',
            method: 'GET',
            protocol: 'https',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        };

        const urlObject = {
            protocol: endpoint.protocol,
            hostname: endpoint.hostname,
            pathname: endpoint.pathname,
            query: {
                query,
                type,
                market,
                limit,
            },
        };

        const response = await fetch(url.format(urlObject), {
            method: endpoint.method,
            headers: endpoint.headers,
        });

        const json = await response.json();

        return json;
    }
}

module.exports = {
    NodeSpotify,
};
