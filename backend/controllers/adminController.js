const { Item, Match, User, Log } = require('../models');

// Get all items for admin review
exports.getAllItemsAdmin = async (req, res) => {
  try {
    const items = await Item.findAll({
      include: [{
        model: User,
        as: 'creator',
        attributes: ['user_id', 'name', 'email']
      }],
      order: [['date_reported', 'DESC']]
    });

    res.json({ items });
  } catch (error) {
    console.error('Admin get items error:', error);
    res.status(500).json({ message: 'Failed to get items', error: error.message });
  }
};

// Update item status (verify, match, resolve)
exports.updateItemStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const item = await Item.findByPk(id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    await item.update({ status });

    // Log activity
    await Log.create({
      action: `Item status updated to ${status}`,
      user_id: req.user.user_id,
      details: `Item ID: ${id}, Title: ${item.title}`
    });

    res.json({ message: 'Item status updated successfully', item });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Failed to update status', error: error.message });
  }
};

// Create match between lost and found items
exports.createMatch = async (req, res) => {
  try {
    const { lost_item_id, found_item_id } = req.body;

    // Verify both items exist
    const lostItem = await Item.findByPk(lost_item_id);
    const foundItem = await Item.findByPk(found_item_id);

    if (!lostItem || !foundItem) {
      return res.status(404).json({ message: 'One or both items not found' });
    }

    // Create match
    const match = await Match.create({
      lost_item_id,
      found_item_id,
      verified_by: req.user.user_id,
      status: 'matched'
    });

    // Update both items to matched status
    await lostItem.update({ status: 'matched' });
    await foundItem.update({ status: 'matched' });

    // Log activity
    await Log.create({
      action: 'Items matched',
      user_id: req.user.user_id,
      details: `Lost: ${lostItem.title}, Found: ${foundItem.title}`
    });

    res.status(201).json({
      message: 'Match created successfully',
      match
    });
  } catch (error) {
    console.error('Create match error:', error);
    res.status(500).json({ message: 'Failed to create match', error: error.message });
  }
};

// Get all matches
exports.getAllMatches = async (req, res) => {
  try {
    const matches = await Match.findAll({
      include: [
        {
          model: Item,
          as: 'lostItem',
          include: [{ model: User, as: 'creator', attributes: ['name', 'email'] }]
        },
        {
          model: Item,
          as: 'foundItem',
          include: [{ model: User, as: 'creator', attributes: ['name', 'email'] }]
        },
        {
          model: User,
          as: 'verifier',
          attributes: ['name', 'email']
        }
      ],
      order: [['verified_at', 'DESC']]
    });

    res.json({ matches });
  } catch (error) {
    console.error('Get matches error:', error);
    res.status(500).json({ message: 'Failed to get matches', error: error.message });
  }
};

// Mark match as returned
exports.markAsReturned = async (req, res) => {
  try {
    const { id } = req.params;

    const match = await Match.findByPk(id);

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    await match.update({ status: 'returned' });

    // Update both items to resolved
    await Item.update({ status: 'resolved' }, {
      where: { item_id: [match.lost_item_id, match.found_item_id] }
    });

    // Log activity
    await Log.create({
      action: 'Match marked as returned',
      user_id: req.user.user_id,
      details: `Match ID: ${id}`
    });

    res.json({ message: 'Match marked as returned successfully', match });
  } catch (error) {
    console.error('Mark returned error:', error);
    res.status(500).json({ message: 'Failed to mark as returned', error: error.message });
  }
};

// Delete item (admin)
exports.deleteItemAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Item.findByPk(id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    await item.destroy();

    // Log activity
    await Log.create({
      action: 'Admin deleted item',
      user_id: req.user.user_id,
      details: `Deleted item: ${item.title}`
    });

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Admin delete error:', error);
    res.status(500).json({ message: 'Failed to delete item', error: error.message });
  }
};

// Get activity logs
exports.getLogs = async (req, res) => {
  try {
    const logs = await Log.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['name', 'email']
      }],
      order: [['timestamp', 'DESC']],
      limit: 100
    });

    res.json({ logs });
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({ message: 'Failed to get logs', error: error.message });
  }
};

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const totalLost = await Item.count({ where: { status: 'lost' } });
    const totalFound = await Item.count({ where: { status: 'found' } });
    const totalMatched = await Item.count({ where: { status: 'matched' } });
    const totalResolved = await Item.count({ where: { status: 'resolved' } });
    const totalUsers = await User.count();
    const totalMatches = await Match.count();

    res.json({
      stats: {
        totalLost,
        totalFound,
        totalMatched,
        totalResolved,
        totalUsers,
        totalMatches
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Failed to get stats', error: error.message });
  }
};