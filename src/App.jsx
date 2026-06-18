import { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "@fontsource/inter";
import "./App.css";

function StreamList() {
  const [movieInput, setMovieInput] = useState("");
  const [movies, setMovies] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editInput, setEditInput] = useState("");

  const addMovie = (event) => {
    event.preventDefault();

    if (movieInput.trim() === "") return;

    const newMovie = {
      id: Date.now(),
      title: movieInput,
      completed: false,
    };

    setMovies([...movies, newMovie]);
    setMovieInput("");
  };

  const deleteMovie = (id) => {
    setMovies(movies.filter((movie) => movie.id !== id));
  };

  const completeMovie = (id) => {
    setMovies(
      movies.map((movie) =>
        movie.id === id ? { ...movie, completed: !movie.completed } : movie
      )
    );
  };

  const startEdit = (movie) => {
    setEditingId(movie.id);
    setEditInput(movie.title);
  };

  const saveEdit = (id) => {
    setMovies(
      movies.map((movie) =>
        movie.id === id ? { ...movie, title: editInput } : movie
      )
    );

    setEditingId(null);
    setEditInput("");
  };

  return (
    <div className="page">
      <h1>🎬 StreamList</h1>
      <p>Create your personal streaming watchlist.</p>

      <form onSubmit={addMovie} className="stream-form">
        <input
          type="text"
          placeholder="Enter a movie or show"
          value={movieInput}
          onChange={(event) => setMovieInput(event.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <div className="movie-list">
        {movies.length === 0 ? (
          <p className="empty-message">No movies added yet.</p>
        ) : (
          movies.map((movie) => (
            <div key={movie.id} className="movie-card">
              {editingId === movie.id ? (
                <>
                  <input
                    className="edit-input"
                    value={editInput}
                    onChange={(event) => setEditInput(event.target.value)}
                  />
                  <button onClick={() => saveEdit(movie.id)}>Save</button>
                </>
              ) : (
                <>
                  <span className={movie.completed ? "completed" : ""}>
                    {movie.title}
                  </span>

                  <div className="button-group">
                    <button onClick={() => completeMovie(movie.id)}>
                      {movie.completed ? "Undo" : "Complete"}
                    </button>
                    <button onClick={() => startEdit(movie)}>Edit</button>
                    <button onClick={() => deleteMovie(movie.id)}>Delete</button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function Movies() {
  return (
    <div className="page">
      <h1>Movies</h1>
      <p>Movie browsing features will be added in a future week.</p>
    </div>
  );
}

function Cart() {
  return (
    <div className="page">
      <h1>Cart</h1>
      <p>Shopping cart features will be added in a future week.</p>
    </div>
  );
}

function About() {
  return (
    <div className="page">
      <h1>About</h1>
      <p>StreamList helps users organize movies and shows they want to watch.</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <h2>EZTechMovie</h2>

        <div className="nav-links">
          <Link to="/">StreamList</Link>
          <Link to="/movies">Movies</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/about">About</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<StreamList />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;