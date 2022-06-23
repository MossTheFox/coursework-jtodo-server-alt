/**
 * @file /auth
 */
import { Router } from "express";
import { QQAuthData } from "../model/owlUserDB/QQAuthData";
import { createToken } from "../database/tables/UserTable";
import * as UserTable from "../database/tables/UserTable";
import * as ToDoCollectionTable from "../database/tables/ToDoCollectionTable";
import * as ToDoItemTable from "../database/tables/ToDoItemTable";
import { randomUUID } from "crypto";

const router = Router();

router.post("/", async (req, res) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    try {
        if (!req.body.qqAuth) {
            res.status(400).send({
                code: "bad_request",
                message: "No."
            });
            return;
        }
        let qqAuthRecord = await QQAuthData.findOne({
            _id: req.body.qqAuth,
            available: true
        });

        if (!qqAuthRecord || !qqAuthRecord.unionID) {
            res.send({
                code: "not ok",
                message: "未完成授权"
            });
            return;
        }

        // check if account exists. Auto create if not exists.

        let userDoc = await UserTable.selectOne(qqAuthRecord.unionID);
        if (!userDoc) {
            // create account
            userDoc = await UserTable.insertOne({
                qqUnionID: qqAuthRecord.unionID,
                username: qqAuthRecord.rawGetUserInfoResponse?.nickname || "User",
                avatarUrl: qqAuthRecord.rawGetUserInfoResponse?.figureurl_qq_2 || "",
                registeredAt: new Date()
            });
            // ...and give some default listCollection
            // TODO Migrate to mysql
            let newList = await ToDoCollectionTable.insertOne({
                owner: userDoc.qqUnionID,
                name: "待办事项",
                description: "默认列表",
                createdAt: new Date(),
                uuid: randomUUID()
            });
            await ToDoItemTable.insertOne({
                inCollection: newList.uuid,
                name: "这里是你的待办事项",
                description: "点击“操作”按钮可以添加和修改备注",
                createdAt: new Date(),
                uuid: randomUUID(),
                checked: false
            });
        } else {
            // update account
            await UserTable.updateOne(qqAuthRecord.unionID, {
                username: qqAuthRecord.rawGetUserInfoResponse?.nickname || "User",
                avatarUrl: qqAuthRecord.rawGetUserInfoResponse?.figureurl_qq_2 || ""
            });
        }

        let jwtToken = createToken(userDoc.qqUnionID);

        // deactivate qqAuthRecord
        qqAuthRecord.available = false;
        await qqAuthRecord.save();

        res.send({
            code: "ok",
            data: {
                username: userDoc.username,
                avatarUrl: userDoc.avatarUrl,
                registeredAt: userDoc.registeredAt,
                token: jwtToken     // 客户端存储这个 Token 作为后面所有请求的 Authorization 字段 (Bearer)
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            code: 'error',
            message: "Internal Server Error"
        })
    }
});


export default router;