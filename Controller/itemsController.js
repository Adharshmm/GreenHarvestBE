const items = require('../Models/itemsModel')
const jwtMiddleWare = require('../Middleware/jwtMiddleWare')

//add items
exports.addItemController = async (req, res) => {
    console.log("Inside the add item controller");
    const { name, description, price,imageUrl } = req.body;
    console.log(name, description, price,imageUrl )
    const farmer = req.userRole
    try {
        const newItem = new items({
            name,
            description,
            price,
            imageUrl,
            farmer
        });
        await newItem.save();
        res.status(201).json({ message: "Item successfully added", item: newItem });
    } catch (error) {
        console.error("Error adding item:", error);
        res.status(500).json({ message: "Server error", error });
    }
}

//update items

exports.updateEventController = async (req, res) => {
    console.log("Inside the update item controller");
    const { itemId } = req.params;
    const { name, description, price, quantity, status } = req.body;

    try {
        const updatedItem = await items.findByIdAndUpdate(
            itemId,
            {
                name: name || undefined,
                description: description || undefined,
                price: price || undefined,
                quantity: quantity || undefined,
                status: status || undefined,
            },
            { new: true, runValidators: true }
        );

        if (!updatedItem) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.status(200).json({ message: "Item updated successfully", updatedItem });
    } catch (error) {
        console.error("Error updating item:", error);
        res.status(500).json({ message: "Server error", error });
    }
}

//get items

exports.getAllItemsController = async (req, res) => {
    console.log("Inside the get all items controller");

    try {
        const userRole = req.payload ; 
        let allItems;
        if (userRole === 'admin') {
            allItems = await items.find().populate('farmer', 'name email');
        } else {
            allItems = await items.find({ status: 'approved' }).populate('farmer', 'name email');
        }

        if (allItems.length === 0) {
            return res.status(404).json({ message: "No items found" });
        }

        res.status(200).json({ message: "Items retrieved successfully", allItems });
    } catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).json({ message: "Server error", error });
    }
};


//delete items
exports.ItemsDeleteController = async (req, res) => {
    console.log("Inside the delete item controller");
    const { itemId } = req.params;

    try {
        const deletedItem = await items.findByIdAndDelete(itemId);
        if (!deletedItem) {
            return res.status(404).json({ message: "Item not found" });
        }
        res.status(200).json({ message: "Item deleted successfully", deletedItem });
    } catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).json({ message: "Server error", error });
    }
}

//get item by id  for farmer dahboard

exports.getItemByIdController = async (req, res) => {
    const farmerId = req.userRole
    console.log("Inside the get items by farmer ID controller for Farmer Dashboard");
    console.log(req.userRole)
    try {
        const farmerItems = await items.find({ farmer: farmerId });
        if (!farmerItems || farmerItems.length === 0) {
            return res.status(404).json({ message: "No items found for this farmer" });
        }
        res.status(200).json({ message: "Items retrieved successfully", items: farmerItems });
    } catch (error) {
        console.error("Error retrieving items for farmer:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
