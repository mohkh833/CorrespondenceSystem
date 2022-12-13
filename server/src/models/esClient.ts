import fs from "fs";
import * as path from 'path';

const {Client} = require("@elastic/elasticsearch");

export const client = new Client({
    node: "https://localhost:9200",
    auth: {
        username: 'elastic',
        password: 'x8jE*-nHXhQn24XcJ8A3'
    },
    tls: {
        ca: fs.readFile(path.join(__dirname, './http_ca.crt'), (error, data) => {
        }),
        rejectUnauthorized: false
    }
})