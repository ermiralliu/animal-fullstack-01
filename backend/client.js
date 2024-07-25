import { MongoClient } from "mongodb";
import config from "./config.json" with { type: "json" };

const client = new MongoClient(config.mongoURI);

await client.connect();
const db = client.db("Animals");

console.log('called once');

export default db;
