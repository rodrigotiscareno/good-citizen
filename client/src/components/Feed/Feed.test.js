const mysql = require("mysql2/promise");
let config = require("../config");

describe("Fetch Posts", () => {
  let connection;

  beforeAll(async () => {
    connection = await mysql.createConnection(config);
  });

  afterAll(async () => {
    await connection.end();
  });

  it("established connection and received response from posts table", async () => {
    // Execute a query and check the result
    const [rows] = await connection.execute(
      `SELECT * from ctiscare.feed_posts`
    );
    expect(rows.length).toBeGreaterThanOrEqual(1);
  });

  it("established connection and received response from comments table", async () => {
    // Execute a query and check the result
    const [rows] = await connection.execute(
      `SELECT * from ctiscare.feed_comments`
    );
    expect(rows.length).toBeGreaterThanOrEqual(1);
  });
});
