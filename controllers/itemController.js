const Category = require('../models/category');
const Item = require('../models/item');
const async = require('async');
const debug = require('debug')('item');
const { body, validationResult } = require('express-validator');

exports.item_list = (_req, res, next) => {

    // Retrieve all Item's
    Item.find().populate('category').exec((err, item_list) => {
        if (err) {
            debug(`list error: ${err}`);
            return next(err);
        }
        res.render('item/item_list', { title: 'Items List', item_list });
    });
}

exports.item_detail = (req, res, next) => {

    // Find Item by Id
    Item.findById(req.params.id).populate('category').exec((err, item) => {
        if (err) {
            debug(`list error: ${err}`);
            return next(err);
        }

        if (item == null) {
            let err = new Error('Item not found');
            debug(`detail error: ${err}`);
            return next(err);
        }

        res.render('item/item_detail', { title: 'Item Detail', item });
    });
};

exports.item_create_get = (_req, res, next) => {

    // Retrieve all Categories
    Category.find({}, (err, category_list) => {
        if (err) {
            debug(`list error: ${err}`);
            return next(err);
        }

        res.render('item/item_form', { title: 'Create New Item', category_list });
    });
};

exports.item_create_post = [

    // Validate & sanitize
    body('name', 'Name must be specified').trim().escape(),
    body('category', 'Category must be specified').trim().escape(),
    body('description', 'Description must be specified').trim().escape(),
    body('price', 'Price must be specified').trim().escape(),
    body('number_in_stock', 'Stock Count must be specified').trim().escape(),

    // Process request
    (req, res, next) => {

        // Extract validaiton errors
        const errors = validationResult(req);

        // Create new Item object with sanitized field values
        let new_item = new Item({
            name: req.body.name,
            category: req.body.category,
            description: req.body.description,
            price: req.body.price,
            number_in_stock: req.body.number_in_stock
        });

        // Validation errors found
        if (!errors.isEmpty()) {
            // Retrieve all Categories
            Category.find({}, (err, category_list) => {
                if (err) {
                    debug(`list error: ${err}`);
                    return next(err);
                }

                // Re-render form with input field's filled in and validation messages showing
                res.render('item/item_form', { title: 'Create New Item', category_list, selected_category: new_item.category, errors: errors.array(), submitted_item: new_item });
            });
        }
        else {
            // Form data is valid

            new_item.save((err) => {
                if (err) {
                    debug('create error:' + err);
                    return next(err)
                };

                // Successful - redirect to item's detail page
                res.redirect(new_item.url);
            });
        }
    }
];