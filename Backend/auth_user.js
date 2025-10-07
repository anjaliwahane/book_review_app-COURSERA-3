const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    //returns boolean
    //write code to check is the username is valid
    const usersWithSameName = users.filter((user) => {
        return user.username === username;
    });
    return usersWithSameName.length === 0;
};

const authenticatedUser = (username, password) => {
    //returns boolean
    //write code to check if username and password match the one we have in records.
    let validUsers = users.filter((user) => {
        return user.username === username && user.password === password;
    });
    if (validUsers.length > 0) {
        return true;
    }
    return false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
    //Write your code here
    let { username, password } = req.body;
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign(
            {
                data: password,
            },
            "access",
            { expiresIn: 60 * 60 }
        );
        req.session.authorization = {
            accessToken: accessToken,
            username: username,
        };
        console.log("accessToken", accessToken, "username", username);
        res.status(200).send("User sucessfully logged in");
    } else {
        res
            .status(208)
            .json({ message: "Invalid Login. Check username and password" });
    }
    // return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    let isbn = req.params.isbn;
    let review = req.body.review;
    const username = req.session.authorization.username;
    if (books[isbn]) {
        const reviews = books[isbn].reviews;
        const existingReview = reviews[username];
        reviews[username] = review;
        if (existingReview) {
            return res.status(200).send("Review successfully updated");
        }
        return res.status(200).send("Review successfully added");
    }
    return res.status(404).json({ message: "Provided book does not exist" });
    // return res.status(300).json({message: "Yet to be implemented"});
});

// Remove a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    let isbn = req.params.isbn;
    const username = req.session.authorization.username;
    if (books[isbn]) {
        const reviews = books[isbn].reviews;
        const existingReview = reviews[username];
        if (existingReview) {
            delete books[isbn].reviews[username];
        }
        return res
            .status(200)
            .send(
                `Review from User, ${username} removed successfully from Book (ISBN: ${isbn}).`
            );
    }
    return res.status(404).json({ message: "Provided book does not exist" });
    // return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;