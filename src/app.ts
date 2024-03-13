import express from "express";
import routes from './routes'
require('dotenv').config()

const app = express()

app.listen(process.env.PORT, () => {
    console.log(`server is running on port ${process.env.PORT}`)
})
app.use(express.json())

app.use('/', routes())