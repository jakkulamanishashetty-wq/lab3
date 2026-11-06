# BDF Lab 3 – REST API, Query Parameters, Validation and Debugging

## Project Description
This project demonstrates REST API development using Node.js, Express.js and SQLite. It performs CRUD operations on a books database and supports query parameters for sorting, pagination and price filtering.

## Technologies Used
- Node.js
- Express.js
- SQLite
- SQLite3
- Nodemon
- Postman
- Visual Studio Code

## Features
1. GET – Retrieve all books.
2. POST – Add a new book.
3. PUT – Update existing book details.
4. DELETE – Remove a book.
5. Sorting – Sort books by price in ascending or descending order.
6. Pagination – Retrieve books page by page.
7. Price Filtering – Filter books using minimum and maximum prices.
8. Validation – Check invalid or missing input values.
9. Debugging – Identify and fix API errors.

## Installation

Install the dependencies:

```bash
npm install
```

## Run the Project

```bash
npm run dev
```

The server runs locally at:

```text
http://localhost:3000
```

## API Testing

All APIs were tested using Postman.

Example endpoints:

| Method | Endpoint | Operation |
|---|---|---|
| GET | `/books` | Retrieve books |
| POST | `/books` | Add a book |
| PUT | `/books/:id` | Update a book |
| DELETE | `/books/:id` | Delete a book |

### Query Parameters

Sorting:
```text
/books?sort=price&order=asc
```

Pagination:
```text
/books?page=1&limit=2
```

Price filtering:
```text
/books?minPrice=300&maxPrice=400
```

## Conclusion

This project helped me understand REST API development, CRUD operations, query parameters, input validation and debugging. I also learned how to test APIs using Postman and connect Express.js with an SQLite database.