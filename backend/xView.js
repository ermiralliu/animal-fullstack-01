"use strict";
import { Router } from "express";
const RequestType = {
    all: 0,
    limit: 1,
    search: 2,
    sort: 3
};
Object.freeze(RequestType);

export default function init(database) {
    const router = Router();
    router.get('/', async (req, res) => {
        const coll = await getAllCollections(database);
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
        const collect = await getOneCollection(database, option);
        if (collect === null)
            return res.status(401).send("Couldn't GET collection");
        return res.json(collect);
    });
    return router;
}
async function getAllCollections(database) {
    try {               
        const collections = await database.collections();
        const documents = await Promise.all(collections.map(async (collection) => {
            const docs = await collection.find().toArray();
            return Promise.resolve([collection.collectionName, docs]); //making an array of touples
        }));
        //Format into an object that looks like "collectionName: Documents"
        const formatted = documents.reduce((obj, collection) => {
            obj[collection[0]] = collection[1];
            return obj;
        }, {});
        return formatted;
    }
    catch (err) {
        console.error(err);
        return null;
    }
}
;
async function getOneCollection(database, option) {
    try {
        const this_collection = database.collection(option.animalType);
        const document = await this_collection.find().toArray();
        console.log(option);
        switch(option.reqType){
            case RequestType.all:
                return document;
            case RequestType.limit:
                return document.slice(0, option.value);
            case RequestType.search:
                return document.filter(element => element.name.toUpperCase().includes(option.value.toUpperCase()));
            case RequestType.sort:
                return document.sort((one, two) => {
                    const on = one.name.toUpperCase();
                    const tw = two.name.toUpperCase();
                    return (on > tw) ? 1 : (on === tw) ? 0 : -1;
                });
        }
    }
    catch (err) {
        console.error(err);
        return null;
    }
}
