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
router.get('/item/:id/delete', item_controller.item_delete_get);

// POST Item Delete page
router.post('/item/:id/delete', item_controller.item_delete_post);

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
router.get('/category/:id/update', category_controller.category_update_get);

// POST Category Update page
router.post('/category/:id/update', category_controller.category_update_post);

// GET Category Delete page
router.get('/category/:id/delete', category_controller.category_delete_get);

// POST Category Delete page
router.post('/category/:id/delete', category_controller.category_delete_post);

// GET Categorie detail page
router.get('/category/:id', category_controller.category_detail);

// GET Categories list page
router.get('/categories', category_controller.category_list);

module.exports = router;
