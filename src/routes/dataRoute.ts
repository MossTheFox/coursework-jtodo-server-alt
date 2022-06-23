/**
 * @file /data
 */

import { Router } from "express";
import * as UserTable from "../database/tables/UserTable";
import * as ToDoCollectionTable from "../database/tables/ToDoCollectionTable";
import * as ToDoItemTable from "../database/tables/ToDoItemTable";

const router = Router();

/**
 * expected authorization header:
 * Authorization: Bearer <token>
 * 
 * 
 * 获取用户信息：
 *  GET /data/user/
 * 获取用户的 Collection 列表：
 *  GET /data/collection
 *      
 */


router.use(async (req, res, next) => {
    try {
        if (req.method === "OPTIONS") {
            next();
            return;
        }
        let auth = req.headers.authorization;
        if (!auth) {
            res.status(401).send("Unauthorized");
            return;
        }
        let token = auth.split(" ")[1];
        let qqUnionID = UserTable.verifyToken(token);
        if (!qqUnionID) {
            res.status(401).send("Unauthorized");
            return;
        }
        let userDoc = await UserTable.selectOne(qqUnionID);
        if (!userDoc) {
            res.status(401).send("Unauthorized");
            return;
        }
        req.user = userDoc;
        next();
    } catch (err) {
        res.status(500).send("Internal Server Error");
    }
});

/**
 * 还是一次性发送全部吧
 */
router.get("/", async (req, res) => {
    try {
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        let usrCollections = await ToDoCollectionTable.selectMany(req.user.qqUnionID);

        let sendCollections = usrCollections.map((doc) => ({
            uuid: doc.uuid,
            name: doc.name,
            description: doc.description,
            createdAt: doc.createdAt,
        }));

        let userCollectionUUIDs = sendCollections.map((doc) => doc.uuid);

        let userItems = await ToDoItemTable.selectMany(userCollectionUUIDs);

        let sendItems = userItems.map((doc) => ({
            uuid: doc.uuid,
            inCollection: doc.inCollection,
            name: doc.name,
            description: doc.description,
            createdAt: doc.createdAt,
            checked: Boolean(doc.checked)       // MySQL returns 0 or 1, so convert to boolean
        })).sort((a, b) => {
            return a.createdAt.getTime() - b.createdAt.getTime();
        });

        res.send({
            code: "ok",
            data: {
                collections: sendCollections,
                items: sendItems
            }
        });

    } catch (err) {
        res.status(500).send({
            code: "error",
            message: "Internal Server Error"
        });
    }
});

/**
 * Sync:
 * 
 * req.body.actions
 */
import syncRoute from "./syncRoute";
router.use("/sync", syncRoute);


export default router;