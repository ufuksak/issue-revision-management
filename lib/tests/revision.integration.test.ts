import { sequelize, Revision } from "../models";

describe("Revision Model", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("should create a revision", async () => {
    const user:any = await Revision.create({
      title: "testuser",
      description: "test@example.com",
    });
    expect(user.id).toBeDefined();
    expect(user.title).toBe("testuser");
    expect(user.description).toBe("test@example.com");
  });

  test("should find a revision", async () => {
    await Revision.create({
      title: "findme",
      description: "find@example.com",
    });

    const foundUser:any = await Revision.findOne({ where: { title: "findme" } });
    expect(foundUser).not.toBeNull();
    expect(foundUser.description).toBe("find@example.com");
  });
});
