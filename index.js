require('dotenv').config()
require('./DB/connections')

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


const PORT = 3000;
ghServer.listen(PORT,()=>{
    console.log("cart server running successfuly in port:"+PORT)
})
ghServer.get('/',(req,res)=>{
})