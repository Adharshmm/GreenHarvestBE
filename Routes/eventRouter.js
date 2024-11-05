const express = require('express')
const projRoutes = express.Router()
const jwtMiddleWare = require('../Middleware/jwtMiddleWare')

const eventController = require('../Controller/eventController')

projRoutes.get('/events',jwtMiddleWare,eventController.getAllEventsController)
projRoutes.post('/events/add',jwtMiddleWare,eventController.addEventsController)
projRoutes.put('/events/update/:eventId',jwtMiddleWare,eventController.updateEventController)
projRoutes.delete('/events/delete/:eventId',jwtMiddleWare,eventController.deleteEventController)
projRoutes.get("/event/farmId",jwtMiddleWare,eventController.getEventsById)
module.exports = projRoutes