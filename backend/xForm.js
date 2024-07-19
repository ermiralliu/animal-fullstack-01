"use strict";
import { Router, urlencoded } from "express";

export default function init(database) {
    const router = Router();
    router.use(urlencoded({ extended: true }));
    router.post('/:type', async (req, res) => {
        const animal = req.body;
        console.log(JSON.stringify(animal));
        const type = req.url.replace('/', '');
        console.log(type);
        if ( 'colors' in animal || 'diet' in animal) {
            const key = ('colors' in animal) ? 'colors' : 'diet';
            const array = animal[ key ].split(",");
            animal[ key ] = array.map(element => element.trim());
        }
        if ( type === 'bird'){
            animal.weight = parseFloat(animal.weight);
            animal.height = parseFloat(animal.height);
        }
        console.log(animal);
        if (await insert(database, type, animal))
            return res.status(201).send("success");
        else
            return res.status(401).send("Operation not finished successfully");
    });
    return router;
}
async function insert(database, COLLECTION, animal) {
    try {
        const coll = database.collection(COLLECTION);
        await coll.insertOne(animal);
        return true;
    }
    catch (err) {
        console.error(err);
        return false;
    }
}
