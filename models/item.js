var mongoose = require('mongoose');
const e = require('express');

var Schema = mongoose.Schema;

var ItemSchema = new Schema({
    name: { type: String, required: true, maxlength: 100 },
    description: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'category', required: true },
    price: { type: Number },
    number_in_stock: { type: Number, required: true }
});

// Virtual for Item's url
ItemSchema.virtual('url').get(function () {
    return `/item/${this._id}`;
});

// Virtual for Item's stock status
ItemSchema.virtual('stock_status').get(function () {
    if (this.number_in_stock == 0)
        return 'Out of Stock';
    else if (this.number_in_stock < 5)
        return 'Low Stock';
    else
        return `Available`;
});

module.exports = mongoose.model('Item', ItemSchema);