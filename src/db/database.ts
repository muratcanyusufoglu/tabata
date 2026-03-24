import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('fittimer.db');
  await initializeDatabase(db);
  return db;
}

async function initializeDatabase(database: SQLite.SQLiteDatabase): Promise<void> {
  await database.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS workouts (
      id                       TEXT PRIMARY KEY,
      template_id              TEXT NOT NULL,
      template_name            TEXT NOT NULL,
      template_category        TEXT NOT NULL,
      started_at               TEXT NOT NULL,
      completed_at             TEXT,
      total_duration_seconds   INTEGER NOT NULL,
      planned_duration_seconds INTEGER NOT NULL,
      rounds_completed         INTEGER NOT NULL,
      rounds_total             INTEGER NOT NULL,
      sets_completed           INTEGER NOT NULL,
      sets_total               INTEGER NOT NULL,
      was_completed            INTEGER NOT NULL DEFAULT 0,
      year                     INTEGER NOT NULL,
      month                    INTEGER NOT NULL,
      day                      INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_workouts_date ON workouts(year, month, day);
    CREATE INDEX IF NOT EXISTS idx_workouts_started ON workouts(started_at DESC);
    CREATE INDEX IF NOT EXISTS idx_workouts_template ON workouts(template_id);
  `);
}
