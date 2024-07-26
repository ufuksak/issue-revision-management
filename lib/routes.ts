"use strict";

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const Router = require('koa-router');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'router'.
const router = new Router();
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const authMiddleware = require("./middleware/auth");

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
router.get("/", require("./api/discovery"));
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
router.get("/health", require("./api/health"));
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
router.get("/issues/:id", authMiddleware.auth, require("./api/issues").get);
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
router.post("/issues", authMiddleware.auth, require("./api/issues").post);
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
router.get("/issues", authMiddleware.auth, require("./api/issues").getAll);
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
router.put("/issues/:id", authMiddleware.auth, require("./api/issues").put);
router.get(
  "/issues/:id/revisions",
  authMiddleware.auth,
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  require("./api/issues").getRevisions
);
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
router.post("/auth/generateToken", require("./api/auth").generateToken);
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
router.post("/auth/validateToken", require("./api/auth").validateToken);
router.get(
  "/issues/:id/revisions/diff",
  authMiddleware.auth,
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  require("./api/issues").getRevisionsDiff
);

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = router;
