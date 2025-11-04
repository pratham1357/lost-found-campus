import { useState, useEffect } from 'react';
import { itemsAPI } from '../services/api';
import ItemCard from '../components/ItemCard';

const MySubmissions = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyItems();
  }, []);

  const fetchMyItems = async () => {
    try {
      const response = await itemsAPI.getMyItems();
      setItems(response.data.items);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await itemsAPI.delete(id);
        setItems(items.filter(item => item.item_id !== id));
      } catch (error) {
        alert('Failed to delete item');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Submissions</h1>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">You haven't submitted any items yet</p>
          <div className="space-x-4">
            <a href="/report-lost" className="btn-primary">Report Lost Item</a>
            <a href="/report-found" className="btn-secondary">Report Found Item</a>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.item_id} className="relative">
              <ItemCard item={item} />
              <button
                onClick={() => handleDelete(item.item_id)}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MySubmissions;