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
(name, contact, location, email, service_range, availability)
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

