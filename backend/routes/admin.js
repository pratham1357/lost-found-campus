const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.use(verifyToken, isAdmin);

router.get('/items', adminController.getAllItemsAdmin);
router.patch('/items/:id/status', adminController.updateItemStatus);
router.delete('/items/:id', adminController.deleteItemAdmin);

router.post('/matches', adminController.createMatch);
router.get('/matches', adminController.getAllMatches);
router.patch('/matches/:id/returned', adminController.markAsReturned);

router.get('/stats', adminController.getDashboardStats);
router.get('/logs', adminController.getLogs);

module.exports = router;