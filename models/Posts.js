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

const PostSchema = mongoose.Schema({
    name:String,
    title: {
      type: String,
      required: true
    },
    description: String,
    age: {
      type: Number,
      default: 22
    }
})

module.exports = mongoose.model('Posts', PostSchema)
