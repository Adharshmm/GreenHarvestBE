require('dotenv').config()
require('./DB/connections')
const port = process.env.PORT;

const express = require('express')
const cors = require('cors')
const routes = require('./Routes/router')
const eventRouter = require('./Routes/eventRouter')
const itemsRouter = require('./Routes/itemRouter')
const ghServer = express()

ghServer.use(cors())
ghServer.use(express.json())
ghServer.use(routes)
ghServer.use(eventRouter)
ghServer.use(itemsRouter)

ghServer.get('/', (req, res) => {
})

ghServer.listen(port, () => {
    console.log("cart server running successfuly in port:" + port)
})