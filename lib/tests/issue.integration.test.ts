import { sequelize, Issue } from "../models";

describe("Issue Model", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("should create an issue", async () => {
    const user: any = await Issue.create({
      title: "testuser",
      description: "test@example.com",
    });
    expect(user.id).toBeDefined();
    expect(user.title).toBe("testuser");
    expect(user.description).toBe("test@example.com");
  });

  test("should find an issue", async () => {
    await Issue.create({
      title: "findme",
      description: "find@example.com",
    });

    const foundUser: any = await Issue.findOne({ where: { title: "findme" } });
    expect(foundUser).not.toBeNull();
    expect(foundUser.description).toBe("find@example.com");
  });
});
