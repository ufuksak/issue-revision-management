import request from "supertest";
import jwt from "jsonwebtoken";
import app from "./app";

const server = app.listen();

afterAll((done: any) => {
  server.close(done);
});

describe("Issues IT", () => {
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
    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual({
      errors: {
        expiredAt: expect.any(String),
        message: "jwt expired",
        name: "TokenExpiredError",
      },
      message: "Check your access parameters",
    });
  });

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
    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual({
      errors: {
        message: "invalid signature",
        name: "JsonWebTokenError",
      },
      message: "Check your access parameters",
    });
  });

  test("POST /auth/validateToken verify the invalid token provided", async () => {
    const invalidtoken =
        "invalidtoken";
    const response = await request(server)
        .post(`/auth/validateToken`)
        .send()
        .set("Authorization", `Bearer ${invalidtoken}`);
    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual({
      errors: {
        message: "jwt malformed",
        name: "JsonWebTokenError",
      },
      message: "Check your access parameters",
    });
  });

  test("POST /auth/generateToken verify the token generated", async () => {
    const response = await request(server)
        .post(`/auth/generateToken`)
        .send();
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({
      token: expect.any(String)
    });
  });
});
