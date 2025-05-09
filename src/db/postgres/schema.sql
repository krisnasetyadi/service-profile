CREATE DATABASE personal_profile;

CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    roles VARCHAR(50)[] NOT NULL,
    stacks VARCHAR(50)[] NOT NULL, 
    others VARCHAR(50)[],
    links VARCHAR(255)[],
    description TEXT,
    is_confidential VARCHAR(1),
    image_urls VARCHAR(255)[],
    video_urls VARCHAR(255)[],
    cover_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE cvfiles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    is_default VARCHAR(1) NOT NULL,
    type VARCHAR(50),
    updated_at TIMESTAMP  DEFAULT CURRENT_TIMESTAMP,
    content BYTEA NOT NULL
);

CREATE TABLE todos (
    id SERIAL PRIMARY KEY,               
    title VARCHAR(255) NOT NULL,         
    description TEXT,                    
    is_completed BOOLEAN DEFAULT FALSE,  
    created_at TIMESTAMP DEFAULT NOW(),  
    updated_at TIMESTAMP DEFAULT NOW()  
);
