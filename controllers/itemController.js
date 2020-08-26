const Category = require('../models/category');
const Item = require('../models/item');
const async = require('async');
const debug = require('debug')('item');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: __dirname + '/../.env' })

const multer = require('multer')({
    dest: 'uploads/',

    // Only allow specific file types to be uploaded
    fileFilter: function (_req, file, callback) {
        if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/gif' && file.mimetype !== 'image/jpeg') {
            return callback(new Error('Only .png, .jpg, .jpeg & .gif format allowed'))
        }
        callback(null, true)
    },
    limits: { fileSize: 150000 } // Set file size limit to 150KB
});
const image_upload = multer.single('image');

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

    // Handle req.file first
    image_upload,

    // Validate & sanitize
    body('name', 'Name must be specified').trim().isLength({ min: 1 }).escape(),
    body('category', 'Category must be specified').trim().isLength({ min: 1 }).escape(),
    body('description', 'Description must be specified').trim().isLength({ min: 1 }).escape(),
    body('price', 'Price must be specified').trim().isLength({ min: 1 }).escape(),
    body('number_in_stock', 'Stock Count must be specified').trim().isLength({ min: 1 }).escape(),
    body('confirm_save').isLength({ min: 1 }).withMessage('Admin Password is required')
        .equals(process.env.ADMIN_PASSWORD).withMessage('Invalid Password')
        .escape(),

    // Process request
    (req, res, next) => {

        // Extract validation errors
        const errors = validationResult(req);

        // Create new Item object with sanitized field values
        let item = new Item({
            name: req.body.name,
            category: req.body.category,
            description: req.body.description,
            price: req.body.price,
            number_in_stock: req.body.number_in_stock
        });

        // Add image to Item object if image file is submitted
        if (req.file) {
            item.image = {
                data: fs.readFileSync(path.join(__dirname + '/../uploads/' + req.file.filename)),
                contentType: req.file.mimetype
            }

            // Remove image from uploads folder
            fs.unlink(path.join(__dirname + '/../uploads/' + req.file.filename), (err) => {
                if (err) {
                    debug('image delete error:' + err);
                    return next(err)
                }
            });
        }

        // Validation errors found
        if (!errors.isEmpty()) {

            // Get all validation errors and convert to an array of error messages
            let all_errors = errors.array().map(err => err.msg);

            // Get error message from multer error and append to errors list
            image_upload(req, res, (err) => {
                if (err) all_errors.push(`Item Image: ${err.message}`);
            });

            // Remove image from item object
            item.image = {};

            // Retrieve all Categories
            Category.find({}, (err, category_list) => {
                if (err) {
                    debug(`list error: ${err}`);
                    return next(err);
                }

                // Re-render form with input field's filled in and validation messages showing
                res.render('item/item_form', { title: 'Create New Item', category_list, errors: all_errors, item });
            });
        }
        else {
            // Form data is valid
            item.save((err) => {
                if (err) {
                    debug('create error:' + err);
                    return next(err)
                };

                // Successful - redirect to item's detail page
                res.redirect(item.url);
            });
        }
    }
];

exports.item_update_get = (req, res, next) => {

    async.parallel({
        item: (callback) => {
            Item.findById(req.params.id).exec(callback);
        },
        category_list: (callback) => {
            Category.find().exec(callback)
        }
    }, (err, results) => {
        if (err) {
            debug(`update error: ${err}`);
            return next(err);
        }

        if (results.item == null) {
            let err = new Error('Item not found');
            debug(`update error: ${err}`);
            return next(err);
        }

        res.render('item/item_form', { title: 'Update Item', category_list: results.category_list, item: results.item });
    });
};

exports.item_update_post = [

    // Handle req.file first
    image_upload,

    // Validate & sanitize
    body('name', 'Name must be specified').trim().isLength({ min: 1 }).escape(),
    body('category', 'Category must be specified').trim().isLength({ min: 1 }).escape(),
    body('description', 'Description must be specified').trim().isLength({ min: 1 }).escape(),
    body('price', 'Price must be specified').trim().isLength({ min: 1 }).escape(),
    body('number_in_stock', 'Stock Count must be specified').trim().isLength({ min: 1 }).escape(),
    body('confirm_save').isLength({ min: 1 }).withMessage('Admin Password is required')
        .equals(process.env.ADMIN_PASSWORD).withMessage('Invalid Password')
        .escape(),

    // Process request
    (req, res, next) => {

        // Extract validation errors
        const errors = validationResult(req);

        // Create new Item object with sanitized field values
        let item = new Item({
            _id: req.params.id, // To ensure new ID is not assigned
            name: req.body.name,
            category: req.body.category,
            description: req.body.description,
            price: req.body.price,
            number_in_stock: req.body.number_in_stock
        });

        // Add image to Item object if image file is submitted
        if (req.file) {
            item.image = {
                data: fs.readFileSync(path.join(__dirname + '/../uploads/' + req.file.filename)),
                contentType: req.file.mimetype
            }

            // Remove image from uploads folder
            fs.unlink(path.join(__dirname + '/../uploads/' + req.file.filename), (err) => {
                if (err) {
                    debug('image delete error:' + err);
                    return next(err);
                }
            });
        }

        // Validation errors found
        if (!errors.isEmpty()) {

            // Get all validation errors and convert to an array of error messages
            let all_errors = errors.array().map(err => err.msg);

            // Get error message from multer error and append to errors list
            image_upload(req, res, (err) => {
                if (err) all_errors.push(`Item Image: ${err.message}`);
            });

            // Remove image from item object
            item.image = {};

            // Retrieve all Categories
            Category.find({}, (err, category_list) => {
                if (err) {
                    debug(`update error: ${err}`);
                    return next(err);
                }

                // Re-render form with input field's filled in and validation messages showing
                res.render('item/item_form', { title: 'Update Item', category_list, errors: all_errors, item });
            });
        }
        else {
            // Form data is valid
            Item.findByIdAndUpdate(req.params.id, item, { useFindAndModify: false }, (err, updated_item) => {
                if (err) {
                    debug(`update error: ${err}`);
                    return next(err);
                }

                // Successful - redirect to item detail page.
                res.redirect(updated_item.url);
            });
        }
    }
];

exports.item_delete_get = (req, res, next) => {
    Item.findById(req.params.id).populate('category').exec((err, item) => {
        if (err) {
            debug('delete error:' + err);
            return next(err)
        };

        if (item == null) {
            let err = new Error('Item not found');
            err.status = 404;
            debug('delete error:' + err);
            return next(err);
        }

        res.render('item/item_delete', { title: 'Delete Item', item });
    });
};

exports.item_delete_post = [

    // Validate & sanitize admin password field
    body('confirm_delete')
        .isLength({ min: 1 }).withMessage('Admin Password is required')
        .equals(process.env.ADMIN_PASSWORD).withMessage('Invalid Password')
        .escape(),

    (req, res, next) => {

        // Extract validation errors
        const errors = validationResult(req);

        Item.findById(req.body.itemid, (err, result) => {
            if (err) {
                debug('delete error:' + err);
                return next(err)
            };

            if (result == null) {
                let err = new Error('Item not found');
                err.status = 404;
                debug('delete error:' + err);
                return next(err);
            }

            if (!errors.isEmpty()) {
                res.render('item/item_delete', { title: 'Delete Item', item: result, error: errors.array()[0] });
                return;
            }
            else {
                // Remove Item
                Item.findByIdAndRemove(req.body.itemid, { useFindAndModify: false }, (err) => {
                    if (err) {
                        debug('delete error:' + err);
                        return next(err)
                    };

                    // Success - go to item's list
                    res.redirect('/items')
                })
            }
        });
    }

];