var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CategorySchema = new Schema({
    name: { type: String, required: true, maxlength: 100 },
    description: { type: String, required: true }
});

// Virtual for Category's url
CategorySchema.virtual('url')
    .get(function () {
        return `/category/${this._id}`;
    });

module.exports = mongoose.model('Category', CategorySchema);