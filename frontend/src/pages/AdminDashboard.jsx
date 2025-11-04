import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [items, setItems] = useState([]);
  const [matches, setMatches] = useState([]);
  const [activeTab, setActiveTab] = useState('items');
  const [loading, setLoading] = useState(true);
  const [selectedLost, setSelectedLost] = useState('');
  const [selectedFound, setSelectedFound] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, itemsRes, matchesRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getAllItems(),
        adminAPI.getAllMatches()
      ]);
      setStats(statsRes.data.stats);
      setItems(itemsRes.data.items);
      setMatches(matchesRes.data.matches);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await adminAPI.updateItemStatus(id, status);
      fetchData();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await adminAPI.deleteItem(id);
        fetchData();
      } catch (error) {
        alert('Failed to delete item');
      }
    }
  };

  const handleCreateMatch = async () => {
    if (!selectedLost || !selectedFound) {
      alert('Please select both lost and found items');
      return;
    }

    try {
      await adminAPI.createMatch({
        lost_item_id: parseInt(selectedLost),
        found_item_id: parseInt(selectedFound)
      });
      alert('Match created successfully!');
      setSelectedLost('');
      setSelectedFound('');
      fetchData();
    } catch (error) {
      alert('Failed to create match');
    }
  };

  const handleMarkReturned = async (matchId) => {
    try {
      await adminAPI.markAsReturned(matchId);
      fetchData();
    } catch (error) {
      alert('Failed to mark as returned');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const lostItems = items.filter(item => item.status === 'lost');
  const foundItems = items.filter(item => item.status === 'found');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="card bg-red-50">
          <h3 className="text-sm font-medium text-gray-600">Lost Items</h3>
          <p className="text-3xl font-bold text-red-600">{stats?.totalLost || 0}</p>
        </div>
        <div className="card bg-green-50">
          <h3 className="text-sm font-medium text-gray-600">Found Items</h3>
          <p className="text-3xl font-bold text-green-600">{stats?.totalFound || 0}</p>
        </div>
        <div className="card bg-blue-50">
          <h3 className="text-sm font-medium text-gray-600">Matched</h3>
          <p className="text-3xl font-bold text-blue-600">{stats?.totalMatched || 0}</p>
        </div>
        <div className="card bg-gray-50">
          <h3 className="text-sm font-medium text-gray-600">Resolved</h3>
          <p className="text-3xl font-bold text-gray-600">{stats?.totalResolved || 0}</p>
        </div>
        <div className="card bg-purple-50">
          <h3 className="text-sm font-medium text-gray-600">Total Matches</h3>
          <p className="text-3xl font-bold text-purple-600">{stats?.totalMatches || 0}</p>
        </div>
        <div className="card bg-indigo-50">
          <h3 className="text-sm font-medium text-gray-600">Users</h3>
          <p className="text-3xl font-bold text-indigo-600">{stats?.totalUsers || 0}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex space-x-4 border-b">
          <button
            onClick={() => setActiveTab('items')}
            className={`pb-2 px-4 ${activeTab === 'items' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          >
            All Items
          </button>
          <button
            onClick={() => setActiveTab('matches')}
            className={`pb-2 px-4 ${activeTab === 'matches' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          >
            Matches
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`pb-2 px-4 ${activeTab === 'create' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          >
            Create Match
          </button>
        </div>
      </div>

      {/* Items Tab */}
      {activeTab === 'items' && (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Title</th>
                <th className="text-left py-3 px-4">Category</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Location</th>
                <th className="text-left py-3 px-4">Reported By</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.item_id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{item.title}</td>
                  <td className="py-3 px-4">{item.category}</td>
                  <td className="py-3 px-4">
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusUpdate(item.item_id, e.target.value)}
                      className="text-sm border rounded px-2 py-1"
                    >
                      <option value="lost">Lost</option>
                      <option value="found">Found</option>
                      <option value="matched">Matched</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">{item.location}</td>
                  <td className="py-3 px-4">{item.creator?.name}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleDelete(item.item_id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Matches Tab */}
      {activeTab === 'matches' && (
        <div className="space-y-4">
          {matches.map((match) => (
            <div key={match.match_id} className="card">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-r pr-6">
                  <h3 className="font-semibold text-red-600 mb-2">Lost Item</h3>
                  <p className="font-medium">{match.lostItem?.title}</p>
                  <p className="text-sm text-gray-600">{match.lostItem?.location}</p>
                  <p className="text-sm text-gray-600">By: {match.lostItem?.creator?.name}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-green-600 mb-2">Found Item</h3>
                  <p className="font-medium">{match.foundItem?.title}</p>
                  <p className="text-sm text-gray-600">{match.foundItem?.location}</p>
                  <p className="text-sm text-gray-600">By: {match.foundItem?.creator?.name}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Status: <span className="font-medium">{match.status}</span>
                </span>
                {match.status === 'matched' && (
                  <button
                    onClick={() => handleMarkReturned(match.match_id)}
                    className="btn-primary text-sm"
                  >
                    Mark as Returned
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Match Tab */}
      {activeTab === 'create' && (
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Create New Match</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Lost Item
              </label>
              <select
                value={selectedLost}
                onChange={(e) => setSelectedLost(e.target.value)}
                className="input-field"
              >
                <option value="">Choose lost item...</option>
                {lostItems.map((item) => (
                  <option key={item.item_id} value={item.item_id}>
                    {item.title} - {item.location}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Found Item
              </label>
              <select
                value={selectedFound}
                onChange={(e) => setSelectedFound(e.target.value)}
                className="input-field"
              >
                <option value="">Choose found item...</option>
                {foundItems.map((item) => (
                  <option key={item.item_id} value={item.item_id}>
                    {item.title} - {item.location}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={handleCreateMatch}
            className="btn-primary mt-6"
          >
            Create Match
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;