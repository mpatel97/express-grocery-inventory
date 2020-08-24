const Category = require('../models/category');
const Item = require('../models/item');
const async = require('async');
const debug = require('debug')('item');
const { body, validationResult } = require('express-validator');

exports.item_list = (_req, res, next) => {
    Item.find().populate('category').exec((err, item_list) => {
        if (err) {
            debug(`list error: ${err}`)
            return next(err);
        }
        res.render('item/item_list', { title: 'Items List', item_list })
    });
}