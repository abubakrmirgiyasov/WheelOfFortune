import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import User from "./models/user.js";

const PORT = 4444;

mongoose.connect("mongodb+srv://test_db:qCBWICTuWZmV6Ja4@cluster0.vjyvnhn.mongodb.net/test_db?retryWrites=true&w=majority")
    .then(() => console.log("Connected to mongo"))
    .catch((e) => console.log("Mongo error", e));

const app = express();
app.use(express.json());
app.use(cors());

app.get("/get-users", async (req, res) => {
    const users = await User.find();

    console.log(users)

    res.json(users);
});

app.put("/current-user/jackpot/:id", async (req, res) => {
    const isExist = await User.findOne({vkId: req.params.id});

    if (!isExist) {
        res.send("Недостаточно средств.");
        return;
    }

    if (isExist.balance === "JACKPOT") {
        isExist.balance = 0;

        const user = await isExist.save();
        res.json(user);
    }
    else if (isExist.balance >= 1000) {
        isExist.balance -= 1000;

        const user = await isExist.save();
        res.json(user);
    }
    else
        res.send("Недостаточно средств.");
});

app.post("/create-user", async (req, res) => {
    const isExist =  await User.findOne({ vkId: req.body.vkId });

    if (!isExist) {
        const doc = new User({
            vkId: req.body.vkId,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            avatar: req.body.avatar,
            balance: req.body.balance,
            date: new Date(),
        });
        const user = await doc.save();
        res.json(user);
    } else {
        if (req.body.balance === "JACKPOT")
            isExist.balance = "JACKPOT";
        else
            if (isExist.balance === "JACKPOT") {
                isExist.balance = req.body.balance;
            }
            else {
                let b = parseInt(isExist.balance);
                b += parseInt(req.body.balance);
                isExist.balance = b;
            }

        const user = await isExist.save();
        res.json(user);
    }
});

app.listen(PORT, (e) => {
    if (e) return console.log(e);

    console.log(`Server listening on port ${PORT}`);
});
