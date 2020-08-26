const Category = require('../models/category');
const Item = require('../models/item');
const async = require('async');
const debug = require('debug')('category');
const { body, validationResult } = require('express-validator');
require('dotenv').config({ path: __dirname + '/../.env' });

exports.category_list = (_req, res, next) => {
    Category.find({}, (err, category_list) => {
        if (err) {
            debug(`list error: ${err}`)
            return next(err);
        }

        res.render('category/category_list', { title: 'Categories List', category_list })
    });
}

exports.category_detail = (req, res, next) => {

    async.parallel({
        category: (callback) => {
            Category.findById(req.params.id).exec(callback);
        },
        item_list: (callback) => {
            Item.find({ 'category': req.params.id }).exec(callback)
        }
    }, (err, results) => {
        if (err) {
            debug('detail error:' + err);
            return next(err)
        };

        if (results == null) {
            let err = new Error('Category not found');
            err.status = 404;
            debug('detail error:' + err);
            return next(err);
        }

        res.render('category/category_detail', { title: 'Category Detail', category: results.category, item_list: results.item_list });
    });
};

exports.category_create_get = (_req, res) => {
    res.render('category/category_form', { title: 'Create New Category' });
};

exports.category_create_post = [

    // Validate & sanitize
    body('name', 'Name must be specified').trim().isLength({ min: 1 }).escape(),
    body('description', 'Description must be specified').trim().isLength({ min: 1 }).escape(),
    body('confirm_save').isLength({ min: 1 }).withMessage('Admin Password is required')
        .equals(process.env.ADMIN_PASSWORD).withMessage('Invalid Password')
        .escape(),

    // Process request
    (req, res, next) => {

        // Extract validation errors
        const errors = validationResult(req);

        // Create new Item object with sanitized field values
        let category = new Category({
            name: req.body.name,
            description: req.body.description
        });

        // Validation errors found
        if (!errors.isEmpty()) {
            // Re-render form with input field's filled in and validation messages showing
            res.render('category/category_form', { title: 'Create New Category', category, errors: errors.array() });
        }
        else {
            // Form data is valid
            category.save((err) => {
                if (err) {
                    debug('create error:' + err);
                    return next(err)
                };

                // Successful - redirect to item's detail page
                res.redirect(category.url);
            });
        }
    }
];

exports.category_update_get = (req, res, next) => {

    Category.findById(req.params.id, (err, category) => {
        if (err) {
            debug('update error:' + err);
            return next(err)
        }

        if (category == null) {
            let err = new Error('Category not found');
            err.status = 404;
            debug('update error:' + err);
            return next(err)
        }

        res.render('category/category_form', { title: 'Update Category', category });
    });
};

exports.category_update_post = [

    // Validate & sanitize
    body('name', 'Name must be specified').trim().isLength({ min: 1 }).escape(),
    body('description', 'Description must be specified').trim().isLength({ min: 1 }).escape(),
    body('confirm_save').isLength({ min: 1 }).withMessage('Admin Password is required')
        .equals(process.env.ADMIN_PASSWORD).withMessage('Invalid Password')
        .escape(),

    // Process request
    (req, res, next) => {

        // Extract validation errors
        const errors = validationResult(req);

        // Create new Item object with sanitized field values
        let category = new Category({
            name: req.body.name,
            description: req.body.description,
            _id: req.params.id
        });

        // Validation errors found
        if (!errors.isEmpty()) {
            // Re-render form with input field's filled in and validation messages showing
            res.render('category/category_form', { title: 'Update Category', category, errors: errors.array() });
        }
        else {
            // Form data is valid
            Category.findByIdAndUpdate(req.params.id, category, { useFindAndModify: false }, (err, updated_category) => {
                if (err) {
                    debug('update error:' + err);
                    return next(err)
                };

                // Successful - redirect to item's detail page
                res.redirect(updated_category.url);
            });
        }
    }
];

exports.category_delete_get = (req, res, next) => {

    async.parallel({
        category: (callback) => {
            Category.findById(req.params.id).exec(callback);
        },
        item_list: (callback) => {
            Item.find({ 'category': req.params.id }).exec(callback)
        }
    }, (err, results) => {

        if (err) {
            debug('delete error:' + err);
            return next(err)
        };

        if (results == null) {
            let err = new Error('Category not found');
            err.status = 404;
            debug('delete error:' + err);
            return next(err);
        }

        res.render('category/category_delete', { title: 'Delete Category', category: results.category, item_list: results.item_list })
    });
};

exports.category_delete_post = [

    // Validate & sanitize admin password field
    body('confirm_delete')
        .isLength({ min: 1 }).withMessage('Admin Password is required')
        .equals(process.env.ADMIN_PASSWORD).withMessage('Invalid Password')
        .escape(),

    (req, res, next) => {

        // Extract validation errors
        const errors = validationResult(req);

        async.parallel({
            category: (callback) => {
                Category.findById(req.params.id).exec(callback);
            },
            item_list: (callback) => {
                Item.find({ 'category': req.params.id }).exec(callback)
            }
        }, (err, results) => {

            if (err) {
                debug('delete error:' + err);
                return next(err)
            };

            if (results == null) {
                let err = new Error('Category not found');
                err.status = 404;
                debug('delete error:' + err);
                return next(err);
            }

            // Category has associated Items. Render in same way as for GET route.
            if (results.item_list.length > 0) {
                res.render('category/category_delete', { title: 'Delete Category', category: results.category, item_list: results.item_list });
                return;
            }

            if (!errors.isEmpty()) {
                // Render delete page with password field validation error
                res.render('category/category_delete', { title: 'Delete Category', category: results.category, item_list: results.item_list, error: errors.array()[0] });
                return;
            }
            else {
                // Remove Category
                Category.findByIdAndRemove(req.body.categoryid, { useFindAndModify: false }, (err) => {
                    if (err) {
                        debug('delete error:' + err);
                        return next(err)
                    };

                    // Success - go to category's list
                    res.redirect('/categories')
                })
            }
        });
    }
];