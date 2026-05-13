-- =========================================
-- CREATE DATABASE
-- =========================================
CREATE DATABASE yolo_home_db;
USE yolo_home_db;

-- =========================================
-- USERS
-- =========================================
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'member') DEFAULT 'member',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_image (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    relation VARCHAR(100),
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- =========================================
-- HOMES / ROOMS
-- =========================================
CREATE TABLE homes (
    home_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    home_name VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE rooms (
    room_id INT AUTO_INCREMENT PRIMARY KEY,
    home_id INT NOT NULL,
    room_name VARCHAR(100),
    FOREIGN KEY (home_id) REFERENCES homes(home_id) ON DELETE CASCADE
);

-- =========================================
-- DEVICES
-- =========================================
CREATE TABLE devices (
    device_id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT NOT NULL,
    device_name VARCHAR(100),
    device_type ENUM('sensor', 'camera'),
    status BOOLEAN DEFAULT FALSE,
    protocol VARCHAR(50), -- MQTT / Adafruit
    feed_key VARCHAR(100), -- 🔥 liên kết với Adafruit feed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE
);

-- =========================================
-- SENSOR DATA (dashboard realtime)
-- =========================================
CREATE TABLE sensor_data (
    data_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    device_id INT,
    temperature FLOAT,
    humidity FLOAT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES devices(device_id),
    INDEX idx_device_time (device_id, recorded_at) -- 🔥 tối ưu query
);

-- =========================================
-- EVENTS (CORE SYSTEM)
-- =========================================
CREATE TABLE events (
    event_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_type VARCHAR(50), -- temperature, fire, motion
    source_type ENUM('sensor', 'AI'),
    device_id INT,
    value FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES devices(device_id),
    INDEX idx_event_type (event_type),
    INDEX idx_created_at (created_at)
);

-- =========================================
-- RULES
-- =========================================
CREATE TABLE rules (
    rule_id INT AUTO_INCREMENT PRIMARY KEY,
    rule_name VARCHAR(100),
    event_type VARCHAR(50), -- temp high/night
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- RULE CONDITIONS (LINH HOẠT)
-- =========================================
CREATE TABLE rule_conditions (
    condition_id INT AUTO_INCREMENT PRIMARY KEY,
    rule_id INT,
    field VARCHAR(50), -- humidity / temperature
    operator ENUM('>', '<', '=', '>=', '<='),
    value FLOAT,
    FOREIGN KEY (rule_id) REFERENCES rules(rule_id) ON DELETE CASCADE
);

-- =========================================
-- RULE ACTIONS
-- =========================================
CREATE TABLE rule_actions (
    action_id INT AUTO_INCREMENT PRIMARY KEY,
    rule_id INT,
    action VARCHAR(50), -- TURN ON FAN/TURN ON LIGHT
    FOREIGN KEY (rule_id) REFERENCES rules(rule_id) ON DELETE CASCADE,
);

-- =========================================
-- COMMANDS (TRACK EXECUTION)
-- =========================================
CREATE TABLE commands (
    command_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    device_id INT,
    action VARCHAR(50),
    status ENUM('PENDING', 'SUCCESS', 'FAILED') DEFAULT 'PENDING',
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES devices(device_id),
    INDEX idx_status (status)
);

-- =========================================
-- LOGS (SYSTEM TRACKING)
-- =========================================
CREATE TABLE logs (
    log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actor VARCHAR(50),
    device_id INT,
    action VARCHAR(50),
    result VARCHAR(50),
    FOREIGN KEY (device_id) REFERENCES devices(device_id),
    INDEX idx_time (time)
);

-- =========================================
-- NOTIFICATIONS
-- =========================================
CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    message TEXT,
    status ENUM('sent', 'pending') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- =========================================
-- AI (FACE RECOGNITION)
-- =========================================
CREATE TABLE persons (
    person_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    type ENUM('known', 'unknown', 'undefined')
);

CREATE TABLE face_data (
    face_id INT AUTO_INCREMENT PRIMARY KEY,
    person_id INT,
    encoding TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (person_id) REFERENCES persons(person_id)
);