const users = require('../Models/userModel')
const jwt = require('jsonwebtoken')
require('dotenv').config();


//regsiter users as user farmer or admin

exports.registerController = async (req, res) => {
    console.log('inside register controller')
    try {
        const { name, email, password, role, address } = req.body
        const exsistingUser = await users.findOne({ email: email })
        if (exsistingUser) {
            res.status(406).json("Account Already Exsists")
        } else {
            const newUser = new users({
                name: name,
                email: email,
                password: password,
                role: role,
                address: address
            })
            await newUser.save()
            res.status(201).json("successfully created")
        }
    } catch (error) {
        res.status(401).json(error)
    }
}

//login user

exports.loginController = async (req, res) => {
    const { email, password } = req.body;
    console.log(`inside login controller ${email} ${password}`)
    try {
        const user = await users.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "invalid credentials" })
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token, role: user.role,id:user._id });
    } catch (error) {
        console.error(error); 
        res.status(500).json({ message: 'Server error', error });
    }
}

//edit user

exports.editUserController = async (req, res) => {
    const userole = req.payload
    console.log(userole)
    console.log("inside user edit controller")
    const { id } = req.params; 
    const { name, email, role, address } = req.body;
    try {
        const user = await users.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.name = name || user.name;
        user.email = email || user.email;
        user.role = role || user.role;
        user.address = address || user.address;

        await user.save();
        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
};


//delete user

exports.deleteUserController = async (req, res) => {
    console.log('=========-------',"inside delete middle ware")
    const { id } = req.params; 
    try {
        const user = await users.findById(id);
        console.log('//s//a/a/a inside the try',user)
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const deleteResult = await users.deleteOne({ _id: id });
        if (deleteResult.deletedCount === 0) {
            return res.status(500).json({ message: 'Failed to delete user' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
};

//get user details
exports.getUserDetails = async(req,res)=>{
    console.log('inside the get user controller')
    const id = res.userRole
    try {
        const userDetals = await users.findOne({_id:id})
        console.log(userDetals)
        if(userDetals){
            res.status(200).json("got it")
        }else{
            res.status(403).json('user does not exists')
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

exports.userDetailsAdmin = async(req,res)=>{
    console.log("Inside the get user Details controller")
    try {
        const response = await users.find({role:"user"})
        res.status(200).json(response)
    } catch (error) {
        res.status(401).json(error)
    }
}
exports.farmerDetailsAdmin = async(req,res)=>{
    console.log("Inside the get farmer Details controller")
    try {
        const response = await users.find({role:"farmer"})
        res.status(200).json(response)
    } catch (error) {
        res.status(401).json(error)
    }
}