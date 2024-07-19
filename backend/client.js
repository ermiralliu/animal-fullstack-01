import { MongoClient } from "mongodb";

console.log(process.argv[2]);

if(process.argv[2] === null || process.argv[2] === undefined)
    throw new Error("No password given");

const password = process.argv[2];
const uri = `mongodb+srv://some_other_user00:${password}@cluster0.irq1hdb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri);

await client.connect();
const db = client.db("Animals");

export default db;
