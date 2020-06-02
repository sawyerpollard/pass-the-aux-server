const { SessionManager } = require('./sessionmanager.js');

const sessman = new SessionManager();

const sess1 = sessman.createSession({ username: 'Sawyer ' });

console.log(sessman.readSession(sess1.sessionId));

console.log(sessman.updateSession(sess1.sessionId, null, { saw: 'was ' }));


console.log(sessman.deleteSession(sess1.sessionId));
