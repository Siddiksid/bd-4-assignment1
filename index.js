const express = require('express');
const sqlite3 = require('sqlite3').verbose();
let { open } = require('sqlite');
const { resolve } = require('path');

const app = express();
const port = 3000;
let db;
(async () => {
  db = await open({ filename: './database.sqlite', driver: sqlite3.Database });
  if (db) console.log('Connected to the sqlite3 database');
})();

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

async function fetchAllRestaurants() {
  let query = 'SELECT * FROM restaurants';
  let response = await db.all(query, []);
  return { restaurants: response };
}

app.get('/restaurants', async (req, res) => {
  try {
    let results = await fetchAllRestaurants();
    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: 'No restaurants found' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function fetchRestaurantById(id) {
  let query = 'SELECT * FROM restaurants WHERE id = ?';
  let response = await db.get(query, [id]);

  return { restaurant: response };
}

app.get('/restaurants/details/:id', async (req, res) => {
  let id = req.params.id;
  try {
    let results = await fetchRestaurantById(id);
    if (results === undefined) {
      return res.status(404).json({ message: 'No restaurants found' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function fetchRestaurantByCuisine(cuisine) {
  let query = 'SELECT * FROM restaurants WHERE cuisine = ?';
  let response = await db.all(query, [cuisine]);

  return { restaurants: response };
}

app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  let cuisine = req.params.cuisine;
  try {
    let results = await fetchRestaurantByCuisine(cuisine);

    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: 'No restaurants found' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function fetchRestaurantsByFilter(isVeg, hasOutdoorSeating, isLuxury) {
  let query =
    'SELECT * FROM restaurants WHERE isVeg = ? AND hasOutdoorSeating = ? AND isLuxury = ?';
  let response = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);
  return { restaurants: response };
}

app.get('/restaurants/filter', async (req, res) => {
  let isVeg = req.query.isVeg;
  let hasOutdoorSeating = req.query.hasOutdoorSeating;
  let isLuxury = req.query.isLuxury;
  try {
    let results = await fetchRestaurantsByFilter(
      isVeg,
      hasOutdoorSeating,
      isLuxury
    );

    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: 'No restaurants found' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function fetchRestaurantsSorted() {
  let query = 'SELECT * FROM restaurants ORDER BY rating DESC';
  let response = await db.all(query, []);

  return { restaurants: response };
}
app.get('/restaurants/sort-by-rating', async (req, res) => {
  try {
    let results = await fetchRestaurantsSorted();

    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: 'No restaurants found' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function fetchAllDishes() {
  let query = 'SELECT * FROM dishes';
  let response = await db.all(query, []);
  return { dishes: response };
}

app.get('/dishes', async (req, res) => {
  try {
    let results = await fetchAllDishes();
    if (results.dishes.length === 0) {
      return res.status(404).json({ message: 'No dishes found' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function fetchDishById(id) {
  let query = 'SELECT * FROM dishes WHERE id = ?';
  let response = await db.get(query, [id]);

  return { dish: response };
}

app.get('/dishes/details/:id', async (req, res) => {
  let id = req.params.id;
  try {
    let results = await fetchDishById(id);
    if (results === undefined) {
      return res.status(404).json({ message: 'No Dishes found' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function fetchDishesByFilter(isVeg) {
  let query = 'SELECT * FROM dishes WHERE isVeg = ? ';
  let response = await db.all(query, [isVeg]);
  return { dishes: response };
}

app.get('/dishes/filter', async (req, res) => {
  let isVeg = req.query.isVeg;

  try {
    let results = await fetchDishesByFilter(isVeg);

    if (results.dishes.length === 0) {
      return res.status(404).json({ message: 'No dishes found' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function fetchDishesSorted() {
  let query = 'SELECT * FROM dishes ORDER BY price';
  let response = await db.all(query, []);

  return { dishes: response };
}
app.get('/dishes/sort-by-price', async (req, res) => {
  try {
    let results = await fetchDishesSorted();

    if (results.dishes.length === 0) {
      return res.status(404).json({ message: 'No dishes found' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
