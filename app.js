import cors from "cors";
import redis from "redis";
import express from "express";

let SERVER_PORT = 3000;
let REDIS_PORT = 6379;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initilize redis client
let redis_client = redis.createClient(REDIS_PORT);
redis_client.on("connect", () => {
    console.log("Redis client connected");
});

// Fetch all tasks
app.post("/", (req, res) => {
    redis_client.lrange(req.body.email, 0, -1, (err, result) => {
        if (err) {
            console.log("Error fetching all tasks for user - ", err);
            return res.sendStatus(403);
        }
        return res.json({ tasks: result });
    });
});

// Adding tasks
app.post("/tasks", (req, res) => {
    redis_client.rpush(req.body.email, req.body.tasks, (err) => {
        if (err) {
            console.log("Error adding tasks - ", err);
            return res.sendStatus(403);
        }
        return res.sendStatus(200);
    });
});

// Delete tasks completed by user.
app.delete("/tasks", (req, res) => {
    // Calculating length of tasks
    redis_client.llen(req.body.email, (err, len) => {
        if (err) {
            console.log("Error deleting tasks - ", err);
            return res.sendStatus(403);
        } else if (len == 0) {
            console.log("Error - No such user - ", req.body.email);
        }

        // Marking indexes for deletion
        req.body.tasks.forEach((index) => {
            if (index < len) {
                redis_client.lset(req.body.email, index, "TO_BE_DELETED", (err) => {
                    if (err) {
                        console.log("Error marking tasks to be deleted -", err);
                        return res.sendStatus(403);
                    }
                });
            }
        });

        // Deleting indexes
        redis_client.lrem(req.body.email, 0, "TO_BE_DELETED", (err) => {
            if (err) {
                console.log("Error deleting tasks -", err);
                return res.sendStatus(403);
            }
            return res.sendStatus(200);
        });
    });
});

// Starting server
app.listen(SERVER_PORT, () => {
    console.log("Server is up and running");
});
