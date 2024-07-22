'use strict';

const httpStatus = require("http-status");
const respond = require('./responses');
const Issue = require('../models/issue');
const Revision = require('../models/revision');
const Auth = require("./auth");
const {Op} = require("sequelize");

const Issues = {};

Issues.get = async (context) => {
  await Auth.validateToken(context);
  if (context.status === httpStatus.UNAUTHORIZED) {
    respond.notAuthorized(context, context.body.errors);
  } else {
    const issue = await Issue.findByPk(context.params.id);
    respond.success(context, {issue});
  }
};

Issues.post = async (context) => {
  await Auth.validateToken(context);
  if (context.status === httpStatus.UNAUTHORIZED) {
    respond.notAuthorized(context, context.body.errors);
  } else {
    const issue = await Issue.create({
      description: context.request.body.description,
      title: context.request.body.title,
      created_by: context.body.email
    });
    const revision = await Revision.create({
      description: context.request.body.revision,
      state: context.request.body.state,
      issueId: issue.id,
      created_by: context.body.email
    });
    respond.success(context, {issue, revision});
  }
};

Issues.getAll = async (context) => {
  await Auth.validateToken(context);
  if (context.status === httpStatus.UNAUTHORIZED) {
    respond.notAuthorized(context, context.body.errors);
  } else {
    const issues = await Issue.findAll();
    respond.success(context, {issues});
  }
};

Issues.put = async (context) => {
  await Auth.validateToken(context);
  if (context.status === httpStatus.UNAUTHORIZED) {
    respond.notAuthorized(context, context.body.errors);
  } else {
    const issue = await Issue.findByPk(context.params.id);
    const issueUpdated = await issue.update({
      description: context.request.body.description,
      title: context.request.body.title,
      updated_by: context.body.email
    });
    const revision = await Revision.create({
      description: context.request.body.revision,
      state: context.request.body.state,
      issueId: issue.id,
      created_by: context.body.email
    });
    respond.success(context, {issueUpdated, revision});
  }
};

Issues.getRevisions = async (context) => {
  await Auth.validateToken(context);
  if (context.status === httpStatus.UNAUTHORIZED) {
    respond.notAuthorized(context, context.body.errors);
  } else {
    const revisions = await Revision.findAll({
      where: {
        issueId: {
          [Op.eq]: context.params.id
        }
      }
    });
    respond.success(context, {revisions});
  }
};

Issues.getRevisionsDiff = async (context) => {
  await Auth.validateToken(context);
  if (context.status === httpStatus.UNAUTHORIZED) {
    respond.notAuthorized(context, context.body.errors);
  } else {
    const { id } = context.params;
    let { revA, revB } = context.query;

    if (!id || !revA || !revB) {
      context.status = 400;
      context.body = { error: 'Missing required parameters' };
      return;
    }

    const revisionsByIssue = await Revision.findAll({
      where: {
        issueId: {
          [Op.eq]: id
        }
      }
    });
    const revisionsByIssueMapped = revisionsByIssue.map((item) => {
      return {
        id: item.id,
        content: {title: item.title, description: item.description, state: item.state},
        created_at: item.created_at
      }
    });

    if (!revisionsByIssueMapped) {
      context.status = 404;
      context.body = { error: 'revisions not found' };
      return;
    }

    revA = parseInt(revA);
    revB = parseInt(revB);

    // Sort revisions to handle both older-to-newer and newer-to-older comparisons
    const [olderRev, newerRev] = [revA, revB].sort((a, b) => a - b);

    const revisionA = revisionsByIssueMapped.find(rev => rev.id === olderRev);
    const revisionB = revisionsByIssueMapped.find(rev => rev.id === newerRev);

    if (!revisionA || !revisionB) {
      context.status = 404;
      context.body = { error: 'One or more revisions not found' };
      return;
    }

    const before = revisionA.content;
    const after = revisionB.content;

    // Calculate changes
    const changes = {};
    for (const key in after) {
      if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
        changes[key] = {
          from: before[key],
          to: after[key]
        };
      }
    }

    // Get revisions trail
    const revisions = revisionsByIssueMapped
        .filter(rev => rev.id >= olderRev && rev.id <= newerRev)
        .map(({ id, content, created_at }) => ({ id, content, created_at }));

    // Prepare response
    const response = {
      before,
      after,
      changes,
      revisions
    };

    // If the original request was for newer-to-older, reverse the response
    if (revA > revB) {
      [response.before, response.after] = [response.after, response.before];
      response.revisions.reverse();
      for (const key in response.changes) {
        [response.changes[key].from, response.changes[key].to] = [response.changes[key].to, response.changes[key].from];
      }
    }
    respond.success(context, {response});
  }
};

module.exports = Issues;
