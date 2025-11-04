import { Link } from 'react-router-dom';

const ItemCard = ({ item }) => {
  const getStatusColor = (status) => {
    const colors = {
      lost: 'bg-red-100 text-red-800',
      found: 'bg-green-100 text-green-800',
      matched: 'bg-blue-100 text-blue-800',
      resolved: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      {item.image_url && (
        <img
          src={`http://localhost:5000${item.image_url}`}
          alt={item.title}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      )}
      
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-semibold text-gray-800">{item.title}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
          {item.status.toUpperCase()}
        </span>
      </div>

      <p className="text-gray-600 mb-2 line-clamp-2">{item.description}</p>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span className="flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {item.location}
        </span>
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
          {item.category}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {new Date(item.date_reported).toLocaleDateString()}
        </span>
        <Link
          to={`/item/${item.item_id}`}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
};

export default ItemCard;