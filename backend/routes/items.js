const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { verifyToken } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', itemController.getAllItems);
router.get('/:id', itemController.getItemById);

router.post('/', verifyToken, upload.single('image'), itemController.createItem);
router.get('/user/my-items', verifyToken, itemController.getMyItems);
router.put('/:id', verifyToken, upload.single('image'), itemController.updateItem);
router.delete('/:id', verifyToken, itemController.deleteItem);

module.exports = router;