import mysql from 'mysql2/promise';

const url = process.env.DATABASE_URL || "mysql://felix-c5db6:Af{_Zv6L=5W;]oBTdz~UtJ@svc-3482219c-a389-4079-b18b-d50662524e8a-shared-dml.aws-virginia-6.svc.singlestore.com:3333/db_felix_3d395?ssl={\"rejectUnauthorized\":false}";

/* 
 * Manual migration script to bypass drizzle-kit introspection issues with SingleStore 
 * (specifically missing information_schema.check_constraints)
 */

async function main() {
    console.log("Connecting to database...");
    // Handle the URL parsing manually if needed, or pass directly
    const connection = await mysql.createConnection(url);

    try {
        console.log("Connected successfully.");

        console.log("Creating 'companies' table...");
        await connection.query(`
      CREATE TABLE IF NOT EXISTS companies (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        domain VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'researching',
        lead_score INT DEFAULT 0,
        summary TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        console.log("Table 'companies' ensured.");
    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        await connection.end();
    }
}

main();
