-- =====================================================
-- AGRI SERVICE CONNECT
-- SQL QUERIES
-- =====================================================

USE agri_service_connect;


-- =====================================================
-- 1. BASIC QUERIES
-- =====================================================

-- Q1. Display all farmers with their locations
SELECT name, location
FROM farmer
ORDER BY name;


-- Q2. Display currently available workers
SELECT name, location, service_range
FROM worker
WHERE availability = TRUE;


-- Q3. Display lands larger than 2 acres
SELECT land_id, area, location
FROM land
WHERE area > 2
ORDER BY area DESC;


-- =====================================================
-- 2. JOIN QUERIES
-- =====================================================

-- Q4. Display farmers and their lands
SELECT
    f.name AS farmer_name,
    l.land_id,
    l.area,
    l.location AS land_location
FROM farmer f
JOIN land l
    ON f.farmer_id = l.farmer_id;


-- Q5. Display farmers, their lands and crops
SELECT
    f.name AS farmer_name,
    l.location AS land_location,
    c.crop_name,
    c.season
FROM farmer f
JOIN land l
    ON f.farmer_id = l.farmer_id
JOIN crop c
    ON l.land_id = c.land_id;


-- Q6. Display workers and the services they provide
SELECT
    w.name AS worker_name,
    s.service_name,
    ws.rate,
    ws.experience
FROM worker w
JOIN worker_service ws
    ON w.worker_id = ws.worker_id
JOIN service s
    ON ws.service_id = s.service_id;


-- Q7. Display service requests with farmer and service details
SELECT
    sr.request_id,
    f.name AS farmer_name,
    s.service_name,
    sr.required_date,
    sr.status
FROM service_request sr
JOIN farmer f
    ON sr.farmer_id = f.farmer_id
JOIN service s
    ON sr.service_id = s.service_id;


-- Q8. Display complete booking and payment information
SELECT
    b.booking_id,
    f.name AS farmer_name,
    w.name AS worker_name,
    s.service_name,
    b.amount AS booking_amount,
    p.payment_status
FROM booking b
JOIN service_request sr
    ON b.request_id = sr.request_id
JOIN farmer f
    ON sr.farmer_id = f.farmer_id
JOIN worker w
    ON b.worker_id = w.worker_id
JOIN service s
    ON sr.service_id = s.service_id
LEFT JOIN payment p
    ON b.booking_id = p.booking_id;


-- =====================================================
-- 3. AGGREGATE / GROUP BY QUERIES
-- =====================================================

-- Q9. Find total land area owned by each farmer
SELECT
    f.name AS farmer_name,
    SUM(l.area) AS total_land_area
FROM farmer f
JOIN land l
    ON f.farmer_id = l.farmer_id
GROUP BY f.farmer_id, f.name
ORDER BY total_land_area DESC;


-- Q10. Count workers providing each service
SELECT
    s.service_name,
    COUNT(ws.worker_id) AS number_of_workers
FROM service s
LEFT JOIN worker_service ws
    ON s.service_id = ws.service_id
GROUP BY s.service_id, s.service_name
ORDER BY number_of_workers DESC;


-- Q11. Find the most requested services
SELECT
    s.service_name,
    COUNT(sr.request_id) AS total_requests
FROM service s
LEFT JOIN service_request sr
    ON s.service_id = sr.service_id
GROUP BY s.service_id, s.service_name
ORDER BY total_requests DESC;


-- Q12. Find farmers who own more than one land
SELECT
    f.name AS farmer_name,
    COUNT(l.land_id) AS number_of_lands
FROM farmer f
JOIN land l
    ON f.farmer_id = l.farmer_id
GROUP BY f.farmer_id, f.name
HAVING COUNT(l.land_id) > 1;


-- =====================================================
-- 4. SUBQUERY
-- =====================================================

-- Q13. Find workers whose service rate is above
-- the average service rate
SELECT
    w.name AS worker_name,
    ws.rate
FROM worker w
JOIN worker_service ws
    ON w.worker_id = ws.worker_id
WHERE ws.rate > (
    SELECT AVG(rate)
    FROM worker_service
);


-- =====================================================
-- 5. CASE EXPRESSION
-- =====================================================

-- Q14. Categorize service requests by their status
SELECT
    request_id,
    status,
    CASE
        WHEN status = 'Pending' THEN 'Action Required'
        WHEN status = 'Accepted' THEN 'In Progress'
        WHEN status = 'Completed' THEN 'Finished'
        ELSE 'Unknown'
    END AS request_stage
FROM service_request;


-- =====================================================
-- 6. WINDOW FUNCTION
-- =====================================================

-- Q15. Rank all lands by area
SELECT
    land_id,
    location,
    area,
    RANK() OVER (ORDER BY area DESC) AS area_rank
FROM land;


-- =====================================================
-- 7. CTE
-- =====================================================

-- Q16. Find farmers whose total land area is
-- greater than 3 acres
WITH farmer_land AS (
    SELECT
        farmer_id,
        SUM(area) AS total_area
    FROM land
    GROUP BY farmer_id
)
SELECT
    f.name AS farmer_name,
    fl.total_area
FROM farmer f
JOIN farmer_land fl
    ON f.farmer_id = fl.farmer_id
WHERE fl.total_area > 3;


-- =====================================================
-- 8. VIEW
-- =====================================================

-- V1. Create a view showing farmer service requests
CREATE OR REPLACE VIEW farmer_service_requests AS
SELECT
    sr.request_id,
    f.name AS farmer_name,
    l.location AS land_location,
    s.service_name,
    sr.required_date,
    sr.status
FROM service_request sr
JOIN farmer f
    ON sr.farmer_id = f.farmer_id
JOIN land l
    ON sr.land_id = l.land_id
JOIN service s
    ON sr.service_id = s.service_id;


-- Display the view
SELECT *
FROM farmer_service_requests;


-- =====================================================
-- 9. TRANSACTION
-- =====================================================

-- T1. Demonstration of transaction control
START TRANSACTION;

UPDATE booking
SET status = 'Completed'
WHERE booking_id = 2;

-- If the operation is correct:
COMMIT;

-- If something goes wrong, ROLLBACK can be used
-- instead of COMMIT.


-- =====================================================
-- END OF QUERIES
-- =====================================================