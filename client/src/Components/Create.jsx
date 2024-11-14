import React, { useState, useContext } from 'react';
import { userContext } from '../App';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Create = () => {
  const { user } = useContext(userContext); // Access the user from context
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

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
    if (!file) {
      toast.error('File upload is required');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('email', user.email);  // Use the email from context
    formData.append('file', file);

    axios.post("http://localhost:3001/create", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
    .then(res => {
      if (res.data === "success") {
        toast.success('Post created successfully!');
        setTimeout(() => {
          window.location.href = "/";  // Redirect after success
        }, 1500);
      } else {
        toast.error('Failed to create post');
      }
    })
    .catch((err) => {
      console.log(err);
      toast.error('An error occurred while creating the post');
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">Title</label>
          <input
            type="text"
            placeholder="Enter Title"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-800"
            onChange={e => setTitle(e.target.value)}
            value={title}
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
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-800"
            onChange={e => setDescription(e.target.value)}
            value={description}
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file">Upload File</label>
          <input
            type="file"
            name="file"
            id="file"
            className="w-full p-2 border border-gray-300 rounded-md"
            onChange={e => setFile(e.target.files[0])}
          />
        </div>

        <button type="submit" className="bg-gray-800 text-white p-2 w-full rounded-md hover:bg-gray-800">Post</button>
      </form>
    </div>
  );
};

export default Create;
