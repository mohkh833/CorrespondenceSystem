import express, { Request, Response } from 'express';

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import messageRoute from "./routes/message.route"
import formRenderRoute from "./routes/formRender.route"
import errorMiddleware from "./middleware/error.middleware"
import path from 'path';
import morgan from 'morgan'
import cors from 'cors';
import swaggerUi from 'swagger-ui-express'
// import fs from 'fs'

const swaggerDocument = require('./swagger/swagger.json');
const app = express();
dotenv.config();

const URL: any = process.env.MONGODBURL;
app.use(morgan('dev'))

app.use(express.static(__dirname + '/dist/client'));
app.use(express.json());
app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/messages" , messageRoute)
app.use("/form-render",formRenderRoute)

app.use(errorMiddleware)

app.get('/*', (req, res) => res.sendFile(path.join(__dirname)));

app.get('/', async (req: Request, res: Response) => {
	res.json('Hello world');
});

mongoose.connect(URL).then(() => {
	console.log('Db connected');
});

export default app