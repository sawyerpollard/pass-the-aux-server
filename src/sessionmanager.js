const { v4: uuidv4 } = require('uuid');

class SessionManager {
    constructor(sessions) {
        if (sessions) {
            this.sessions = sessions;
        } else {
            this.sessions = {};
        }
    }

    createSession(data = null, meta = null) {
        const sessionId = uuidv4();

        const session = {
            sessionId,
            data,
            meta,
        };

        this.sessions[sessionId] = session;
        return session;
    }

    readSession(sessionId) {
        const session = this.sessions[sessionId];

        if (session) {
            return session;
        }
        throw new ReferenceError('Session not found!');
    }

    updateSession(sessionId, data = null, meta = null) {
        const session = this.sessions[sessionId];

        if (session) {
            session.data = data || session.data;
            session.meta = meta || session.meta;

            return session;
        }
        throw new ReferenceError('Session not found!');
    }

    deleteSession(sessionId) {
        const session = this.sessions[sessionId];

        if (session) {
            delete this.sessions[sessionId];
            return session;
        }
        throw new ReferenceError('Session not found!');
    }
}

module.exports = {
    SessionManager,
};
