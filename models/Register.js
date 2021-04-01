const mongoose = require('mongoose');

// String
// Number
// Date
// Buffer
// Boolean
// Mixed
// ObjectId
// Array
// Decimal128
// Map
// Schema

const RegisterSchema = mongoose.Schema({
    name:String,
    email: {
      type: String,
      required: true,
      min:5
    },
    password: {
      type: String,
      required: true,
      min:5
    }
})

module.exports = mongoose.model('Register', RegisterSchema)
