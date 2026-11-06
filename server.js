
const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let db;

// Connect to database and create table
async function connectDB() {
  db = await open({
    filename: "./books.db",
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS book (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      price REAL NOT NULL
    )
  `);

  console.log("Database connected successfully");
}

// GET all books with search, sorting and filtering
app.get("/books", async (req, res) => {
  try {
    const {
      search_q = "",
      order_by = "id",
      order = "ASC",
      limit = "10",
      offset = "0",
      min_price,
      max_price
    } = req.query;

    const allowedColumns = ["id", "title", "author", "price"];

    if (!allowedColumns.includes(order_by)) {
      return res.status(400).json({
        message: "Invalid order_by value"
      });
    }

    const sortOrder = order.toUpperCase();

    if (!["ASC", "DESC"].includes(sortOrder)) {
      return res.status(400).json({
        message: "Order must be ASC or DESC"
      });
    }

    const pageLimit = Number(limit);
    const pageOffset = Number(offset);

    if (
      !Number.isInteger(pageLimit) ||
      pageLimit < 1 ||
      !Number.isInteger(pageOffset) ||
      pageOffset < 0
    ) {
      return res.status(400).json({
        message: "Limit and offset must be valid numbers"
      });
    }

    let query = "SELECT * FROM book WHERE title LIKE ?";
    const params = [`%${search_q}%`];

    if (min_price !== undefined) {
      const min = Number(min_price);

      if (!Number.isFinite(min)) {
        return res.status(400).json({
          message: "min_price must be a number"
        });
      }

      query += " AND price >= ?";
      params.push(min);
    }

    if (max_price !== undefined) {
      const max = Number(max_price);

      if (!Number.isFinite(max)) {
        return res.status(400).json({
          message: "max_price must be a number"
        });
      }

      query += " AND price <= ?";
      params.push(max);
    }

    query += ` ORDER BY ${order_by} ${sortOrder} LIMIT ? OFFSET ?`;
    params.push(pageLimit, pageOffset);

    const books = await db.all(query, params);

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve books"
    });
  }
});

// GET a single book by ID
app.get("/books/:id", async (req, res) => {
  try {
    const book = await db.get(
      "SELECT * FROM book WHERE id = ?",
      [req.params.id]
    );

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve book"
    });
  }
});

// POST a new book
app.post("/books", async (req, res) => {
  try {
    const { title, author, price } = req.body;

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof author !== "string" ||
      !author.trim() ||
      price === undefined ||
      price === null ||
      typeof price !== "number" ||
      !Number.isFinite(price)
    ) {
      return res.status(400).json({
        message: "Title, author and numeric price are required"
      });
    }

    const result = await db.run(
      "INSERT INTO book (title, author, price) VALUES (?, ?, ?)",
      [title.trim(), author.trim(), price]
    );

    res.status(201).json({
      message: "Book added successfully",
      bookId: result.lastID
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add book"
    });
  }
});

// PUT update a book
app.put("/books/:id", async (req, res) => {
  try {
    const { title, author, price } = req.body;

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof author !== "string" ||
      !author.trim() ||
      typeof price !== "number" ||
      !Number.isFinite(price)
    ) {
      return res.status(400).json({
        message: "Title, author and numeric price are required"
      });
    }

    const result = await db.run(
      "UPDATE book SET title = ?, author = ?, price = ? WHERE id = ?",
      [title.trim(), author.trim(), price, req.params.id]
    );

    if (result.changes === 0) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    res.status(200).json({
      message: "Book updated successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update book"
    });
  }
});

// DELETE a book
app.delete("/books/:id", async (req, res) => {
  try {
    const result = await db.run(
      "DELETE FROM book WHERE id = ?",
      [req.params.id]
    );

    if (result.changes === 0) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    res.status(200).json({
      message: "Book deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete book"
    });
  }
});

// Start server after connecting database
// Start server after connecting database
async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Server startup failed:", error.message);
  }
}

startServer();
