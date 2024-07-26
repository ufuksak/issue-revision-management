// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'request'.
const request = require("supertest");
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'jwt'.
const jwt = require("jsonwebtoken");
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'app'.
const app = require("./app");
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'server'.
const server = app.listen();

// @ts-expect-error TS(2304): Cannot find name 'afterAll'.
afterAll((done: any) => {
  server.close(done);
});

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe("Issues IT", () => {
  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test("POST /auth/validateToken verify the expired token failed", async () => {
    let jwtSecretKey = "gfg_jwt_secret_key";
    let data = {
      time: Date(),
      userId: 12,
      email: "test@testemail.com",
    };

    const expiredToken = jwt.sign(data, jwtSecretKey, {
      expiresIn: 0,
    });
    const response = await request(server)
      .post(`/auth/validateToken`)
      .send()
      .set("Authorization", `Bearer ${expiredToken}`);
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(response.status).toBe(401);
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(response.body).toStrictEqual({
      errors: {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expiredAt: expect.any(String),
        message: "jwt expired",
        name: "TokenExpiredError",
      },
      message: "Check your access parameters",
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test("POST /auth/validateToken given invalid sign key verify the token validate failed", async () => {
    let jwtSecretKey = "test";
    let data = {
      time: Date(),
      userId: 12,
      email: "test@testemail.com",
    };

    const tokenSignedWithUnknownKey = jwt.sign(data, jwtSecretKey, {
      expiresIn: 3600,
    });

    const response = await request(server)
        .post(`/auth/validateToken`)
        .send()
        .set("Authorization", `Bearer ${tokenSignedWithUnknownKey}`);
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(response.status).toBe(401);
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(response.body).toStrictEqual({
      errors: {
        message: "invalid signature",
        name: "JsonWebTokenError",
      },
      message: "Check your access parameters",
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test("POST /auth/validateToken verify the invalid token provided", async () => {
    const invalidtoken =
        "invalidtoken";
    const response = await request(server)
        .post(`/auth/validateToken`)
        .send()
        .set("Authorization", `Bearer ${invalidtoken}`);
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(response.status).toBe(401);
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(response.body).toStrictEqual({
      errors: {
        message: "jwt malformed",
        name: "JsonWebTokenError",
      },
      message: "Check your access parameters",
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test("POST /auth/generateToken verify the token generated", async () => {
    const response = await request(server)
        .post(`/auth/generateToken`)
        .send();
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(response.status).toBe(200);
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(response.body).toStrictEqual({
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      token: expect.any(String)
    });
  });
});
