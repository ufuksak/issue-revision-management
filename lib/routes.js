'use strict';

const Router = require('koa-router');
const router = new Router();

router.get('/', require('./api/discovery'));
router.get('/health', require('./api/health'));
router.get('/issues/:id', require('./api/issues').get);
router.post('/issues', require('./api/issues').post);
router.get('/issues', require('./api/issues').getAll);
router.put('/issues/:id', require('./api/issues').put);
router.get('/issues/:id/revisions', require('./api/issues').getRevisions);
router.post('/auth/generateToken', require('./api/auth').generateToken);
router.post('/auth/validateToken', require('./api/auth').validateToken);
router.get('/issues/:id/revisions/diff', require('./api/issues').getRevisionsDiff);

module.exports = router;
