const express = require("express")
const jwtMiddleware = require("../Middleware/jwtMiddleWare")
const itemRouter = express.Router()
const itemController = require('../Controller/itemsController')


itemRouter.post("/items/add", jwtMiddleware, itemController.addItemController);

itemRouter.get("/items", jwtMiddleware, itemController.getAllItemsController);

itemRouter.get("/items/farmId", jwtMiddleware, itemController.getItemByIdController);

itemRouter.put("/items/update/:itemId", jwtMiddleware, itemController.updateEventController);

itemRouter.delete("/items/delete/:itemId", jwtMiddleware, itemController.ItemsDeleteController);
itemRouter.put("/item/status",jwtMiddleware,itemController.updateItemStatus)
module.exports = itemRouter