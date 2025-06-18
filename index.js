import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import connect from './config.js';
import router from './route/blogRouting.js';

dotenv.config();
connect()
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
    origin:'https://rk-blog-nine.vercel.app/',
    credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use('/api', router);
app.use(express.static(path.join(__dirname, 'public')));
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public/index.html'))
// })

app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'public/sory.html'))
});


const port = process.env.port || 3000;
app.listen(port, () => {
    console.log(`server running on http://localhost:${port}`);
})