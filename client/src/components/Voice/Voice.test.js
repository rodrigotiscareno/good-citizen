const mysql = require("mysql2/promise");
let config = require("../config");

describe("Fetch Voice", () => {
  let connection;

  beforeAll(async () => {
    connection = await mysql.createConnection(config);
  });

  afterAll(async () => {
    await connection.end();
  });

  it("established connection and received response from voice table", async () => {
    // Execute a query and check the result
    const [rows] = await connection.execute(`SELECT * from ctiscare.voice`);
    expect(rows.length).toBeGreaterThanOrEqual(1);
  });
});
