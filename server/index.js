require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const cookie = require("cookie-parser")

const port = process.env.port || 5000
const app = express()

app.use(cors())
app.use(cookie())
app.use(cors({
    credentials: true,
    origin: process.env.client_url
}))



const start = () => {
    try {
        mongoose.connect(process.env.mongo)
        app.listen(port, () => {
            console.log('Server started at ' + port )
        })
    } catch (error) {
        console.log(error)
    }
}

start()