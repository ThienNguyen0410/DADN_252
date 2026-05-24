
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
-- ====================================
-- DEVICES
-- =========================================

CREATE TABLE devices (
    device_id INT AUTO_INCREMENT PRIMARY KEY,
    device_name VARCHAR(100),
    device_type ENUM('sensor', 'camera', 'fan', 'light', 'door'),
    status BOOLEAN DEFAULT FALSE,
    protocol VARCHAR(50), -- MQTT / Adafruit
    feed_key VARCHAR(100), -- 🔥 liên kết với Adafruit feed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    INDEX idx_device_time (device_id, recorded_at)
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
    device_id INT,
    action VARCHAR(50), -- TURN ON FAN/TURN ON LIGHT
    FOREIGN KEY (rule_id) REFERENCES rules(rule_id) ON DELETE CASCADE,
    FOREIGN KEY (device_id) REFERENCES devices(device_id)
);


-- =========================================
-- NOTIFICATIONS
-- =========================================
CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    field ENUM('Temperature', 'Humidity'),
    value FLOAT,
    boundValue FLOAT,
    action VARCHAR(255),
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE face_data (
    face_id INT AUTO_INCREMENT PRIMARY KEY,
    img_url VARCHAR(255),
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
