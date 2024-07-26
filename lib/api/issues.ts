"use strict";

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'respond'.
const respond = require("./responses");
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Issue'.
const { Issue, Revision } = require("../models");
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { Op } = require("sequelize");

const Issues = {};
const errorMissingRequiredParameters = "Missing required parameters";

(Issues as any).get = async (context: any) => {
    const issue = await Issue.findByPk(context.params.id);
    respond.success(context, { issue });
};

(Issues as any).post = async (context: any) => {
    let { description, title, revision, state, revisionTitle } = context.request.body;
    if (!description || !title || !revision || !state || !revisionTitle) {
        respond.badRequest(context, { errorMissingRequiredParameters });
        return;
    }
    const issue = await Issue.create({
        description: context.request.body.description,
        title: context.request.body.title,
        created_by: context.body.email,
    });
    const revisionPayload = await Revision.create({
        description: context.request.body.revision,
        state: context.request.body.state,
        title: context.request.body.revisionTitle,
        issueId: issue.id,
        created_by: context.body.email,
    });
    respond.success(context, { issue, revisionPayload });
};

(Issues as any).getAll = async (context: any) => {
    let { limit, offset, sort, order } = context.query;
    const issues = await Issue.findAll({
        limit: Number(limit ?? 10000),
        offset: Number(offset ?? 0),
        order: [[sort ?? "title", order ?? "ASC"]],
    });
    respond.success(context, { issues });
};

(Issues as any).put = async (context: any) => {
    let { description, title, revision, state, revisionTitle } = context.request.body;
    if (!description || !title || !revision || !state || !revisionTitle) {
        respond.badRequest(context, { errorMissingRequiredParameters });
        return;
    }
    const issue = await Issue.findByPk(context.params.id);
    const issueUpdated = await issue.update({
        description: description,
        title: title,
        updated_by: context.body.email,
    });
    const revisionPayload = await Revision.create({
        description: revision,
        state: state,
        title: revisionTitle,
        issueId: issue.id,
        created_by: context.body.email,
    });
    respond.success(context, { issueUpdated, revisionPayload });
};

(Issues as any).getRevisions = async (context: any) => {
    let { limit, offset, sort, order } = context.query;
    let { id } = context.params;
    const revisions = await Revision.findAll({
        where: {
            issueId: {
                [Op.eq]: id,
            },
        },
        limit: Number(limit ?? 10000),
        offset: Number(offset ?? 0),
        order: [[sort ?? "title", order ?? "ASC"]],
    });
    if (revisions.length === 0) {
        respond.notFound(context, {
            error: `no revisions found for the issue: ${id}`,
        });
        return;
    }
    respond.success(context, { revisions });
};

(Issues as any).getRevisionsDiff = async (context: any) => {
    const { id } = context.params;
    let { revA, revB } = context.query;
    if (!id || !revA || !revB) {
        respond.badRequest(context, { errorMissingRequiredParameters });
        return;
    }
    const revisionsByIssue = await Revision.findAll({
        where: {
            issueId: {
                [Op.eq]: id,
            },
        },
    });
    if (revisionsByIssue.length === 0) {
        respond.notFound(context, {
            error: "no issue found or no revisions for the issue",
        });
        return;
    }
    const revisionsByIssueMapped = revisionsByIssue.map((item: any) => {
        return {
            id: item.id,
            content: {
                title: item.title,
                description: item.description,
                state: item.state,
            },
            created_at: item.created_at,
        };
    });
    revA = parseInt(revA);
    revB = parseInt(revB);
    // Sort revisions to handle both older-to-newer and newer-to-older comparisons
    const [olderRev, newerRev] = [revA, revB].sort((a, b) => a - b);
    const revisionA = revisionsByIssueMapped.find((rev: any) => rev.id === olderRev);
    const revisionB = revisionsByIssueMapped.find((rev: any) => rev.id === newerRev);
    if (!revisionA || !revisionB) {
        respond.notFound(context, { error: "One or more revisions not found" });
        return;
    }
    const before = revisionA.content;
    const after = revisionB.content;
    // Calculate changes
    const changes = {};
    for (const key in after) {
        if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            changes[key] = {
                from: before[key],
                to: after[key],
            };
        }
    }
    // Get revisions trail
    const revisions = revisionsByIssueMapped
        .filter((rev: any) => rev.id >= olderRev && rev.id <= newerRev)
        .map(({ id, content, created_at }: any) => ({ id, content, created_at }));
    // Prepare response
    const response = {
        before,
        after,
        changes,
        revisions,
    };
    // If the original request was for newer-to-older, reverse the response
    if (revA > revB) {
        [response.before, response.after] = [response.after, response.before];
        response.revisions.reverse();
        for (const key in response.changes) {
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            [response.changes[key].from, response.changes[key].to] = [
                // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                response.changes[key].to,
                // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                response.changes[key].from,
            ];
        }
    }
    respond.success(context, { response });
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Issues;
