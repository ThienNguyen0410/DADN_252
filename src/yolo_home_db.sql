CREATE DATABASE yolo_home_db;
USE yolo_home_db;

CREATE TABLE users (
	ID INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    Pass_word VARCHAR(50) 
);

INSERT INTO users(username, Pass_word) VALUES 
	('user1', '123456');

CREATE TABLE members (
    member_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    face_id INT UNIQUE -- Đây là ID mà ESP32-CAM trả về (ví dụ: 1, 2, 3...)
);

CREATE TABLE access_history (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    member_name VARCHAR(100),
    image_url VARCHAR(255),
    recognition_type VARCHAR(50), -- 'Acquaintance' hoặc 'Stranger'
    access_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Thêm dữ liệu mẫu để test
INSERT INTO members (full_name, face_id) VALUES ('Dat Phan', 1), ('Younger Sister', 2);