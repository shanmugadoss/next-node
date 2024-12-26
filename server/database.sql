CREATE DATABASE next_node;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    token TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, email, token)
VALUES ('shanmugadoss', 'shanmugadoss@testmail.com', 'ertrkjkdxsfg23423ewedas');