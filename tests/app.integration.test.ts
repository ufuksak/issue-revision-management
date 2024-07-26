// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'request'.
const request = require("supertest");
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'jwt'.
const jwt = require("jsonwebtoken");
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'app'.
const app = require("./app");
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sequelize'... Remove this comment to see the full error message
const { sequelize, Issue, Revision } = require("../lib/models");
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'server'.
const server = app.listen();

// @ts-expect-error TS(2304): Cannot find name 'afterAll'.
afterAll((done: any) => {
  server.close(done);
});

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe("Issues IT", () => {
  let token = "";

  // @ts-expect-error TS(2304): Cannot find name 'beforeAll'.
  beforeAll(async () => {
    // @ts-expect-error TS(7005): Variable 'sequelize' implicitly has an 'any' type.
    await sequelize.sync({ force: true });
    token = jwt.sign(
      { id: 1, email: "testuser@testmail.com" },
      "gfg_jwt_secret_key"
    );
  });

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async () => {
    await Issue.truncate();
    await Revision.truncate();
  });

  // @ts-expect-error TS(2304): Cannot find name 'afterAll'.
  afterAll(async () => {
    // @ts-expect-error TS(7005): Variable 'sequelize' implicitly has an 'any' type.
    await sequelize.close();
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test("GET /issues/:id/revisions with valid token verify the revisions found", async () => {
    const issue = await Issue.create({
      title: "Some title",
      description: "Ufuk author",
    });
    await Revision.create({
      title: "Some title",
      description: "Ufuk author",
      state: "Open",
      issueId: issue.id,
    });
    const response = await request(server)
      .get(`/issues/${issue.id}/revisions`)
      .set("Authorization", `Bearer ${token}`);
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(response.status).toBe(200);
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(response.body.revisions).toStrictEqual([
      {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        id: expect.any(Number),
        title: "Some title",
        description: "Ufuk author",
        state: "Open",
        issueId: issue.id,
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        created_by: expect.any(String),
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        created_at: expect.any(String),
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        updated_by: expect.any(String),
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        updated_at: expect.any(String),
      },
    ]);
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test("GET /issues/:id/revisions with valid token verify no revisions found", async () => {
    const issue = await Issue.create({
      title: "Some title",
      description: "Ufuk author",
    });
    const response = await request(server)
      .get(`/issues/${issue.id}/revisions`)
      .set("Authorization", `Bearer ${token}`);
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(response.status).toBe(404);
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(response.body).toStrictEqual({
      errors: { error: `no revisions found for the issue: ${issue.id}` },
      message: "Resource was not found",
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test("GET /issues/:id/revisions/diff?revA=1&revB=3 with valid token", async () => {
    const issue = await Issue.create({
      title: "Some title",
      description: "Ufuk author",
    });
    const revision1 = await Revision.create({
      title: "",
      description: "IT does not generate revision",
      state: "Open",
      issueId: issue.id,
    });
    const revision2 = await Revision.create({
      title: "",
      description: "IT generated revisions without author",
      state: "In Progress",
      issueId: issue.id,
    });
    const revision3 = await Revision.create({
      title: "",
      description: "IT generated revisions without author",
      state: "Closed",
      issueId: issue.id,
    });

    const response = await request(server)
      .get(
        `/issues/${issue.id}/revisions/diff?revA=${revision1.id}&revB=${revision3.id}`
      )
      .set("Authorization", `Bearer ${token}`);
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(response.status).toBe(200);
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(response.body.response).toStrictEqual({
      before: {
        title: "",
        description: "IT does not generate revision",
        state: "Open",
      },
      after: {
        title: "",
        description: "IT generated revisions without author",
        state: "Closed",
      },
      changes: {
        description: {
          from: "IT does not generate revision",
          to: "IT generated revisions without author",
        },
        state: {
          from: "Open",
          to: "Closed",
        },
      },
      revisions: [
        {
          id: revision1.id,
          content: {
            title: "",
            description: "IT does not generate revision",
            state: "Open",
          },
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          created_at: expect.any(String),
        },
        {
          id: revision2.id,
          content: {
            title: "",
            description: "IT generated revisions without author",
            state: "In Progress",
          },
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          created_at: expect.any(String),
        },
        {
          id: revision3.id,
          content: {
            title: "",
            description: "IT generated revisions without author",
            state: "Closed",
          },
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          created_at: expect.any(String),
        },
      ],
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test("GET /issues/:id/revisions/diff?revA=3&revB=1 with valid token verify comparison in reverse order", async () => {
    const issue = await Issue.create({
      title: "Some title",
      description: "Ufuk author",
    });
    const revision1 = await Revision.create({
      title: "",
      description: "IT does not generate revision",
      state: "Open",
      issueId: issue.id,
    });
    const revision2 = await Revision.create({
      title: "",
      description: "IT generated revisions without author",
      state: "In Progress",
      issueId: issue.id,
    });
    const revision3 = await Revision.create({
      title: "",
      description: "IT generated revisions without author",
      state: "Closed",
      issueId: issue.id,
    });

    const response = await request(server)
      .get(
        `/issues/${issue.id}/revisions/diff?revA=${revision3.id}&revB=${revision1.id}`
      )
      .set("Authorization", `Bearer ${token}`);
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(response.status).toBe(200);
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(response.body.response).toStrictEqual({
      before: {
        title: "",
        description: "IT generated revisions without author",
        state: "Closed",
      },
      after: {
        title: "",
        description: "IT does not generate revision",
        state: "Open",
      },
      changes: {
        description: {
          from: "IT generated revisions without author",
          to: "IT does not generate revision",
        },
        state: {
          from: "Closed",
          to: "Open",
        },
      },
      revisions: [
        {
          id: revision3.id,
          content: {
            title: "",
            description: "IT generated revisions without author",
            state: "Closed",
          },
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          created_at: expect.any(String),
        },
        {
          id: revision2.id,
          content: {
            title: "",
            description: "IT generated revisions without author",
            state: "In Progress",
          },
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          created_at: expect.any(String),
        },
        {
          id: revision1.id,
          content: {
            title: "",
            description: "IT does not generate revision",
            state: "Open",
          },
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          created_at: expect.any(String),
        },
      ],
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test("GET /issues/:id/revisions/diff?revA=1&revB=3 when no revisions verify no revisions found", async () => {
    const issue = await Issue.create({
      title: "Some title",
      description: "Ufuk author",
    });

    const response = await request(server)
      .get(`/issues/${issue.id}/revisions/diff?revA=1&revB=3}`)
      .set("Authorization", `Bearer ${token}`);
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(response.status).toBe(404);
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(response.body).toStrictEqual({
      errors: {
        error: "no issue found or no revisions for the issue",
      },
      message: "Resource was not found",
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test("GET /issues/:id/revisions/diff?revA=1 when not all revision parameters given verify missing parameters error", async () => {
    const response = await request(server)
      .get(`/issues/1/revisions/diff?revA=1}`)
      .set("Authorization", `Bearer ${token}`);
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(response.status).toBe(400);
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(response.body).toStrictEqual({
      errors: {
        errorMissingRequiredParameters: "Missing required parameters",
      },
      message: "Check your request parameters",
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test("GET /issues/:id/revisions/diff?revA=1&revB=3 when two revisions given verify compared revisions not found", async () => {
    const issue = await Issue.create({
      title: "Some title",
      description: "Ufuk author",
    });

    const revision1 = await Revision.create({
      title: "",
      description: "IT does not generate revision",
      state: "Open",
      issueId: issue.id,
    });
    await Revision.create({
      title: "",
      description: "IT generated revisions without author",
      state: "In Progress",
      issueId: issue.id,
    });

    const response = await request(server)
      .get(`/issues/${issue.id}/revisions/diff?revA=${revision1.id}&revB=3}`)
      .set("Authorization", `Bearer ${token}`);
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(response.status).toBe(404);
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(response.body).toStrictEqual({
      errors: {
        error: "One or more revisions not found",
      },
      message: "Resource was not found",
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test("GET /issues/:id with valid token verify the issue found", async () => {
    const issue = await Issue.create({
      title: "Some title",
      description: "Ufuk author",
    });
    const response = await request(server)
      .get(`/issues/${issue.id}`)
      .set("Authorization", `Bearer ${token}`);
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(response.status).toBe(200);
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(response.body.issue).toStrictEqual({
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      id: expect.any(Number),
      title: "Some title",
      description: "Ufuk author",
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      created_by: expect.any(String),
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      created_at: expect.any(String),
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      updated_by: expect.any(String),
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      updated_at: expect.any(String),
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test("GET /issues with valid token verify the issues found", async () => {
    const issue = await Issue.create({
      title: "Some title",
      description: "Ufuk author",
    });
    const issue2 = await Issue.create({
      title: "Some title2",
      description: "Ufuk author2",
    });
    const response = await request(server)
      .get(`/issues`)
      .set("Authorization", `Bearer ${token}`);
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(response.status).toBe(200);
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(response.body).toStrictEqual({
      issues: [
        {
          id: issue.id,
          title: "Some title",
          description: "Ufuk author",
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          created_by: expect.any(String),
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          created_at: expect.any(String),
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          updated_by: expect.any(String),
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          updated_at: expect.any(String),
        },
        {
          id: issue2.id,
          title: "Some title2",
          description: "Ufuk author2",
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          created_by: expect.any(String),
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          created_at: expect.any(String),
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          updated_by: expect.any(String),
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          updated_at: expect.any(String),
        },
      ],
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test("POST /issues with valid token verify the new issue created", async () => {
    const response = await request(server)
      .post(`/issues`)
      .send({
        title: "issue new 3",
        description: "issue1 description new 32",
        revision: "IT does not generate revision 123 43",
        state: "Open",
        revisionTitle: "test",
      })
      .set("Authorization", `Bearer ${token}`);
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(response.status).toBe(200);
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(response.body).toStrictEqual({
      issue: {
        updated_by: "unknown",
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        id: expect.any(Number),
        description: "issue1 description new 32",
        title: "issue new 3",
        created_by: "testuser@testmail.com",
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        updated_at: expect.any(String),
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        created_at: expect.any(String),
      },
      revisionPayload: {
        updated_by: "unknown",
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        id: expect.any(Number),
        description: "IT does not generate revision 123 43",
        state: "Open",
        title: "test",
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        issueId: expect.any(Number),
        created_by: "testuser@testmail.com",
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        updated_at: expect.any(String),
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        created_at: expect.any(String),
      },
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test("POST /issues with valid token and missing parameters verify the new issue creation failed", async () => {
    const response = await request(server)
        .post(`/issues`)
        .send({
          title: "issue new 3",
          description: "issue1 description new 32",
          revision: "IT does not generate revision 123 43",
          state: "Open",
          revisionTitle: "",
        })
        .set("Authorization", `Bearer ${token}`);
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(response.status).toBe(400);
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(response.body).toStrictEqual({
      errors: {
        errorMissingRequiredParameters: "Missing required parameters"
      },
      message: "Check your request parameters"
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test("PUT /issues with valid token verify the issue update is done", async () => {
    const issue = await Issue.create({
      title: "Some title",
      description: "Ufuk author",
      created_by: "test@test.com",
    });
    const response = await request(server)
      .put(`/issues/${issue.id}`)
      .send({
        title: "modified issue13",
        description: "modified description234567 12321",
        revision: "IT generated revisions without author",
        state: "In Progress",
        revisionTitle: "test",
      })
      .set("Authorization", `Bearer ${token}`);
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(response.status).toBe(200);
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(response.body).toStrictEqual({
      issueUpdated: {
        id: issue.id,
        title: "modified issue13",
        description: "modified description234567 12321",
        created_by: "test@test.com",
        updated_by: "testuser@testmail.com",
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        created_at: expect.any(String),
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        updated_at: expect.any(String),
      },
      revisionPayload: {
        updated_by: "unknown",
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        id: expect.any(Number),
        description: "IT generated revisions without author",
        state: "In Progress",
        title: "test",
        issueId: issue.id,
        created_by: "testuser@testmail.com",
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        updated_at: expect.any(String),
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        created_at: expect.any(String),
      },
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test("PUT /issues with valid token and missing parameters verify the issue update failed", async () => {
    const issue = await Issue.create({
      title: "Some title",
      description: "Ufuk author",
      created_by: "test@test.com",
    });
    const response = await request(server)
        .put(`/issues/${issue.id}`)
        .send({
          title: "modified issue13",
          description: "modified description234567 12321",
          revision: "IT generated revisions without author",
          state: "",
          revisionTitle: "test",
        })
        .set("Authorization", `Bearer ${token}`);
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(response.status).toBe(400);
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(response.body).toStrictEqual({
      errors: {
        errorMissingRequiredParameters: "Missing required parameters"
      },
      message: "Check your request parameters"
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test("PUT /issues with the missing token verify no token found", async () => {
    const response = await request(server)
        .put('/issues/1')
        .send({
          title: "modified issue13"
        });
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(response.status).toBe(401);
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(response.body).toStrictEqual({
      errors: "No Token Found",
      message: "Check your access parameters"
    });
  });
});
