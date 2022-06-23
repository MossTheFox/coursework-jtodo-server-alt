import mysqlConnection from "../dbConnection";
import { userTableName } from "../dbQueries";
import { User } from "../TableSchema";
import * as jsonwebtoken from "jsonwebtoken";
import { debugLogger } from "../debugger";

export async function selectOne(qqUnionID: string) {
    const query = `SELECT * FROM ${userTableName} WHERE qqUnionID = ?`;
    return new Promise<User | null>((resolve, reject) => {
        let executed = mysqlConnection.query(query, [qqUnionID], (err, results) => {
            if (err) {
                reject(err);
            }
            if (results.length === 0) {
                resolve(null);
            }
            debugLogger(results[0], "User - findOne");
            resolve(results[0]);
        });
        debugLogger(executed.sql, "User - findOne");
    });
}

export async function insertOne(user: User) {
    const query = `INSERT INTO ${userTableName} SET ?`;
    return new Promise<User>((resolve, reject) => {
        let executed = mysqlConnection.query(query, user, (err, results) => {
            if (err) {
                reject(err);
            }
            debugLogger(results, "User - insertOne");
            resolve(user);
        });
        debugLogger(executed.sql, "User - insertOne");
    });
}

/**
 * Update one user. DO NOT update qqUnionID.
 * @param qqUnionID qqUnionID of the user
 * @param user Note: Updating the field QQUnionID is not allowed.
 * @returns 
 */
export async function updateOne(qqUnionID: string, user: Partial<User>) {
    const query = `UPDATE ${userTableName} SET ? WHERE qqUnionID = ?`;
    delete user.qqUnionID;
    return new Promise<unknown>((resolve, reject) => {
        let executed = mysqlConnection.query(query, [user, qqUnionID], (err, results) => {
            if (err) {
                reject(err);
            }
            debugLogger(results, "User - updateOne");
            resolve(user);
        });
        debugLogger(executed.sql, "User - updateOne");
    });
}

//// Extra tools ////

export function createToken(qqUnionID: string): string {
    return jsonwebtoken.sign({
        qqUnionID: qqUnionID
    }, process.env.JWT_SECRET!, {
        expiresIn: "30d"
    });
}

export function verifyToken(token: string): string {
    let decoded: any;
    try {
        decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
        console.log(err);
        throw new Error("Token is invalid");
    }
    return decoded.qqUnionID;
}