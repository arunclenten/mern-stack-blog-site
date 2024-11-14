import { useEffect, useState, createContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Register from './Components/register';
import Navbar from './Components/navbar';
import Login from './Components/Login';
import { Home } from './Components/Home';
import axios from 'axios';
import Create from './Components/Create';
import Contact from './Components/Contact';
import Post from './Components/Post';
import Editpost from './Components/Editpost';
import Author from './Components/Author';
import ContactTable from './Components/ContactTable';

export const userContext = createContext();

function App() {
  const [user, setUser] = useState({});
  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get('http://localhost:3001/')
      .then(response => {
        setUser(response.data);  // Corrected response handling
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <userContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<Home />} />
          <Route path='/create' element={<Create />} />
          <Route path='/post/:id' element={<Post />} />
          <Route path='/editpost/:id' element={<Editpost />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/user' element={<ContactTable />} />
          <Route path='/author/:authorId' element={<Author />} />
        </Routes>
      </BrowserRouter>
    </userContext.Provider>
  );
}

export default App;
