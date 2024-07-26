// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sequelize'... Remove this comment to see the full error message
const { sequelize, Issue } = require("../lib/models");

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe("Issue Model", () => {
  // @ts-expect-error TS(2304): Cannot find name 'beforeAll'.
  beforeAll(async () => {
    // @ts-expect-error TS(7005): Variable 'sequelize' implicitly has an 'any' type.
    await sequelize.sync({ force: true });
  });

  // @ts-expect-error TS(2304): Cannot find name 'afterAll'.
  afterAll(async () => {
    // @ts-expect-error TS(7005): Variable 'sequelize' implicitly has an 'any' type.
    await sequelize.close();
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("should create a user", async () => {
    const user = await Issue.create({
      title: "testuser",
      description: "test@example.com",
    });
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(user.id).toBeDefined();
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(user.title).toBe("testuser");
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(user.description).toBe("test@example.com");
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("should find a user", async () => {
    await Issue.create({
      title: "findme",
      description: "find@example.com",
    });

    const foundUser = await Issue.findOne({ where: { title: "findme" } });
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(foundUser).not.toBeNull();
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(foundUser.description).toBe("find@example.com");
  });
});
