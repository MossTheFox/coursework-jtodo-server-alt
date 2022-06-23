import { Router } from "express";
import { ActionType, CreateCollectionPayload, CreateItemPayload, DeleteCollectionPayload, DeleteItemPayload, UpdateCollectionPayload, UpdateItemPayload } from "./sync/actionTypes";
import * as ToDoCollectionTable from "../database/tables/ToDoCollectionTable";
import * as ToDoItemTable from "../database/tables/ToDoItemTable";

const router = Router();

router.patch("/", async (req, res) => {
    try {
        res.setHeader("Content-Type", "application/json; charset=utf-8");

        if (!req.body.actions || !Array.isArray(req.body.actions)) {
            console.log("[syncRoute] invalid actions (req.body.actions)");
            res.status(400).send({
                code: "error",
                message: "Bad Request"
            });
            return;
        }

        let actions = req.body.actions as Array<{ type: ActionType, payload: any }>;
        for (let action of actions) {
            // stop if payload has more than one level, which is not allowed
            let flagged = false;
            Object.keys(action.payload).forEach((key) => {
                if (typeof action.payload[key] === "object") {
                    flagged = true;
                }
            });
            if (flagged) {
                console.log("[syncRoute] invalid payload (action.payload)");
                res.status(400).send({
                    code: "error",
                    message: "Bad Request"
                });
                return;
            }

            switch (action.type) {
                case "createCollection":
                    let payload = action.payload as CreateCollectionPayload;
                    await ToDoCollectionTable.insertOne({
                        owner: req.user.qqUnionID,
                        uuid: payload.uuid,
                        name: payload.name,
                        description: payload.description ?? "",
                        createdAt: new Date(),
                    });
                    break;
                // update collection name [todo]
                case "updateCollection":
                    let payload2 = action.payload as UpdateCollectionPayload;
                    await ToDoCollectionTable.updateOne(payload2);
                    break;
                case "deleteCollection":
                    let payload3 = action.payload as DeleteCollectionPayload;
                    await ToDoCollectionTable.deleteOne(payload3.uuid);
                    break;
                case "createItem":
                    let payload4 = action.payload as CreateItemPayload;
                    await ToDoItemTable.insertOne({
                        uuid: payload4.uuid,
                        inCollection: payload4.inCollection,
                        name: payload4.name,
                        description: payload4.description ?? "",
                        createdAt: new Date(),
                        checked: false
                    });
                    break;
                case "updateItem":
                    let payload5 = action.payload as UpdateItemPayload;
                    await ToDoItemTable.updateOne(payload5);
                    break;
                case "deleteItem":
                    let payload6 = action.payload as DeleteItemPayload;
                    await ToDoItemTable.deleteOne(payload6.uuid);
                    break;

                default:
                    console.log(`[${new Date().toLocaleString()}] Unknown action type: ${action.type}`);
                    break;
            }
        }

        res.send({
            code: "ok",
            message: "Nothing goes wrong"
        });

    } catch (err) {
        console.log(err);
        res.status(500).send({
            code: "err",
            message: "Internal Server Error"
        });
    }
});


export default router;