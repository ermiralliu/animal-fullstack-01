"use strict";
import { join as pathJoin } from "path"; //trying to only import the needed functions
import express from 'express';
import database from "./client.js";
import initView from "./xView.js";
import initForm from "./xForm.js";
import initUpdate from "./xUpdate.js";
import { URL, fileURLToPath } from 'url';
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const app = express();
const port = 8081;
app.use(express.static(pathJoin(__dirname, "..", 'public')));
app.use("/view", initView(database));
app.use("/insert", initForm(database));
app.use("/update", initUpdate(database));
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
