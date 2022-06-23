import mysqlConnection from "../dbConnection";
import { todoCollectionTableName } from "../dbQueries";
import { debugLogger } from "../debugger";
import { ToDoCollection } from "../TableSchema";

export function insertOne(collection: ToDoCollection) {
    const query = `INSERT INTO ${todoCollectionTableName} SET ?`;
    return new Promise<ToDoCollection>((resolve, reject) => {
        let executed = mysqlConnection.query(query, collection, (err, results) => {
            if (err) {
                reject(err);
            }
            debugLogger(results, "Collection - insertOne");
            resolve(collection);
        });
        debugLogger(executed.sql, "Collection - insertOne");
    });
}

export function selectMany(owner: string) {
    const query = `SELECT * FROM ${todoCollectionTableName} WHERE owner = ?`;
    return new Promise<ToDoCollection[]>((resolve, reject) => {
        let executed = mysqlConnection.query(query, [owner], (err, results) => {
            if (err) {
                reject(err);
            }
            debugLogger(results, "Collection - select");
            resolve(results);
        });
        debugLogger(executed.sql, "Collection - select");
    });
}

export function updateOne(collection: Partial<ToDoCollection>) {
    const uuid = collection.uuid ?? "";
    delete collection.uuid;
    const query = `UPDATE ${todoCollectionTableName} SET ? WHERE uuid = ?`;
    return new Promise<Partial<ToDoCollection>>((resolve, reject) => {
        let executed = mysqlConnection.query(query, [collection, uuid], (err, results) => {
            if (err) {
                reject(err);
            }
            debugLogger(results, "Collection - updateOne");
            resolve(collection);
        });
        debugLogger(executed.sql, "Collection - updateOne");
    });
}

export function deleteOne(uuid: string) {
    const query = `DELETE FROM ${todoCollectionTableName} WHERE uuid = ?`;
    return new Promise<ToDoCollection>((resolve, reject) => {
        let executed = mysqlConnection.query(query, [uuid], (err, results) => {
            if (err) {
                reject(err);
            }
            debugLogger(results, "Collection - deleteOne");
            resolve(results);
        });
        debugLogger(executed.sql, "Collection - deleteOne");
    });
}