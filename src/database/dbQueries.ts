export const userTableName = 'User';
export const todoCollectionTableName = 'ToDoCollection';
export const todoItemTableName = 'ToDoItem';

// let's use camelCase for the column names
export const createUserTableIfNotExistsQuery = `CREATE TABLE IF NOT EXISTS ${userTableName} (
    qqUnionID VARCHAR(255) PRIMARY KEY NOT NULL,
    username VARCHAR(255) NOT NULL DEFAULT 'User',
    avatarUrl VARCHAR(255) NOT NULL,
    registeredAt DATETIME NOT NULL
)`;

export const createTodoCollectionTableIfNotExistsQuery = `CREATE TABLE IF NOT EXISTS ${todoCollectionTableName} (
    uuid VARCHAR(255) PRIMARY KEY NOT NULL,
    owner VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL DEFAULT 'Untitled',
    description TEXT NOT NULL DEFAULT '',
    createdAt DATETIME NOT NULL,
    FOREIGN KEY (owner) REFERENCES ${userTableName}(qqUnionID)
    ON DELETE CASCADE
)`;

export const createTodoItemTableIfNotExistsQuery = `CREATE TABLE IF NOT EXISTS ${todoItemTableName} (
    uuid VARCHAR(255) PRIMARY KEY NOT NULL,
    inCollection VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL DEFAULT 'Untitled',
    description TEXT NOT NULL DEFAULT '',
    createdAt DATETIME NOT NULL,
    checked BOOLEAN NOT NULL DEFAULT false,
    FOREIGN KEY (inCollection) REFERENCES ${todoCollectionTableName}(uuid)
    ON DELETE CASCADE
)`;