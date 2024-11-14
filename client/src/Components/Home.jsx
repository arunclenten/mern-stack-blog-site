import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Home = () => {
  const [posts, setPosts] = useState([]);
  const userEmail = localStorage.getItem("userEmail"); // Retrieve logged-in user's email
console.log(userEmail)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:3001/getposts");
        const allPosts = response.data;

        // If a user is logged in, filter posts by their email
        if (userEmail) {
          const userPosts = allPosts.filter((post) => post.email === userEmail);
          console.log(userEmail);
          
          setPosts(userPosts);
        } else {
          // Show all posts if no user is logged in
          setPosts(allPosts);
        }
      } catch (err) {
        console.error("Error fetching posts:", err); // Display more descriptive error message
      }
    };

    fetchPosts();
  }, [userEmail]); // Fetches posts whenever the 'userEmail' changes

  return (
    <div className="pt-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Link key={post._id} to={`/post/${post._id}`} className="block">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  className="w-full h-48 object-cover"
                  src={`http://localhost:3001/Public/Images/${post.file}`} 
                  alt={post.title} // Descriptive alt text for accessibility
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                  <p className="text-gray-600">{post.description}</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No posts available.</p>
        )}
      </div>
    </div>
  );
};
