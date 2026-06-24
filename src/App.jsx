import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "@fontsource/inter";
import "./App.css";
import list from "./data";

// Helper: items with id 1-4 are subscription plans (see data.js)
const isSubscription = (item) => item && item.id >= 1 && item.id <= 4;

function StreamList() {
  const [movieInput, setMovieInput] = useState("");
  const [movies, setMovies] = useState(() => {
    const savedMovies = localStorage.getItem("streamListMovies");
    return savedMovies ? JSON.parse(savedMovies) : [];
  });
  const [editingId, setEditingId] = useState(null);
  const [editInput, setEditInput] = useState("");

  useEffect(() => {
    localStorage.setItem("streamListMovies", JSON.stringify(movies));
  }, [movies]);

  const addMovie = (event) => {
    event.preventDefault();
    if (movieInput.trim() === "") return;

    const newMovie = {
      id: crypto.randomUUID(),
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

  const cancelEdit = () => {
    setEditingId(null);
    setEditInput("");
  };

  const saveEdit = (id) => {
    if (editInput.trim() === "") return;

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
                  <button onClick={cancelEdit}>Cancel</button>
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

function MovieSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchMovies = async (event) => {
    event.preventDefault();
    if (searchTerm.trim() === "") return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${import.meta.env.VITE_TMDB_API_KEY
        }&query=${encodeURIComponent(searchTerm)}`
      );

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      setResults(data.results || []);
      setSearchTerm("");
    } catch (err) {
      console.error("Movie search failed:", err);
      setError("Sorry, we couldn't complete your search. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page wide-page">
      <h1>Movie Search</h1>
      <p>Search movie information using the TMDB API.</p>

      <form onSubmit={searchMovies} className="stream-form">
        <input
          type="text"
          placeholder="Search for a movie"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <p className="warning-message">{error}</p>}

      <div className="results-grid">
        {results.map((movie) => (
          <div key={movie.id} className="result-card">
            {movie.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
              />
            )}
            <h3>{movie.title}</h3>
            <p>Release Date: {movie.release_date || "N/A"}</p>
            <p>Rating: {movie.vote_average}</p>
            <p>{movie.overview}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Shop({ addToCart, warning }) {
  return (
    <div className="page wide-page">
      <h1>Shop</h1>
      <p>Browse subscription plans and official EZTech merchandise.</p>

      {warning && <p className="warning-message">{warning}</p>}

      <div className="product-grid">
        {list.map((item) => (
          <div key={item.id} className="product-card">
            {item.img && <img src={item.img} alt={item.service} />}
            <h3>{item.service}</h3>
            <p>{item.serviceInfo}</p>
            <p className="price">${item.price.toFixed(2)}</p>
            <button onClick={() => addToCart(item)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Cart({ cart, increaseQuantity, decreaseQuantity, removeFromCart }) {
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.amount,
    0
  );

  return (
    <div className="page wide-page">
      <h1>Cart</h1>
      <p>Review and manage your selected items.</p>

      {cart.length === 0 ? (
        <p className="empty-message">Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-list">
            {cart.map((item) => (
              <div key={item.id} className="cart-card">
                {item.img && <img src={item.img} alt={item.service} />}

                <div className="cart-details">
                  <h3>{item.service}</h3>
                  <p>{item.serviceInfo}</p>
                  <p>${item.price.toFixed(2)}</p>
                </div>

                {isSubscription(item) ? (
                  <span className="quantity-readonly">Qty: {item.amount}</span>
                ) : (
                  <div className="quantity-controls">
                    <button onClick={() => decreaseQuantity(item.id)}>-</button>
                    <span>{item.amount}</span>
                    <button onClick={() => increaseQuantity(item.id)}>+</button>
                  </div>
                )}

                <button onClick={() => removeFromCart(item.id)}>Remove</button>
              </div>
            ))}
          </div>

          <h2 className="cart-total">Total: ${totalPrice.toFixed(2)}</h2>
        </>
      )}
    </div>
  );
}

function About() {
  return (
    <div className="page">
      <h1>About</h1>
      <p>
        StreamList helps users search movies, manage watchlists, shop
        subscription plans, and subscribe to EZTechMovie services.
      </p>
    </div>
  );
}

function App() {
  const [warning, setWarning] = useState("");

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("streamListCart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("streamListCart", JSON.stringify(cart));
  }, [cart]);

  const cartCount = cart.reduce((total, item) => total + item.amount, 0);

  const addToCart = (product) => {
    const isSubscription = product.id >= 1 && product.id <= 4;
    const cartHasSubscription = cart.some(
      (item) => item.id >= 1 && item.id <= 4
    );
    const existingItem = cart.find((item) => item.id === product.id);

    if (isSubscription && cartHasSubscription) {
      setWarning("Only one subscription can be added to the cart at a time.");
      return;
    }

    setWarning("");

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, amount: item.amount + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, amount: 1 }]);
    }
  };

  const increaseQuantity = (id) => {
    const itemToUpdate = cart.find((item) => item.id === id);
    const isSubscription = itemToUpdate && itemToUpdate.id >= 1 && itemToUpdate.id <= 4;

    if (isSubscription) {
      setWarning("Subscription quantity cannot be increased.");
      return;
    }

    setWarning("");

    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, amount: item.amount + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setWarning("");

    setCart(
      cart
        .map((item) =>
          item.id === id ? { ...item, amount: item.amount - 1 } : item
        )
        .filter((item) => item.amount > 0)
    );
  };

  const removeFromCart = (id) => {
    setWarning("");
    setCart(cart.filter((item) => item.id !== id));
  };

  return (
    <BrowserRouter>
      <nav className="navbar">
        <h2>EZTechMovie</h2>

        <div className="nav-links">
          <Link to="/">StreamList</Link>
          <Link to="/movies">Movie Search</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/cart">Cart ({cartCount})</Link>
          <Link to="/about">About</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<StreamList />} />
        <Route path="/movies" element={<MovieSearch />} />
        <Route
          path="/shop"
          element={<Shop addToCart={addToCart} warning={warning} />}
        />
        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              increaseQuantity={increaseQuantity}
              decreaseQuantity={decreaseQuantity}
              removeFromCart={removeFromCart}
            />
          }
        />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;