import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios'

function App() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const getPosts = async () => {
      try {
        const { data } = await axios.get('/api/posts')
        setPosts(data)
      } catch (e) {
        console.log(e)
      }
    }
    getPosts()
  }, [])
  return (
    <div className="App">
      <header className="App-header">
        {posts.map(p =>
          <div class='post' key={p.id}>
            <h3>{p.title}</h3>
            <p>{p.contents}</p>
          </div>)}
      </header>
    </div>
  );
}

export default App;
