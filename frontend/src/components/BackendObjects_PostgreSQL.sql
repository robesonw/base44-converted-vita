-- PostgreSQL Schema for the application

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    full_name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user'
);

CREATE TABLE feedback (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new'
);

CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    created_by INTEGER REFERENCES users(id),
    name VARCHAR(255),
    instructions TEXT,
    status VARCHAR(50) DEFAULT 'pending'
);

-- Additional tables as required...