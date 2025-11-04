import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { itemsAPI } from '../services/api';

const ItemDetails = () => {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      const response = await itemsAPI.getById(id);
      setItem(response.data.item);
    } catch (error) {
      console.error('Error fetching item:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      lost: 'bg-red-100 text-red-800',
      found: 'bg-green-100 text-green-800',
      matched: 'bg-blue-100 text-blue-800',
      resolved: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Item not found</h2>
          <button onClick={() => navigate('/')} className="btn-primary">
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="mb-6 text-blue-600 hover:text-blue-800">
        ← Back
      </button>

      <div className="max-w-4xl mx-auto">
        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image */}
            <div>
              {item.image_url ? (
                <img
                  src={`http://localhost:5000${item.image_url}`}
                  alt={item.title}
                  className="w-full h-96 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{item.title}</h1>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
                  {item.status.toUpperCase()}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Category</h3>
                  <p className="text-gray-900">{item.category}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700">Description</h3>
                  <p className="text-gray-900">{item.description}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700">Location</h3>
                  <p className="text-gray-900">{item.location}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700">Date Reported</h3>
                  <p className="text-gray-900">
                    {new Date(item.date_reported).toLocaleString()}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700">Reported By</h3>
                  <p className="text-gray-900">{item.creator?.name}</p>
                  <p className="text-gray-600 text-sm">{item.creator?.email}</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  If this item belongs to you or you have information about it, please contact the reporter via email.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;