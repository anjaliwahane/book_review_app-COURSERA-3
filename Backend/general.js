const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    //Write your code here
    let { username, password } = req.body;
    if (username && password) {
        if (isValid(username)) {
            users.push({ username: username, password: password });
            console.log("users is", users);
            return res
                .status(200)
                .send("User successfully registered. Now you can login");
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user" });
    // return res.status(300).json({message: "Yet to be implemented"});
});

// Task 10: Add the code for getting the list of books available in the shop (done in Task 1) using Promise callbacks or async-await with Axios.
function retrieveBooks() {
    return new Promise((resolve, reject) => {
        resolve(books);
    });
}

// Get the book list available in the shop
public_users.get("/", function (req, res) {
    //Write your code here
    retrieveBooks()
        .then((books) => {
            return res.status(200).send(JSON.stringify(books, null, 4));
        })
        .catch((err) => {
            return res
                .status(404)
                .send("An error has occured trying to retrieve all the books");
        });
    // return res.status(300).json({ message: "Yet to be implemented" });
});

// Task 11: Add the code for getting the book details based on ISBN (done in Task 2) using Promise callbacks or async-await with Axios.
function retrieveBookFromISBN(isbn) {
    let book = books[isbn];
    return new Promise((resolve, reject) => {
        if (book) {
            resolve(book);
        } else {
            reject(new Error("The provided book does not exist"));
        }
    });
}

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
    //Write your code here
    let isbn = req.params.isbn;
    retrieveBookFromISBN(isbn)
        .then((book) => {
            return res.status(200).send(JSON.stringify(book, null, 4));
        })
        .catch((error) => {
            res.status(404).send(error.message);
        });
    // return res.status(300).json({ message: "Yet to be implemented" });
});

// Task 12: Retrieve book details by author using Promise Callbacks or async-await using axios
function retrieveBookFromAuthor(author) {
    let validBooks = [];
    return new Promise((resolve, reject) => {
        for (let bookISBN in books) {
            const bookAuthor = books[bookISBN].author;
            if (bookAuthor.toLowerCase() === author.toLowerCase()) {
                validBooks.push(books[bookISBN]);
            }
        }
        if (validBooks.length > 0) {
            resolve(validBooks);
        } else {
            reject(new Error("The provided author does not exist"));
        }
    });
}

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
    let author = req.params.author;
    retrieveBookFromAuthor(author)
        .then((books) => {
            return res.status(200).send(JSON.stringify(books, null, 4));
        })
        .catch((error) => {
            res.status(404).send(error.message);
        });
    //Write your code here
    // return res.status(300).json({ message: "Yet to be implemented" });
});

// Task 13: Retrieve book details from title using Promise callbacks or async-await using axios
function retrieveBookFromTitle(title) {
    let validBooks = [];
    return new Promise((resolve, reject) => {
        for (let bookISBN in books) {
            const bookTitle = books[bookISBN].title;
            if (bookTitle.toLowerCase() === title.toLowerCase()) {
                validBooks.push(books[bookISBN]);
            }
        }
        if (validBooks.length > 0) {
            resolve(validBooks);
        } else {
            reject(new Error("The provided book title does not exist"));
        }
    });
}

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
    //Write your code here
    let title = req.params.title;
    retrieveBookFromTitle(title)
        .then((book) => {
            return res.status(200).send(JSON.stringify(book, null, 4));
        })
        .catch((error) => {
            res.status(404).send(error.message);
        });
    // return res.status(300).json({ message: "Yet to be implemented" });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    if (books[isbn] !== null) {
        res.send(JSON.stringify(books[isbn].reviews, null, 4));
    } else {
        return res.status(404).json({ message: "Provided book does not exist" });
    }
    // return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.general = public_users;