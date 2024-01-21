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

  it("established connection and received response from notices table", async () => {
    const [rows] = await connection.execute(
      `SELECT
            notice_id,
            title,
            type,
            CAST(date_start as CHAR) as date_start,
            CAST(date_end as CHAR) as date_end,
            description,
            icon,
            location,
            centre_lat,
            centre_long,
            'status',
            notices.neighborhood_id,
            email,
            concat(first_name, ' ', last_name) as user_name
            FROM ctiscare.notices
            JOIN users ON users.user_id = notices.host_user_id
            WHERE date_end > NOW();`
    );
    expect(rows.length).toBeGreaterThanOrEqual(1);
  });
});
