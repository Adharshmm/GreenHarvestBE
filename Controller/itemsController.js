const items = require('../Models/itemsModel')
const jwtMiddleWare = require('../Middleware/jwtMiddleWare')
const carts = require('../Models/cartModel')
//add items
exports.addItemController = async (req, res) => {
    console.log("Inside the add item controller");
    const { name, description, price, imageUrl } = req.body;
    console.log(name, description, price, imageUrl)
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
        const userRole = req.payload;
        let allItems;
        if (userRole === 'admin') {
            allItems = await items.find();
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

exports.updateItemStatus = async (req, res) => {
    console.log("inside update status controller")
    const adim = req.payload
    const { status, _id } = req.body

    if (adim === "admin") {
        try {
            const item = await items.findOne({ _id })
            if (item) {
                item.status = status
                await item.save()
                res.status(201).json({ message: "Updated" })
            }
        } catch (error) {
            res.status(401).json(error)
        }
    }
}

exports.addToCartController = async (req, res) => {
    console.log("Inside add to cart controller");
    const { productId, Pname, price, imageUrl, quantity } = req.body;
    const userId = req.userRole;

    console.log("Received data:", { productId, Pname, price, imageUrl, quantity });
    console.log("UserId:", userId);

    try {
        // Check if the product already exists in the user's cart
        const productExists = await carts.findOne({ productId, userId });

        if (!productExists) {
            // Add a new product to the cart if it doesn't already exist
            const newCartProduct = new carts({
                userId,
                productId,
                name: Pname,
                price,
                imageUrl,
                quantity,
                grandTotal: price * quantity // Calculate grand total for initial quantity
            });

            // Save the new product to the cart
            await newCartProduct.save();
            console.log("New product added to cart:", newCartProduct);
            return res.status(201).json({ message: "Item added to cart", product: newCartProduct });
        } else {
            // Update the existing product's quantity and grand total if it already exists
            productExists.quantity += 1;
            productExists.grandTotal = productExists.quantity * productExists.price;

            // Save the updated product data
            await productExists.save();
            console.log("Updated product in cart:", productExists);
            return res.status(200).json({ message: "Item quantity updated in cart", product: productExists });
        }
    } catch (error) {
        console.error("Error adding to cart:", error.message);
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};


exports.deleteFromCartController = async (req, res) => {
    const { productId, userId } = req.body;
    try {
        const deletedProduct = await carts.findOneAndDelete({ productId, userId });

        if (!deletedProduct) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        res.status(200).json({ message: "Item deleted from cart", productId });
    } catch (error) {
        console.error("Error deleting item from cart:", error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

exports.emptyCartController = async (req, res) => {
    const { userId } = req.body;
    try {
        const result = await carts.deleteMany({ userId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "No items found in cart to delete" });
        }

        res.status(200).json({ message: "Cart emptied successfully" });
    } catch (error) {
        console.error("Error emptying cart:", error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

exports.getAllCartController = async(req,res)=>{
    console.log('inside the all cart items controller')
    const userId = req.userRole;
    try {
        const exsistingProduct = await carts.find({userId})
        if (exsistingProduct) {
            res.status(201).json(exsistingProduct)
        }else{
            res.status(404).json("Item does not exsists")
        }
    } catch (error) {
        res.status(401).json("Something went wrong")
    }
}