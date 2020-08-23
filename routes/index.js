var express = require('express');
var router = express.Router();

// GET Home page
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/// ITEM ROUTES ///

// GET Items list page
router.get('/items', function (req, res, next) {
  res.render('item/item_list', { title: 'Items List' })
});

// GET Item Create page
router.get('/items', function (req, res, next) {
  res.render('item/item_list', { title: 'Items List' })
});

// POST Item Create page
router.post('/items', function (req, res, next) {
  res.render('item/item_list', { title: 'Items List' })
});

// GET Item Update page
router.get('/items', function (req, res, next) {
  res.render('item/item_list', { title: 'Items List' })
});

// POST Item Update page
router.post('/items', function (req, res, next) {
  res.render('item/item_list', { title: 'Items List' })
});

// GET Item Delete page
router.get('/items', function (req, res, next) {
  res.render('item/item_list', { title: 'Items List' })
});

// POST Item Delete page
router.post('/items', function (req, res, next) {
  res.render('item/item_list', { title: 'Items List' })
});

/// CATEGORY ROUTES ///

// GET Categories list page
router.get('/categories', function (req, res, next) {
  res.render('category/category_list', { title: 'Categories List' })
});

// GET Category Create page
router.get('/categories', function (req, res, next) {
  res.render('category/category_list', { title: 'Categories List' })
});

// POST Category Create page
router.post('/categories', function (req, res, next) {
  res.render('category/category_list', { title: 'Categories List' })
});

// GET Category Update page
router.get('/categories', function (req, res, next) {
  res.render('category/category_list', { title: 'Categories List' })
});

// POST Category Update page
router.post('/categories', function (req, res, next) {
  res.render('category/category_list', { title: 'Categories List' })
});

// GET Category Delete page
router.get('/categories', function (req, res, next) {
  res.render('category/category_list', { title: 'Categories List' })
});

// POST Category Delete page
router.post('/categories', function (req, res, next) {
  res.render('category/category_list', { title: 'Categories List' })
});

module.exports = router;
