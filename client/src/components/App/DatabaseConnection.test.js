const mysql = require('mysql2/promise');
let config = require("../config");

describe('MySQL connection and response tests', () => {
    let connection;

    beforeAll(async () => {
        connection = await mysql.createConnection(config);
    });

    afterAll(async () => {
        await connection.end();
    });

    it('established connection and received response from events table', async () => {
        // Execute a query and check the result
        const [rows] = await connection.execute(`SELECT * from ctiscare.events where status = 'TEST'`);
        expect(rows[0].title).toBe("SAMPLE EVENT");
    });

    it('established connection and received response from notices table', async () => {
        // Execute a query and check the result
        const [rows] = await connection.execute(`SELECT * from ctiscare.notices where status = 'TEST'`);
        expect(rows[0].title).toBe("SAMPLE NOTICE");
    });
});