const mongoose= require( "mongoose");
const dotenv =require( "dotenv");
dotenv.config();
mongoose .connect(process.env.URL)
const UserSchema=mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstname: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },email: {                // Ensure this field is included if it's used
        type: String,
        required: true,
        unique: true
      },



})

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User model
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
});
const Account = mongoose.model("Account", accountSchema);
const User=mongoose.model("PaytmUser",UserSchema);
module.exports=  {User,Account}
