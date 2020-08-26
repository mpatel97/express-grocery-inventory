var mongoose = require('mongoose');
const e = require('express');
require('mongoose-currency').loadType(mongoose);

var Schema = mongoose.Schema;

var ItemSchema = new Schema({
    name: { type: String, required: true, maxlength: 100 },
    description: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    price: { type: mongoose.Types.Currency, min: 0, required: true },
    number_in_stock: { type: Number, required: true },
    image: { data: Buffer, contentType: String }
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
        return 'Available';
});

// Virtual for formatted Item price, convert int to float
ItemSchema.virtual('formatted_price').get(function () {
    return (this.price / 100).toFixed(2);
});

module.exports = mongoose.model('Item', ItemSchema);