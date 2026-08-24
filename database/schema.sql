-- =====================================================
-- AGRI SERVICE CONNECT
-- Database Schema
-- =====================================================

CREATE DATABASE agri_service_connect;

USE agri_service_connect;

-- =====================================================
-- 1. FARMER
-- =====================================================

CREATE TABLE farmer (
    farmer_id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    contact VARCHAR(15) NOT NULL,
    email VARCHAR(150) UNIQUE,
    location VARCHAR(150) NOT NULL,
    PRIMARY KEY (farmer_id)
);

-- =====================================================
-- 2. LAND
-- =====================================================

CREATE TABLE land (
    land_id INT PRIMARY KEY AUTO_INCREMENT,
    farmer_id INT NOT NULL,
    area DECIMAL(10,2) NOT NULL,
    location VARCHAR(150) NOT NULL,
    irrigation_available BOOLEAN DEFAULT FALSE,

    FOREIGN KEY (farmer_id) REFERENCES farmer(farmer_id)
);

-- =====================================================
-- 3. CROP
-- =====================================================

CREATE TABLE crop (
    crop_id INT PRIMARY KEY AUTO_INCREMENT,
    land_id INT NOT NULL,
    crop_name VARCHAR(100) NOT NULL,
    season VARCHAR(50),
    start_date DATE,
    expected_harvest_date DATE,

    FOREIGN KEY (land_id) REFERENCES land(land_id)
);


-- =====================================================
-- 4. SERVICE
-- =====================================================

CREATE TABLE service (
    service_id INT PRIMARY KEY AUTO_INCREMENT,
    service_name VARCHAR(100) NOT NULL,
    category VARCHAR(100),
    description VARCHAR(255)
);


-- =====================================================
-- 5. WORKER
-- =====================================================

CREATE TABLE worker (
    worker_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    contact VARCHAR(15) NOT NULL,
    email VARCHAR(150) UNIQUE,
    location VARCHAR(150) NOT NULL,
    service_range DECIMAL(6,2),
    availability BOOLEAN DEFAULT TRUE
);


-- =====================================================
-- 6. WORKER_SERVICE
-- =====================================================

CREATE TABLE worker_service (
    worker_id INT NOT NULL,
    service_id INT NOT NULL,
    rate DECIMAL(10,2),
    experience INT,

    PRIMARY KEY (worker_id, service_id),

    FOREIGN KEY (worker_id) REFERENCES worker(worker_id),
    FOREIGN KEY (service_id) REFERENCES service(service_id)
);


-- =====================================================
-- 7. SERVICE_REQUEST
-- =====================================================

CREATE TABLE service_request (
    request_id INT PRIMARY KEY AUTO_INCREMENT,
    farmer_id INT NOT NULL,
    land_id INT NOT NULL,
    service_id INT NOT NULL,
    request_date DATE NOT NULL,
    required_date DATE NOT NULL,
    duration INT,
    description VARCHAR(255),
    status VARCHAR(30) DEFAULT 'Pending',

    FOREIGN KEY (farmer_id) REFERENCES farmer(farmer_id),
    FOREIGN KEY (land_id) REFERENCES land(land_id),
    FOREIGN KEY (service_id) REFERENCES service(service_id)
);


-- =====================================================
-- 8. BOOKING
-- =====================================================

CREATE TABLE booking (
    booking_id INT PRIMARY KEY AUTO_INCREMENT,
    request_id INT NOT NULL,
    worker_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(30) DEFAULT 'Booked',

    FOREIGN KEY (request_id) REFERENCES service_request(request_id),
    FOREIGN KEY (worker_id) REFERENCES worker(worker_id),

    UNIQUE (request_id)
);


-- =====================================================
-- 9. PAYMENT
-- =====================================================

CREATE TABLE payment (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATE,
    payment_method VARCHAR(30),
    payment_status VARCHAR(30) DEFAULT 'Pending',

    FOREIGN KEY (booking_id) REFERENCES booking(booking_id),

    UNIQUE (booking_id)
);


-- =====================================================
-- 10. REVIEW
-- =====================================================

CREATE TABLE review (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    rating INT NOT NULL,
    comment VARCHAR(255),
    review_date DATE,

    FOREIGN KEY (booking_id) REFERENCES booking(booking_id),

    UNIQUE (booking_id),

    CHECK (rating BETWEEN 1 AND 5)
);
