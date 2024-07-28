import { Context } from 'koa';
import respond from './responses';
import {Issue, Revision} from "../models";
//import {Issue, Revision} from "../models/indexnew";
import { Op } from 'sequelize';
//import { operations } from '../types/schema';

const errorMissingRequiredParameters: string = "Missing required parameters";

//type IssueResponseBody = operations['getIssueById']['responses']['200']['content']['application/json'];

class IssueController {

    get = async (context: Context): Promise<void> => {
        const issue = await Issue.findByPk(context.params.id);
        respond.success(context, {issue});
    };

    post = async (context: Context): Promise<void> => {
        // @ts-ignore
        let {
            description,
            title,
            revision,
            state,
            revisionTitle
        }: { description: string, title: string, revision: string, state: string, revisionTitle: string } = context.request.body;

        const payloadEmail: any = context.body;
        if (!description || !title || !revision || !state || !revisionTitle) {
            respond.badRequest(context, {error: errorMissingRequiredParameters});
            return;
        }
        const issue: any = await Issue.create({
            description: description,
            title: title,
            created_by: payloadEmail.email,
        });
        const revisionPayload: any = await Revision.create({
            description: revision,
            state: state,
            title: revisionTitle,
            issueId: issue.id,
            created_by: payloadEmail.email,
        });
        respond.success(context, {issue, revisionPayload});
    };

    getAll = async (context: Context): Promise<void> => {
        // @ts-ignore
        let {
            limit,
            offset,
            sort,
            order
        }: { limit: string, offset: string, sort: string, order: string } = context.query;
        const issues: any[] = await Issue.findAll({
            limit: Number(limit ?? 10000),
            offset: Number(offset ?? 0),
            order: [[sort ?? "title", order ?? "ASC"]],
        });
        respond.success(context, {issues});
    };

    put = async (context: Context): Promise<void> => {
        // @ts-ignore
        let {
            description,
            title,
            revision,
            state,
            revisionTitle
        }: { description: string, title: string, revision: string, state: string, revisionTitle: string } = context.request.body;
        if (!description || !title || !revision || !state || !revisionTitle) {
            respond.badRequest(context, {error: errorMissingRequiredParameters});
            return;
        }
        const issue: any | null = await Issue.findByPk(context.params.id);
        if (!issue) {
            respond.notFound(context, {error: "Issue not found"});
            return;
        }
        const payload: any = context.body;
        const issueUpdated: any = await issue.update({
            description: description,
            title: title,
            updated_by: payload.email,
        });
        const revisionPayload: any = await Revision.create({
            description: revision,
            state: state,
            title: revisionTitle,
            issueId: issue.id,
            created_by: payload.email,
        });
        respond.success(context, {issueUpdated, revisionPayload});
    };

    getRevisions = async (context: Context): Promise<void> => {
        // @ts-ignore
        let {
            limit,
            offset,
            sort,
            order
        }: { limit: string, offset: string, sort: string, order: string } = context.query;
        let {id}: { id: string } = context.params;
        const revisions: any[] = await Revision.findAll({
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
                error: `No revisions found for the issue: ${id}`,
            });
            return;
        }
        respond.success(context, {revisions});
    };

    getRevisionsDiff = async (context: Context): Promise<void> => {
        const {id}: { id: string } = context.params;
        // @ts-ignore
        let {revA, revB}: { revA: string, revB: string } = context.query;

        if (!id || !revA || !revB) {
            respond.badRequest(context, {error: errorMissingRequiredParameters});
            return;
        }

        const revisionsByIssue: any[] = await Revision.findAll({
            where: {
                issueId: {
                    [Op.eq]: id,
                },
            },
        });

        if (revisionsByIssue.length === 0) {
            respond.notFound(context, {
                error: "No issue found or no revisions for the issue",
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

        const revFirstNumeric: number = parseInt(revA);
        const revLastNumeric: number = parseInt(revB);

        const [olderRev, newerRev] = [revFirstNumeric, revLastNumeric].sort((a, b) => a - b);

        const revisionA = revisionsByIssueMapped.find((rev) => rev.id === olderRev);
        const revisionB = revisionsByIssueMapped.find((rev) => rev.id === newerRev);

        if (!revisionA || !revisionB) {
            respond.notFound(context, {error: "One or more revisions not found"});
            return;
        }

        const before: any = revisionA.content;
        const after: any = revisionB.content;

        const changes: { [key: string]: { from: any, to: any } } = {};
        for (const key in after) {
            if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
                changes[key] = {
                    from: before[key],
                    to: after[key],
                };
            }
        }

        const revisions = revisionsByIssueMapped
            .filter((rev) => rev.id >= olderRev && rev.id <= newerRev)
            .map(({id, content, created_at}) => ({id, content, created_at}));

        const response = {
            before,
            after,
            changes,
            revisions,
        };

        if (revA > revB) {
            [response.before, response.after] = [response.after, response.before];
            response.revisions.reverse();
            for (const key in response.changes) {
                [response.changes[key].from, response.changes[key].to] = [
                    response.changes[key].to,
                    response.changes[key].from,
                ];
            }
        }
        respond.success(context, {response});
    };
}
export default new IssueController();
