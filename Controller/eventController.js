const events = require('../Models/eventModel')

//geting events function
exports.getAllEventsController = async (req, res) => {
    try {
        let event;

        // Check user role and filter events based on it
        if (req.user.role === 'admin') {
            event = await events.find(); // Admin can view all events
        } else {
            event = await events.find({ status: 'approved' }); // Regular users see only approved events
        }

        res.status(200).json(event);
    } catch (error) {
        console.error("Error in getAllEventsController:", error);
        res.status(500).json({ message: 'Server error', error });
    }
}

//add events controller

exports.addEventsController = async (req, res) => {
    console.log("inside the add event controller")

    const { title, description, date, location, farmer } = req.body
    try {
        const newEvent = new events({
            title: title,
            description: description,
            date: date,
            location: location,
            farmer: farmer
        })
        console.log(newEvent)
        await newEvent.save()
        res.status(201).json("successfully added")
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

//update events
exports.updateEventController = async (req, res) => {
    console.log("Inside the update event controller");
    const { eventId } = req.params;
    const { title, description, date, location, farmer, status } = req.body;

    try {
        // Use findByIdAndUpdate to update fields directly
        const updatedEvent = await events.findByIdAndUpdate(
            eventId, // Pass the ID directly
            { title, description, date, location, farmer, status },
            { new: true } // Returns the updated document
        );

        // Check if event exists
        if (!updatedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json({ message: "Event updated successfully", updatedEvent });
    } catch (error) {
        console.error("Error updating event:", error);
        res.status(500).json({ message: "Server error", error });
    }
};


//delete events

exports.deleteEventController = async (req, res) => {
    const { eventId } = req.params;
    try {
        const deletedEvent = await events.findByIdAndDelete(eventId);

        if (!deletedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }


        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {

        console.error("Error deleting event:", error);
        res.status(500).json({ message: "Server error", error });
    }
};


//get events by id for the farmer dashboard
exports.getEventsById = async (req, res) => {
    console.log("Inside the get events by ID controller for Farmer Dashboard");
    const { farmerId } = req.userRole;

    try {
        const farmerEvents = await events.find({ farmer: farmerId });

        if (farmerEvents.length === 0) {
            return res.status(404).json({ message: "No events found for this farmer" });
        }

        res.status(200).json({ message: "Events retrieved successfully", events: farmerEvents });
    } catch (error) {
        console.error("Error retrieving events by farmer ID:", error);
        res.status(500).json({ message: "Server error", error });
    }
}
