const mongoose = require('mongoose');


const bookSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        minlength: 2
    }
}, {
    timestamps: true
});

const Author = mongoose.model('Author', authorSchema);

module.exports = Author;