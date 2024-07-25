"use strict";
import { Router } from "express";
import { RequestType, getAllCollections, getOneCollection } from "../Services/CollectionService.js";

const router = Router();

router.get('/', async (req, res) => {
    const coll = await getAllCollections();
    if (coll === null)
        return res.status(401).send("Couldn't GET collection");
    return res.json(coll);
});

router.get(`/:type`, async (req, res) => {
    console.log(req.url);
    const url = req.url.substring(1);
    const option = (() => {
        const index = url.indexOf('?');
        if (index === -1)
            return { animalType: url, reqType: RequestType.all };
        const middle = url.indexOf('=');
        const reqType = RequestType[url.substring(index + 1, middle)];
        let value = url.substring(middle + 1);
        if (reqType === RequestType.limit)
            value = parseInt(value);
        return { animalType: url.substring(0, index), reqType: reqType, value: value }; //value can be a string or number
    })();
    const collect = await getOneCollection(option);
    if (collect === null)
        return res.status(401).send("Couldn't GET collection");
    return res.json(collect);
});

export default router;