var async = require('async')
var Category = require('./models/category')
var Item = require('./models/item')
require('dotenv').config({ path: __dirname + '/.env' })

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var categories = []
var items = []

function categoryCreate(name, description, cb) {
    var category = new Category({ name, description });

    category.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New Category: ' + category);
        categories.push(category)
        cb(null, category)
    });
}

function itemCreate(name, description, category, price, number_in_stock, cb) {
    var item = new Item({ name, description, category, number_in_stock });

    if (price != false) item.price = price;

    item.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log('New Item: ' + item);
        items.push(item)
        cb(null, item);
    });
}

async.series([
    function (callback) {
        categoryCreate('Bakers\' Confectionery', 'Bakers\' confectionery, also called flour confections, includes principally sweet pastries, cakes, and similar baked goods.', callback);
    },
    function (callback) {
        categoryCreate('Sugar Confectionery', 'Sugar confectionery includes candies (usually called sweets in British English), candied nuts, chocolates, chewing gum, bubble gum, pastillage, and other confections that are made primarily of sugar.', callback);
    },
    function (callback) {
        categoryCreate('Soft Drink', 'A soft drink is a drink that usually contains carbonated water, a sweetener, and a natural or artificial flavoring. ', callback);
    },
    function (callback) {
        categoryCreate('Canned Food', 'Preserved foods packed in a airtight container for long periods.', callback);
    },
    function (callback) {
        categoryCreate('Flour', 'Flour is a powder made by grinding raw grains, roots, beans, nuts, seeds, or bones.', callback);
    },
    function (callback) {
        categoryCreate('Cereal', 'Breakfast cereal is a traditional breakfast made from processed cereal grains.', callback);
    },
    function (callback) {
        itemCreate("Coca-Cola 1.5L", "Carbonated soft drink manufactured by The Coca-Cola Company.", categories[2], 199, 25, callback);
    },
    function (callback) {
        itemCreate("Wattie's Peaches Sliced in Clear Fruit Juice 420g", "Grown under the sun in Hawke's Bay orchards and hand-picked, only the finest golden peaches are good enough to be chosen by Wattie's.", categories[3], 280, 9, callback);
    },
    function (callback) {
        itemCreate("Wattie's Baken Beans 420g", "Baked beans are high in dietary fibre, high in protein and naturally low in fat with no added colours or preservatives.", categories[3], 200, 4, callback);
    },
    function (callback) {
        itemCreate("Sprite 1.5L", "Sprite is a lemon-lime flavoured soft drink with a crisp, clean taste that gives you the ultimate cut-through refreshment.", categories[2], 197, 0, callback);
    },
    function (callback) {
        itemCreate("Haribo Starmix 150g", "Carbonated soft drink manufactured by The Coca-Cola Company.", categories[1], 209, 13, callback);
    }],

    // Optional callback
    (err, _results) => {
        if (err) {
            console.log('FINAL ERROR: ' + err);
        }

        // All done, disconnect from database
        mongoose.connection.close();
    }
);
