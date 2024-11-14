import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Editpost = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate inputs
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!description.trim()) {
      toast.error('Description is required');
      return;
    }

    axios.put(`http://localhost:3001/editpost/${id}`, { title, description })
      .then(res => {
        if (res.data === "success") {
          toast.success('Post updated successfully!');
          setTimeout(() => {
            navigate('/'); // Redirect after success
          }, 1500);
        } else {
          toast.error('Failed to update post');
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error('An error occurred while updating the post');
      });
  };

  useEffect(() => {
    // Fetch post data
    axios.get(`http://localhost:3001/getpostbyid/${id}`)
      .then(result => {
        setTitle(result.data.title);
        setDescription(result.data.description);
      })
      .catch(err => {
        console.log(err);
        toast.error('Failed to fetch post');
      });
  }, [id]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">Title</label>
          <input
            type="text"
            placeholder="Enter Title"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="desc">Description</label>
          <textarea
            name="desc"
            id="desc"
            cols="30"
            rows="4"
            placeholder="Enter Description"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            value={description}
            onChange={e => setDescription(e.target.value)}
          ></textarea>
        </div>
        
        <button type="submit" className="bg-gray-800 text-white p-2 w-full rounded-md hover:bg-gray-800">Update Post</button>
      </form>
    </div>
  );
};

export default Editpost;
