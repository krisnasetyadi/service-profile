CREATE DATABASE personal_profile;

CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    project_name VARCHAR(255) NOT NULL,
    roles VARCHAR(50)[] NOT NULL,
    stacks VARCHAR(50)[] NOT NULL, 
    other_stacks VARCHAR(50)[],
    links VARCHAR(255)[],
    project_description VARCHAR(255),
    is_confidential VARCHAR(1),
    image_urls VARCHAR(255)[],
    video_urls VARCHAR(255)[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);