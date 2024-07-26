const { sequelize, Revision } = require("../lib/models");

describe("Revision Model", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a user", async () => {
    const user = await Revision.create({
      title: "testuser",
      description: "test@example.com",
    });
    expect(user.id).toBeDefined();
    expect(user.title).toBe("testuser");
    expect(user.description).toBe("test@example.com");
  });

  it("should find a user", async () => {
    await Revision.create({
      title: "findme",
      description: "find@example.com",
    });

    const foundUser = await Revision.findOne({ where: { title: "findme" } });
    expect(foundUser).not.toBeNull();
    expect(foundUser.description).toBe("find@example.com");
  });
});
