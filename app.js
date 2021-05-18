import cors from "cors";
import redis from "redis";
import express from "express";
import { logger, REDIS_PORT, SERVER_PORT } from "./config.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initilize redis client
let redis_client = redis.createClient(REDIS_PORT);
redis_client.on("connect", () => {
    logger.info("Redis server connection established", { service: "redis" });
});

// Fetch all tasks
app.post("/", (req, res) => {
    redis_client.lrange(req.body.email, 0, -1, (err, result) => {
        if (err) {
            logger.error(`Error fetching all tasks for user - ${req.body.email}`, err);
            return res.sendStatus(400);
        }
        logger.info(`Fetched tasks for user ${req.body.email}`);
        return res.json({ tasks: result });
    });
});

// Adding tasks
app.post("/tasks", (req, res) => {
    redis_client.rpush(req.body.email, req.body.tasks, (err) => {
        if (err) {
            logger.error(`Error adding tasks for - ${req.body.email}`, err);
            return res.sendStatus(400);
        }
        logger.info(`Added tasks for user ${req.body.email}`);
        return res.sendStatus(200);
    });
});

// Delete tasks completed by user.
app.delete("/tasks", (req, res) => {
    // Calculating length of tasks
    redis_client.llen(req.body.email, (err, len) => {
        if (err) {
            logger.error(`Error deleting tasks for - ${req.body.email}`, err);
            return res.sendStatus(400);
        } else if (len == 0) {
            logger.warn(`No tasks entry for user - ${req.body.email}. Omitting request`);
            return res.sendStatus(200);
        }

        // Marking indexes for deletion
        req.body.tasks.forEach((index) => {
            if (index < len) {
                redis_client.lset(req.body.email, index, "TO_BE_DELETED", (err) => {
                    if (err) {
                        logger.error(`Error marking tasks to be deleted for user - ${req.body.email}`, err);
                        return res.sendStatus(500);
                    }
                });
            }
        });
        logger.info(`Marked tasks for deletion for user - ${req.body.email}`);

        // Deleting indexes
        redis_client.lrem(req.body.email, 0, "TO_BE_DELETED", (err) => {
            if (err) {
                logger.error(`Error deleting tasks for user - ${req.body.email}`, err);
                return res.sendStatus(500);
            }
            logger.info(`Deleted marked tasks for user - ${req.body.email}`);
            return res.sendStatus(200);
        });
    });
});

// Starting server
app.listen(SERVER_PORT, () => {
    logger.info(`Server up and listening on - ${SERVER_PORT}`);
});
