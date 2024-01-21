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

  it("established connection and received response from events table", async () => {
    const [rows] = await connection.execute(
      `SELECT
                event_id,
                title,
                CAST(date_start as CHAR) as date_start,
                CAST(date_end as CHAR) as date_end,
                description,
                location,
                centre_lat,
                centre_long,
                invite_criteria,
                'status',
                events.neighborhood_id,
                email,
                concat(first_name, ' ', last_name) as user_name
                FROM ctiscare.events
                JOIN users ON users.user_id = events.host_user_id
                WHERE date_end > NOW();`
    );
    expect(rows.length).toBeGreaterThanOrEqual(1);
  });
});
