const Category = require('../models/category');
const Item = require('../models/item');
const async = require('async');
const debug = require('debug')('category');
const { body, validationResult } = require('express-validator');

exports.category_list = (_req, res, next) => {
    Category.find({}, (err, category_list) => {
        if (err) {
            debug(`list error: ${err}`)
            return next(err);
        }

        res.render('category/category_list', { title: 'Categories List', category_list })
    });
}

exports.category_create_get = (_req, res) => {
    res.render('category/category_form', { title: 'Create New Category' });
};

exports.category_create_post = [

    // Validate & sanitize
    body('name', 'Name must be specified').trim().isLength({ min: 1 }).escape(),
    body('description', 'Description must be specified').trim().isLength({ min: 1 }).escape(),

    // Process request
    (req, res, next) => {

        // Extract validation errors
        const errors = validationResult(req);

        // Create new Item object with sanitized field values
        let new_category = new Category({
            name: req.body.name,
            description: req.body.description
        });

        // Validation errors found
        if (!errors.isEmpty()) {
            // Re-render form with input field's filled in and validation messages showing
            res.render('category/category_form', { title: 'Create New Category', submitted_category: new_category, errors: errors.array() });
        }
        else {
            // Form data is valid
            new_category.save((err) => {
                if (err) {
                    debug('create error:' + err);
                    return next(err)
                };

                // Successful - redirect to item's detail page
                res.redirect(new_category.url);
            });
        }
    }
];