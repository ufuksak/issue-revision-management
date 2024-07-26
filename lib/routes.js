"use strict";

const Router = require('koa-router');
const router = new Router();
const authMiddleware = require("./middleware/auth");

router.get("/", require("./api/discovery"));
router.get("/health", require("./api/health"));
router.get("/issues/:id", authMiddleware.auth, require("./api/issues").get);
router.post("/issues", authMiddleware.auth, require("./api/issues").post);
router.get("/issues", authMiddleware.auth, require("./api/issues").getAll);
router.put("/issues/:id", authMiddleware.auth, require("./api/issues").put);
router.get(
  "/issues/:id/revisions",
  authMiddleware.auth,
  require("./api/issues").getRevisions
);
router.post("/auth/generateToken", require("./api/auth").generateToken);
router.post("/auth/validateToken", require("./api/auth").validateToken);
router.get(
  "/issues/:id/revisions/diff",
  authMiddleware.auth,
  require("./api/issues").getRevisionsDiff
);

module.exports = router;
