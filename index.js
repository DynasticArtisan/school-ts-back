const express = require('express');
const path = require('path');
const mongoose = require("mongoose");
const config = require("config");
const cookieParser = require('cookie-parser');
const cors = require('cors');

const PORT = config.get('serverPORT');
const apiRouter = require('./routers/apiRouter');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: config.get("ClientURL") }));
app.use('/images', express.static(path.join(__dirname, 'filestore/images')));
app.use('/homeworks', express.static(path.join(__dirname, 'filestore/homeworks/')));
app.use('/mail', express.static(path.join(__dirname, 'filestore/mail/')));
app.use('/avatars', express.static(path.join(__dirname, 'filestore/avatars/')));
app.use('/api', apiRouter);
app.use(errorMiddleware);

const start = async () => {
    try {
        await mongoose.connect(config.get('DBURL'),{ useNewUrlParser: true, useUnifiedTopology: true })
        app.listen(PORT, ()=> {
            console.log("Server started on port ", PORT )
        })
    } catch (e) {
        console.log(e.message)
    }
}
start()
