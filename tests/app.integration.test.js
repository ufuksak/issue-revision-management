const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("./app");
const { sequelize, Issue, Revision } = require("../lib/models");
const server = app.listen();

afterAll((done) => {
  server.close(done);
});

describe("Issues IT", () => {
  let token = "";

  beforeAll(async () => {
    await sequelize.sync({ force: true });
    token = jwt.sign(
      { id: 1, email: "testuser@testmail.com" },
      "gfg_jwt_secret_key"
    );
  });

  beforeEach(async () => {
    await Issue.truncate();
    await Revision.truncate();
  });

  afterAll(async () => {
    await sequelize.close();
  });

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
    expect(response.status).toBe(200);
    expect(response.body.revisions).toStrictEqual([
      {
        id: expect.any(Number),
        title: "Some title",
        description: "Ufuk author",
        state: "Open",
        issueId: issue.id,
        created_by: expect.any(String),
        created_at: expect.any(String),
        updated_by: expect.any(String),
        updated_at: expect.any(String),
      },
    ]);
  });

  test("GET /issues/:id/revisions with valid token verify no revisions found", async () => {
    const issue = await Issue.create({
      title: "Some title",
      description: "Ufuk author",
    });
    const response = await request(server)
      .get(`/issues/${issue.id}/revisions`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(404);
    expect(response.body).toStrictEqual({
      errors: { error: `no revisions found for the issue: ${issue.id}` },
      message: "Resource was not found",
    });
  });

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
    expect(response.status).toBe(200);
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
          created_at: expect.any(String),
        },
        {
          id: revision2.id,
          content: {
            title: "",
            description: "IT generated revisions without author",
            state: "In Progress",
          },
          created_at: expect.any(String),
        },
        {
          id: revision3.id,
          content: {
            title: "",
            description: "IT generated revisions without author",
            state: "Closed",
          },
          created_at: expect.any(String),
        },
      ],
    });
  });

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
    expect(response.status).toBe(200);
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
          created_at: expect.any(String),
        },
        {
          id: revision2.id,
          content: {
            title: "",
            description: "IT generated revisions without author",
            state: "In Progress",
          },
          created_at: expect.any(String),
        },
        {
          id: revision1.id,
          content: {
            title: "",
            description: "IT does not generate revision",
            state: "Open",
          },
          created_at: expect.any(String),
        },
      ],
    });
  });

  test("GET /issues/:id/revisions/diff?revA=1&revB=3 when no revisions verify no revisions found", async () => {
    const issue = await Issue.create({
      title: "Some title",
      description: "Ufuk author",
    });

    const response = await request(server)
      .get(`/issues/${issue.id}/revisions/diff?revA=1&revB=3}`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(404);
    expect(response.body).toStrictEqual({
      errors: {
        error: "no issue found or no revisions for the issue",
      },
      message: "Resource was not found",
    });
  });

  test("GET /issues/:id/revisions/diff?revA=1 when not all revision parameters given verify missing parameters error", async () => {
    const response = await request(server)
      .get(`/issues/1/revisions/diff?revA=1}`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      errors: {
        errorMissingRequiredParameters: "Missing required parameters",
      },
      message: "Check your request parameters",
    });
  });

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
    expect(response.status).toBe(404);
    expect(response.body).toStrictEqual({
      errors: {
        error: "One or more revisions not found",
      },
      message: "Resource was not found",
    });
  });

  test("GET /issues/:id with valid token verify the issue found", async () => {
    const issue = await Issue.create({
      title: "Some title",
      description: "Ufuk author",
    });
    const response = await request(server)
      .get(`/issues/${issue.id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.issue).toStrictEqual({
      id: expect.any(Number),
      title: "Some title",
      description: "Ufuk author",
      created_by: expect.any(String),
      created_at: expect.any(String),
      updated_by: expect.any(String),
      updated_at: expect.any(String),
    });
  });

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
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({
      issues: [
        {
          id: issue.id,
          title: "Some title",
          description: "Ufuk author",
          created_by: expect.any(String),
          created_at: expect.any(String),
          updated_by: expect.any(String),
          updated_at: expect.any(String),
        },
        {
          id: issue2.id,
          title: "Some title2",
          description: "Ufuk author2",
          created_by: expect.any(String),
          created_at: expect.any(String),
          updated_by: expect.any(String),
          updated_at: expect.any(String),
        },
      ],
    });
  });

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
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({
      issue: {
        updated_by: "unknown",
        id: expect.any(Number),
        description: "issue1 description new 32",
        title: "issue new 3",
        created_by: "testuser@testmail.com",
        updated_at: expect.any(String),
        created_at: expect.any(String),
      },
      revisionPayload: {
        updated_by: "unknown",
        id: expect.any(Number),
        description: "IT does not generate revision 123 43",
        state: "Open",
        title: "test",
        issueId: expect.any(Number),
        created_by: "testuser@testmail.com",
        updated_at: expect.any(String),
        created_at: expect.any(String),
      },
    });
  });

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
    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      errors: {
        errorMissingRequiredParameters: "Missing required parameters"
      },
      message: "Check your request parameters"
    });
  });

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
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({
      issueUpdated: {
        id: issue.id,
        title: "modified issue13",
        description: "modified description234567 12321",
        created_by: "test@test.com",
        updated_by: "testuser@testmail.com",
        created_at: expect.any(String),
        updated_at: expect.any(String),
      },
      revisionPayload: {
        updated_by: "unknown",
        id: expect.any(Number),
        description: "IT generated revisions without author",
        state: "In Progress",
        title: "test",
        issueId: issue.id,
        created_by: "testuser@testmail.com",
        updated_at: expect.any(String),
        created_at: expect.any(String),
      },
    });
  });

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
    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      errors: {
        errorMissingRequiredParameters: "Missing required parameters"
      },
      message: "Check your request parameters"
    });
  });

  test("PUT /issues with the missing token verify no token found", async () => {
    const response = await request(server)
        .put('/issues/1')
        .send({
          title: "modified issue13"
        });
    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual({
      errors: "No Token Found",
      message: "Check your access parameters"
    });
  });
});
