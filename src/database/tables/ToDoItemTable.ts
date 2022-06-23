import mysqlConnection from "../dbConnection";
import { todoItemTableName } from "../dbQueries";
import { debugLogger } from "../debugger";
import { ToDoItem } from "../TableSchema";


export function selectMany(inCollection: string | string[]) {
    const query = typeof inCollection === "string" ?
    `SELECT * FROM ${todoItemTableName} WHERE inCollection = ?` :
    `SELECT * FROM ${todoItemTableName} WHERE inCollection IN (?)`;
    return new Promise<ToDoItem[]>((resolve, reject) => {
        let executed = mysqlConnection.query(query, [inCollection], (err, results) => {
            if (err) {
                reject(err);
            }
            debugLogger(results, "Item - selectMany");
            resolve(results);
        });
        debugLogger(executed.sql, "Item - selectMany");
    });
}

export function insertOne(item: ToDoItem) {
    const query = `INSERT INTO ${todoItemTableName} SET ?`;
    return new Promise<ToDoItem>((resolve, reject) => {
        let executed = mysqlConnection.query(query, item, (err, results) => {
            if (err) {
                reject(err);
            }
            debugLogger(results, "Item - insertOne");
            resolve(item);
        });
        debugLogger(executed.sql, "Item - insertOne");
    });
}

export function updateOne(item: Partial<ToDoItem>) {
    const uuid = item.uuid ?? "";
    delete item.uuid;
    const query = `UPDATE ${todoItemTableName} SET ? WHERE uuid = ?`;
    return new Promise<Partial<ToDoItem>>((resolve, reject) => {
        let executed = mysqlConnection.query(query, [item, uuid], (err, results) => {
            if (err) {
                reject(err);
            }
            debugLogger(results, "Item - updateOne");
            resolve(item);
        });
        debugLogger(executed.sql, "Item - updateOne");
    });
}

export function deleteOne(uuid: string) {
    const query = `DELETE FROM ${todoItemTableName} WHERE uuid = ?`;
    return new Promise<ToDoItem>((resolve, reject) => {
        let executed = mysqlConnection.query(query, [uuid], (err, results) => {
            if (err) {
                reject(err);
            }
            debugLogger(results, "Item - deleteOne");
            resolve(results);
        });
        debugLogger(executed.sql, "Item - deleteOne");
    });
}