import bodyParser from 'body-parser'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { config } from 'dotenv'
import express from 'express'
import http from 'http'
import mongoose from 'mongoose'
import router from './router'
config();

const app = express();

app.use(cors({
  credentials:true,
}))

app.use(compression())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json())

const server = http.createServer(app)

server.listen(8080,()=>{
  console.log("Server Running on http://localhost:8080/")
})

mongoose.Promise = Promise;
mongoose.connect(process.env.DB_URL).then(()=>{
  console.log("DB Connected");
});
mongoose.connection.on('error',(error: Error)=>{console.log(error)
});

app.use('/',router())