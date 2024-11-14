import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // If using React Router for dynamic routing

const SingleAuthorPage = () => {
  const [authorData, setAuthorData] = useState({
    postCount: 0,
    todayPostCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get the author's ID from the route parameters (if needed)
  const { authorId } = useParams(); // If you have dynamic authorId in your route

  useEffect(() => {
    // Get the JWT token from localStorage (or other storage)
    const token = localStorage.getItem("token");

    // Make a fetch request to get the author's data
    fetch("http://localhost:3001/get-author-data", {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // Pass the JWT token in the Authorization header
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      return response.json();
    })
    .then(data => {
      setAuthorData(data); // Set the fetched data
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching author data:', error);
      setError("Error fetching author data");
      setLoading(false);
    });
  }, [authorId]); // Dependency array, can include authorId if needed

  // Loading state
  if (loading) {
    return <p>Loading...</p>;
  }

  // Error state
  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  // Render the author's data on the page
  return (
    <div className="container mx-auto pt-20">
      <h1 className="text-3xl font-bold mb-4">Author Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Posts */}
        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          <p className="text-xl font-bold text-gray-700">Total Posts</p>
          <p className="text-3xl font-semibold text-blue-500">{authorData.postCount}</p>
        </div>

        {/* Posts Today */}
        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          <p className="text-xl font-bold text-gray-700">Posts Today</p>
          <p className="text-3xl font-semibold text-green-500">{authorData.todayPostCount}</p>
        </div>

        {/* You can add more information here, like total likes, followers, etc. */}
      </div>
    </div>
  );
};

export default SingleAuthorPage;
