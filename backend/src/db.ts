import Database from "better-sqlite3"

const db = new Database('students.db')


db.exec(`
    CREATE TABLE IF NOT EXISTS students(
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT    NOT NULL,
        last_name  TEXT    NOT NULL,
        major      TEXT    NOT NULL,
        email      TEXT    NOT NULL UNIQUE,
        gpa        REAL    NOT NULL CHECK (gpa >= 0 AND gpa <= 4),
        created_at TEXT    NOT NULL
    );
`)

export default db