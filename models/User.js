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

const UserSchema = mongoose.Schema({
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

module.exports = mongoose.model('User', UserSchema)
