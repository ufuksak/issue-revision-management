import Router from 'koa-router';
import authMiddleware from './middleware/auth';
import discovery from './api/discovery';
import health from './api/health';
import issues from './api/issues';
import auth from './api/auth';

const router = new Router();

router.get("/", discovery);
router.get("/health", health);
router.get("/issues/:id", authMiddleware.auth, issues.get);
router.post("/issues", authMiddleware.auth, issues.post);
router.get("/issues", authMiddleware.auth, issues.getAll);
router.put("/issues/:id", authMiddleware.auth, issues.put);
router.get(
    "/issues/:id/revisions",
    authMiddleware.auth,
    issues.getRevisions
);
router.post("/auth/generateToken", auth.generateToken);
router.post("/auth/validateToken", auth.validateToken);
router.get(
    "/issues/:id/revisions/diff",
    authMiddleware.auth,
    issues.getRevisionsDiff
);

export default router;
