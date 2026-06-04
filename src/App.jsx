import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";

function StreamList() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const movie = event.target.movie.value;
    console.log("StreamList item:", movie);
    event.target.reset();
  };

  return (
    <div className="page">
      <h1>StreamList</h1>
      <p>Create your personal streaming watchlist and keep track of
movies and shows you want to watch.</p>

      <form onSubmit={handleSubmit} className="stream-form">
        <input
          type="text"
          name="movie"
          placeholder="Enter movie or show"
          required
        />
        <button type="submit">Add to Console</button>
      </form>
    </div>
  );
}

function Movies() {
  return (
    <div className="page">
      <h1>Movies</h1>
      <p>Movie browsing features coming in Week 4.</p>
    </div>
  );
}

function Cart() {
  return (
    <div className="page">
      <h1>Cart</h1>
      <p>Movie browsing features coming in Week 4.</p>
    </div>
  );
}

function About() {
  return (
    <div className="page">
      <h1>About</h1>
      <p>Movie browsing features coming in Week 5.</p>
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