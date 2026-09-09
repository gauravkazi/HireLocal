import { useState, useEffect } from 'react';
import API from '../api/axios';

function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState(null);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [message, setMessage] = useState('');
  const [reviewedIds, setReviewedIds] = useState([]);

  const fetchRequests = async () => {
    try {
      const res = await API.get('/requests/my-requests');
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const startReview = (id) => {
    setReviewingId(id);
    setRating(5);
    setFeedback('');
    setMessage('');
  };

  const cancelReview = () => {
    setReviewingId(null);
    setMessage('');
  };

  const submitReview = async (requestId) => {
    setMessage('');
    try {
      await API.post('/reviews', {
        requestId,
        rating,
        feedback,
      });
      setMessage('Review submitted successfully!');
      setReviewedIds((prev) => [...prev, requestId]);
      setReviewingId(null);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) return <p className="text-black dark:text-white p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-white dark:bg-black p-6">
      <h1 className="text-xl font-semibold text-black dark:text-white mb-4">My Requests</h1>

      {message && (
        <p className={`text-sm mb-3 font-medium ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}

      {requests.length === 0 ? (
        <p className="text-black dark:text-white text-sm">You haven't submitted any requests yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {requests.map((req) => (
            <div key={req._id} className="border border-black dark:border-white rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <p className="font-medium text-black dark:text-white text-sm">
                  {req.service?.title}
                </p>
                <span className="text-xs border border-black dark:border-white rounded px-2 py-0.5 text-black dark:text-white">
                  {req.status}
                </span>
              </div>
              <p className="text-xs text-black dark:text-white mb-1">
                Provider: {req.provider?.name}
              </p>
              <p className="text-xs text-black dark:text-white mb-1">
                Budget: NPR {req.budget}
              </p>
              <p className="text-xs text-black dark:text-white mb-1">
                Deadline: {new Date(req.deadline).toLocaleDateString()}
              </p>
              <p className="text-xs text-black dark:text-white mb-2">
                Requirements: {req.requirements}
              </p>

              {req.status === 'Delivered' && !reviewedIds.includes(req._id) && (
                <>
                  {reviewingId === req._id ? (
                    <div className="border-t border-black dark:border-white pt-3 mt-2">
                      <label className="text-xs text-black dark:text-white block mb-1">Rating</label>
                      <select
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="border border-black dark:border-white rounded px-2 py-1 mb-2 text-black dark:text-white bg-white dark:bg-black text-sm"
                      >
                        <option value={5}>5 - Excellent</option>
                        <option value={4}>4 - Good</option>
                        <option value={3}>3 - Average</option>
                        <option value={2}>2 - Poor</option>
                        <option value={1}>1 - Very Poor</option>
                      </select>

                      <label className="text-xs text-black dark:text-white block mb-1">Feedback</label>
                      <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="w-full border border-black dark:border-white rounded px-2 py-1 mb-2 text-black dark:text-white dark:bg-black text-sm"
                        rows="2"
                      />

                      <div className="flex gap-2">
                        <button
                          onClick={() => submitReview(req._id)}
                          className="h-8 px-3 bg-black dark:bg-white text-white dark:text-black rounded text-xs"
                        >
                          Submit Review
                        </button>
                        <button
                          onClick={cancelReview}
                          className="h-8 px-3 border border-black dark:border-white rounded text-xs text-black dark:text-white"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => startReview(req._id)}
                      className="text-xs border border-black dark:border-white rounded px-3 py-1 text-black dark:text-white mt-1"
                    >
                      Leave a review
                    </button>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyRequests;