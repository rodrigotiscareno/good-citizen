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

    it("established connection and received response from users table", async () => {
        const [rows] = await connection.execute(
            `SELECT * from ctiscare.users`
        );
        expect(rows.length).toBeGreaterThanOrEqual(1);
    });

});
