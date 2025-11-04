const { Item, User, Log } = require('../models');
const { Op } = require('sequelize');

// Create new item 
exports.createItem = async (req, res) => {
  try {
    const { title, description, category, location, status } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const item = await Item.create({
      title,
      description,
      category,
      image_url,
      location,
      status,
      created_by: req.user.user_id
    });

    await Log.create({
      action: `Item ${status} reported`,
      user_id: req.user.user_id,
      details: `Item: ${title}`
    });

    res.status(201).json({
      message: 'Item reported successfully',
      item
    });
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({ message: 'Failed to create item', error: error.message });
  }
};

// get items
exports.getAllItems = async (req, res) => {
  try {
    const { status, category, search } = req.query;
    const where = {};

    if (status) {
      where.status = status;
    }

    if (category) {
      where.category = category;
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const items = await Item.findAll({
      where,
      include: [{
        model: User,
        as: 'creator',
        attributes: ['user_id', 'name', 'email']
      }],
      order: [['date_reported', 'DESC']]
    });

    res.json({ items });
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({ message: 'Failed to get items', error: error.message });
  }
};

// item by id
exports.getItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Item.findByPk(id, {
      include: [{
        model: User,
        as: 'creator',
        attributes: ['user_id', 'name', 'email']
      }]
    });

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json({ item });
  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({ message: 'Failed to get item', error: error.message });
  }
};

// get own items
exports.getMyItems = async (req, res) => {
  try {
    const items = await Item.findAll({
      where: { created_by: req.user.user_id },
      order: [['date_reported', 'DESC']]
    });

    res.json({ items });
  } catch (error) {
    console.error('Get my items error:', error);
    res.status(500).json({ message: 'Failed to get items', error: error.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, location } = req.body;

    const item = await Item.findByPk(id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.created_by !== req.user.user_id) {
      return res.status(403).json({ message: 'Not authorized to update this item' });
    }

    const image_url = req.file ? `/uploads/${req.file.filename}` : item.image_url;

    await item.update({
      title: title || item.title,
      description: description || item.description,
      category: category || item.category,
      location: location || item.location,
      image_url
    });

    res.json({ message: 'Item updated successfully', item });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({ message: 'Failed to update item', error: error.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Item.findByPk(id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.created_by !== req.user.user_id) {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }

    await item.destroy();

    await Log.create({
      action: 'Item deleted',
      user_id: req.user.user_id,
      details: `Deleted item: ${item.title}`
    });

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ message: 'Failed to delete item', error: error.message });
  }
};