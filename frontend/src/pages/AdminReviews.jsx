import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Check, X, Trash2, Eye, Star } from 'lucide-react';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All'); // All, Pending, Approved, Rejected
  const [selectedReview, setSelectedReview] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('https://saasecommerce.vercel.app/api/reviews', config);
      setReviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (productId, reviewId, status) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`https://saasecommerce.vercel.app/api/reviews/${productId}/${reviewId}/status`, { status }, config);
      fetchReviews();
      if (selectedReview && selectedReview._id === reviewId) {
        setSelectedReview({ ...selectedReview, status });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating review status');
    }
  };

  const handleDelete = async (productId, reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`https://saasecommerce.vercel.app/api/reviews/${productId}/${reviewId}`, config);
      fetchReviews();
      if (selectedReview && selectedReview._id === reviewId) setSelectedReview(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting review');
    }
  };

  const filteredReviews = filter === 'All' ? reviews : reviews.filter(r => r.status === filter);

  if (loading) return <div className="text-center py-20 text-slate-500">Loading Reviews...</div>;

  const tabs = ['All', 'Pending', 'Approved', 'Rejected'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Reviews Management</h2>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 border-b border-slate-200">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              filter === tab
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            {tab}
            {tab === 'Pending' && reviews.filter(r => r.status === 'Pending').length > 0 && (
              <span className="ml-2 bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs">
                {reviews.filter(r => r.status === 'Pending').length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-700 border-b">
            <tr>
              <th className="px-6 py-4 font-semibold">Customer</th>
              <th className="px-6 py-4 font-semibold">Product</th>
              <th className="px-6 py-4 font-semibold">Rating</th>
              <th className="px-6 py-4 font-semibold">Review</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredReviews.map(review => (
              <tr key={review._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{review.name}</td>
                <td className="px-6 py-4 text-primary-600">
                  <a href={`/product/${review.productId}`} target="_blank" rel="noreferrer" className="hover:underline">
                    {review.productName}
                  </a>
                </td>
                <td className="px-6 py-4">
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} size={14} className={star <= review.rating ? "fill-yellow-400" : "fill-slate-200 text-slate-200"} />
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-[200px] truncate" title={review.comment}>{review.comment}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    review.status === 'Approved' ? 'bg-green-100 text-green-700' :
                    review.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {review.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-1">
                  <button onClick={() => setSelectedReview(review)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="View Details">
                    <Eye size={18} />
                  </button>
                  {review.status === 'Pending' && (
                    <>
                      <button onClick={() => handleUpdateStatus(review.productId, review._id, 'Approved')} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Approve">
                        <Check size={18} />
                      </button>
                      <button onClick={() => handleUpdateStatus(review.productId, review._id, 'Rejected')} className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" title="Reject">
                        <X size={18} />
                      </button>
                    </>
                  )}
                  <button onClick={() => handleDelete(review.productId, review._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Review">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredReviews.length === 0 && (
          <div className="text-center py-10 text-slate-500">
            No {filter !== 'All' ? filter.toLowerCase() : ''} reviews found.
          </div>
        )}
      </div>

      {/* Review Details Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-800">Review Details</h3>
              <button onClick={() => setSelectedReview(null)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">{selectedReview.name}</h4>
                  <p className="text-sm text-slate-500">{new Date(selectedReview.createdAt).toLocaleString()}</p>
                </div>
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                  selectedReview.status === 'Approved' ? 'bg-green-100 text-green-700' :
                  selectedReview.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {selectedReview.status}
                </span>
              </div>
              
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Product</p>
                <p className="font-medium text-primary-600">{selectedReview.productName}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Rating</p>
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} size={18} className={star <= selectedReview.rating ? "fill-yellow-400" : "fill-slate-200 text-slate-200"} />
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Comment</p>
                <div className="bg-slate-50 p-4 rounded-xl border text-slate-700">
                  "{selectedReview.comment}"
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t bg-slate-50 flex justify-between">
              {selectedReview.status === 'Pending' ? (
                <div className="space-x-2">
                  <button onClick={() => handleUpdateStatus(selectedReview.productId, selectedReview._id, 'Approved')} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors">
                    Approve
                  </button>
                  <button onClick={() => handleUpdateStatus(selectedReview.productId, selectedReview._id, 'Rejected')} className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium transition-colors">
                    Reject
                  </button>
                </div>
              ) : <div></div>}
              <button onClick={() => setSelectedReview(null)} className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-medium transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
