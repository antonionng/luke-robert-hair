import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

// Get database URL from command line arguments or use default
const args = process.argv.slice(2);
const connectionString = args[0] || 'postgresql://postgres:F0ll0wBl1ss121!!@db.gmbsjpmfqxcotjlmlhhk.supabase.co:5432/postgres';

console.log('Using database:', connectionString.replace(/:([^:]*?)@/, ':***@'));

async function runMigrations() {
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    },
    connectionTimeoutMillis: 10000,
    query_timeout: 10000,
    statement_timeout: 10000,
    idle_in_transaction_session_timeout: 10000
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Start a transaction
    await client.query('BEGIN');

    // Create migrations table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        run_on TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `);

    // Get all migration files
    const migrationsDir = path.join(__dirname, '../migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    // Get already run migrations
    const { rows: completedMigrations } = await client.query<{ name: string }>(
      'SELECT name FROM migrations ORDER BY name'
    );
    const completedMigrationNames = new Set(completedMigrations.map(m => m.name));

    // Run new migrations
    for (const file of migrationFiles) {
      if (!completedMigrationNames.has(file)) {
        console.log(`Running migration: ${file}`);
        
        // Read and execute the migration file
        const migrationSql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        await client.query(migrationSql);
        
        // Record the migration
        await client.query(
          'INSERT INTO migrations (name) VALUES ($1)',
          [file]
        );
        
        console.log(`✅ Successfully applied migration: ${file}`);
      } else {
        console.log(`Skipping already applied migration: ${file}`);
      }
    }

    // Commit the transaction
    await client.query('COMMIT');
    console.log('All migrations completed successfully');
  } catch (error) {
    // Rollback the transaction in case of error
    try {
      await client.query('ROLLBACK');
    } catch (rollbackError) {
      console.error('Failed to rollback transaction:', rollbackError);
    }
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    try {
      await client.end();
    } catch (endError) {
      console.error('Failed to close connection:', endError);
    }
  }
}

runMigrations().catch(console.error);
