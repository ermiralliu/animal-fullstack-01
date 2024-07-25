"use strict";
import { join as pathJoin } from "path"; //trying to only import the needed functions
import express from 'express';
import config from './config.json' with { type: "json" };

import viewRoute from "./Routes/view.js";
import insertRoute from "./Routes/form.js";
import updateRoute from "./Routes/update.js";

import { URL, fileURLToPath } from 'url';
const __dirname = fileURLToPath(new URL('.', import.meta.url));

const app = express();

app.use(express.static(pathJoin(__dirname, "..", 'public')));

app.use("/view", viewRoute);
app.use("/insert", insertRoute);
app.use("/update", updateRoute);

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});
