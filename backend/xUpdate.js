"use strict";
import { ObjectId } from "mongodb";
import { Router, json } from "express"; //maybe we can do something to make it more readable, like, name it expressRouter or sth
export default function init(database) {
    const router = Router();
    router.use(json()); //ktu kishte qene problemi kryesor for a while, sepse duhet te perdorej ky si parser
    router.put("/:id", async (req, res) => {
        const { type: type, ...animal } = req.body; //keep the type and assign the rest 
        let id = req.url;
        id = id.replace("/id=", "");
        console.log("id=", id);
        if ( 'colors' in animal || 'diet' in animal) {
            const key = ('colors' in animal) ? 'colors' : 'diet';
            const array = animal[ key ].split(",");
            animal[ key ] = array.map(element => element.trim());
        }
        // console.log(JSON.stringify(req.body));
        console.log(animal);
        try {
            const coll = database.collection(type);
            await coll.updateOne({ "_id": new ObjectId(id) }, { $set: animal });
            return res.status(201).json({ response: `updated id: ${id}` }); //ngaqe po perdorim express.json() parser, duhet qe response te jete object
        }
        catch (err) {
            console.error(err);
            return res.status(401).json(err);
        }
    });
    router.delete("/delete:id", async (req, res) => {
        console.log(req.url);
        const str = req.url;
        const idStart = str.indexOf("?id="); //this is used both in id and type, that's why we create it
        const id = str.substring(idStart, str.length).replace("?id=", "");
        const type = str.substring(str.indexOf("?type="), idStart).replace("?type=", "");
        console.log("type: " + type + "  id: " + id);
        try {
            const coll = database.collection(type);
            await coll.deleteOne({ "_id": new ObjectId(id) });
            console.log("success");
            return res.status(200).json({ response: `deleted id: ${id}` });
        }
        catch (err) {
            console.error(err);
            return res.status(401).json(err);
        }
    });
    return router;
}
