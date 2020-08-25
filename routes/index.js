const express = require('express');
const router = express.Router();

const category_controller = require('../controllers/categoryController');
const item_controller = require('../controllers/itemController');

// GET Home page
router.get('/', function (_req, res) {
  res.render('index', { title: 'Grocery Inventory' });
});

/// ITEM ROUTES ///

// GET Item Create page
router.get('/item/create', item_controller.item_create_get);

// POST Item Create page
router.post('/item/create', item_controller.item_create_post);

// GET Item Update page
router.get('/item/:id/update', item_controller.item_update_get);

// POST Item Update page
router.post('/item/:id/update', item_controller.item_update_post);

// GET Item Delete page
router.get('/item/:id/delete', function (req, res, next) {
  res.render('item/item_list', { title: 'Items List' });
});

// POST Item Delete page
router.post('/item/:id/delete', function (req, res, next) {
  res.render('item/item_list', { title: 'Items List' });
});

// GET Item detail page
router.get('/item/:id', item_controller.item_detail);

// GET Items list page
router.get('/items', item_controller.item_list);

/// CATEGORY ROUTES ///

// GET Category Create page
router.get('/category/create', category_controller.category_create_get);

// POST Category Create page
router.post('/category/create', category_controller.category_create_post);

// GET Category Update page
router.get('/category/:id/update', function (req, res, next) {
  res.render('category/category_list', { title: 'Categories List' });
});

// POST Category Update page
router.post('/category/:id/update', function (req, res, next) {
  res.render('category/category_list', { title: 'Categories List' });
});

// GET Category Delete page
router.get('/category/:id/delete', function (req, res, next) {
  res.render('category/category_list', { title: 'Categories List' });
});

// POST Category Delete page
router.post('/category/:id/delete', function (req, res, next) {
  res.render('category/category_list', { title: 'Categories List' });
});

// GET Categorie detail page
router.get('/category/:id', function (req, res, next) {
  res.render('category/category_list', { title: 'Categories List' });
});

// GET Categories list page
router.get('/categories', category_controller.category_list);

module.exports = router;
