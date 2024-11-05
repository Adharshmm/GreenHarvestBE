const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/,
      },
      password: {
        type: String,
        required: true,
        minlength: 6, // Minimum length for the password
      },
      role: {
        type: String,
        enum: ['user','farmer','admin'], // Specify the possible roles
        default: 'user', // Default role
      },
      address: {
        type: String,
        required: true,
      },
    }, {
      timestamps: true, // Automatically create createdAt and updatedAt fields
    
})

userSchema.pre('save',async function (next){
  if(!this.isModified('password')){
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password,salt)
  next()
});

userSchema.methods.comparePassword = async function (enteredPassword){
  return await bcrypt.compare(enteredPassword,this.password);
};

const users = mongoose.model('users',userSchema)
module.exports = users