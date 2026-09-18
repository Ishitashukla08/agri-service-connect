-- =====================================================
-- AGRI SERVICE CONNECT
-- Database Schema
-- =====================================================
DROP DATABASE IF EXISTS agri_service_connect;
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

-- =====================================================
-- SAMPLE DATA
-- =====================================================

INSERT INTO farmer (name, contact, email, location)
VALUES
('Anita Mishra', '9876543210', 'anita@example.com', 'Bihta'),
('Prem Chaudhary', '9876543211', 'prem@example.com', 'Patna'),
('Amit Saxena', '9876543212', 'amit@example.com', 'Kankarbagh'),
('Shobha Sinha', '9876543213', 'shobha@example.com', 'Danapur'),
('Sujeet Yadav', '9876543214', 'sujeet@example.com', 'Barh');

-- =====================================================
-- LAND SAMPLE DATA
-- =====================================================

INSERT INTO land (farmer_id, area, location, irrigation_available)
VALUES
(1, 2.50, 'Bihta', TRUE),
(1, 1.75, 'Patna', TRUE),
(2, 3.00, 'Patna', TRUE),
(3, 1.50, 'Kankarbagh', FALSE),
(4, 4.25, 'Danapur', TRUE),
(5, 2.00, 'Fatuha', FALSE);

-- =====================================================
-- CROP SAMPLE DATA
-- =====================================================

INSERT INTO crop
(land_id, crop_name, season, start_date, expected_harvest_date)
VALUES
(1, 'Rice', 'Kharif', '2026-06-15', '2026-10-15'),
(2, 'Vegetables', 'Kharif', '2026-07-01', '2026-09-30'),
(3, 'Wheat', 'Rabi', '2026-11-10', '2027-03-20'),
(4, 'Maize', 'Kharif', '2026-06-20', '2026-09-20'),
(5, 'Rice', 'Kharif', '2026-06-10', '2026-10-10'),
(6, 'Mustard', 'Rabi', '2026-11-15', '2027-03-15');

-- =====================================================
-- SERVICE SAMPLE DATA
-- =====================================================

INSERT INTO service (service_name, category, description)
VALUES
('Plantation Labour', 'Labour', 'Workers for planting crops and seedlings'),
('Harvesting', 'Labour', 'Workers for harvesting mature crops'),
('Tractor and Ploughing', 'Equipment', 'Tractor-based ploughing and field preparation'),
('Irrigation', 'Farm Support', 'Irrigation and water management services'),
('Soil Testing', 'Testing', 'Soil sample collection and testing services'),
('Pest Management', 'Farm Support', 'Pest and crop protection services'),
('Agricultural Consultation', 'Consultation', 'Basic agricultural guidance and consultation');

-- =====================================================
-- WORKER SAMPLE DATA
-- =====================================================

INSERT INTO worker
(name, contact, email, location, service_range, availability)
VALUES
('Rakesh Kumar', '9123456780', 'rakesh@example.com', 'Bihta', 25.00, TRUE),
('Manoj Yadav', '9123456781', 'manoj@example.com', 'Patna', 40.00, TRUE),
('Vikash Singh', '9123456782', 'vikash@example.com', 'Danapur', 30.00, TRUE),
('Rajiv Kumar', '9123456783', 'rajiv@example.com', 'Barh', 35.00, FALSE),
('Pankaj Sharma', '9123456784', 'pankaj@example.com', 'Fatuha', 20.00, TRUE),
('Sanjay Prasad', '9123456785', 'sanjay@example.com', 'Patna', 50.00, TRUE);

-- =====================================================
-- WORKER_SERVICE SAMPLE DATA
-- =====================================================

INSERT INTO worker_service
(worker_id, service_id, rate, experience)
VALUES
(1, 1, 500.00, 5),   -- Rakesh: Plantation Labour
(1, 2, 600.00, 5),   -- Rakesh: Harvesting

(2, 2, 650.00, 7),   -- Manoj: Harvesting
(2, 3, 1500.00, 8),  -- Manoj: Tractor and Ploughing

(3, 4, 700.00, 6),   -- Vikash: Irrigation
(3, 6, 800.00, 5),   -- Vikash: Pest Management

(4, 3, 1400.00, 10), -- Rajiv: Tractor and Ploughing

(5, 1, 450.00, 4),   -- Pankaj: Plantation Labour
(5, 4, 600.00, 4),   -- Pankaj: Irrigation

(6, 5, 900.00, 6),   -- Sanjay: Soil Testing
(6, 7, 1000.00, 6);  -- Sanjay: Agricultural Consultation

-- =====================================================
-- SERVICE_REQUEST SAMPLE DATA
-- =====================================================

INSERT INTO service_request
(farmer_id, land_id, service_id, request_date, required_date,
 duration, description, status)
VALUES
(1, 1, 1, '2026-08-20', '2026-09-01', 5,
 'Need workers for rice plantation', 'Pending'),

(1, 2, 4, '2026-08-21', '2026-08-28', 3,
 'Need irrigation support for vegetable field', 'Accepted'),

(2, 3, 3, '2026-08-18', '2026-11-05', 2,
 'Need tractor for field preparation', 'Accepted'),

(3, 4, 6, '2026-08-22', '2026-08-30', 2,
 'Need pest management for maize crop', 'Pending'),

(4, 5, 2, '2026-08-19', '2026-10-01', 6,
 'Need workers for rice harvesting', 'Completed'),

(5, 6, 1, '2026-08-23', '2026-11-20', 4,
 'Need labour for mustard plantation', 'Pending');
 
-- =====================================================
-- BOOKING SAMPLE DATA
-- =====================================================

INSERT INTO booking
(request_id, worker_id, start_date, end_date, amount, status)
VALUES
(2, 3, '2026-08-28', '2026-08-30', 2100.00, 'Completed'),
(3, 2, '2026-11-05', '2026-11-06', 3000.00, 'Booked'),
(5, 2, '2026-10-01', '2026-10-06', 3900.00, 'Completed');

-- =====================================================
-- PAYMENT SAMPLE DATA
-- =====================================================

INSERT INTO payment
(booking_id, amount, payment_date, payment_method, payment_status)
VALUES
(1, 2100.00, '2026-08-30', 'UPI', 'Paid'),
(2, 3000.00, NULL, 'UPI', 'Pending'),
(3, 3900.00, '2026-10-06', 'Cash', 'Paid');

-- =====================================================
-- REVIEW SAMPLE DATA
-- =====================================================

INSERT INTO review
(booking_id, rating, comment, review_date)
VALUES
(1, 5, 'Excellent irrigation service and very timely.', '2026-08-31'),
(3, 4, 'Good harvesting work and experienced workers.', '2026-10-07');



select * from farmer;
