import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useParams, useNavigate, Link } from "react-router-dom";
import { userContext } from "../App"; // Assuming `userContext` is defined in `App`
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Post = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null); // Initialize as null
  const [error, setError] = useState(null); // State to manage errors
  const navigate = useNavigate();
  const user = useContext(userContext); // Corrected useContext usage

  useEffect(() => {
    // Redirect to login if user is not logged in
    if (!user) {
      navigate("/login");
      return;
    }

    // Fetch post data
    axios
      .get(`http://localhost:3001/getpostbyid/${id}`)
      .then((result) => {
        console.log("Fetched post:", result.data); // Log fetched post data
        setPost(result.data);
      })
      .catch((err) => {
        console.log(err);
        setError("Failed to fetch post.");
      });
  }, [id, user, navigate]);

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3001/deletepost/${id}`)
      .then(() => {
        toast.success("Post deleted successfully!");

        // Delay navigation slightly to allow toast to show
        setTimeout(() => {
          navigate("/"); // Navigate to the home page after deletion
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to delete the post.");
      });
  };

  const userEmail = user?.user?.email; // Get logged-in user's email

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        {error && <p className="text-red-500">{error}</p>}{" "}
        {/* Display error message if any */}
        {post ? (
          <div>
            <img
              className="w-full h-64 object-cover rounded-md mb-4"
              src={`http://localhost:3001/Public/Images/${post.file}`}
              alt={post.title}
            />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {post.title}
            </h2>
            <p className="text-gray-600 mb-4">{post.description}</p>

            {/* Check if `user` exists and matches the post's email before showing Edit/Delete */}
            {userEmail === post.email ? (
              <div className="space-x-4">
                <button
                  onClick={() =>
                    (window.location.href = `/editpost/${post._id}`) // Redirect to the edit page
                  }
                  className="bg-gray-800 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(post._id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  <FaTrashAlt />
                </button>
              </div>
            ) : (
              <p className="text-gray-500">
                You do not have permission to edit or delete this post.
              </p>
            )}
          </div>
        ) : (
          <p className="text-white">Loading...</p> // Show loading message until the post data is available
        )}
      </div>
      <ToastContainer /> {/* Toast container for notifications */}
    </div>
  );
};

export default Post;
