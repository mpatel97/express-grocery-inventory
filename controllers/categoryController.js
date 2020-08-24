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