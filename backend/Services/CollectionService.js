import database from "../client.js";
import { ObjectId } from "mongodb";

export const RequestType = (()=>{
    const rt = {
        all: 0,
        limit: 1,
        search: 2,
        sort: 3
    };
    Object.freeze(rt);
    return rt;
})();

export async function getAllCollections() {
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

export async function getOneCollection(option) {
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

export async function insert(COLLECTION, animal) {
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

export async function update(id, type, animal){
    try{
        const coll = database.collection(type);
        await coll.updateOne({ "_id": new ObjectId(id) }, { $set: animal });
        return true;
    }
    catch (err){
        console.error(err);
        return false;
    }
}

export async function deleteEntry(id, type){
    try{
        const coll = database.collection(type);
        await coll.deleteOne({ "_id": new ObjectId(id) });
        console.log("success");
        return true;
    }
    catch(err){
        console.error(err);
        return false;
    } 
}