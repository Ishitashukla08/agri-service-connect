# Agri Service Connect — Database Design

## 1. Project Overview

Agri Service Connect is a database-driven agricultural service management
system designed to connect farmers/landholders with workers and agricultural
service providers.

The system allows farmers to manage their agricultural land and crops,
request required services, find suitable workers, and manage bookings,
payments and reviews.

---

## 2. Main Objectives

- Maintain farmer and land information.
- Maintain crop information for agricultural lands.
- Manage agricultural services.
- Maintain workers and the services they provide.
- Allow farmers to submit service requests.
- Manage worker bookings for service requests.
- Record payments and service reviews.
- Support meaningful SQL queries and reporting.

---

## 3. Database Tables

| Table | Purpose |
|---|---|
| FARMER | Stores farmer/landholder information |
| LAND | Stores agricultural land owned/managed by farmers |
| CROP | Stores crops associated with agricultural land |
| SERVICE | Stores available agricultural services |
| WORKER | Stores service providers/workers |
| WORKER_SERVICE | Connects workers with the services they provide |
| SERVICE_REQUEST | Stores service requirements submitted by farmers |
| BOOKING | Stores worker assignments/bookings |
| PAYMENT | Stores payment information for bookings |
| REVIEW | Stores ratings and reviews for completed services |

---

## 4. Relationships

### Farmer → Land

One farmer can have multiple lands.

**1 : N**

### Land → Crop

A land can have multiple crop records.

**1 : N**

### Worker ↔ Service

A worker can provide multiple services and a service can be provided
by multiple workers.

**M : N**

This relationship is implemented using `WORKER_SERVICE`.

### Farmer → Service Request

A farmer can submit multiple service requests.

**1 : N**

### Land → Service Request

A land can have multiple service requests.

**1 : N**

### Service → Service Request

A service can be requested multiple times.

**1 : N**

### Service Request → Booking

A service request can have at most one booking.

**1 : 0..1**

### Worker → Booking

A worker can have multiple bookings.

**1 : N**

### Booking → Payment

A booking can have at most one payment.

**1 : 0..1**

### Booking → Review

A booking can have at most one review.

**1 : 0..1**

---

## 5. Keys and Constraints

The database uses:

- Primary Keys for unique identification of records.
- Foreign Keys to maintain relationships between tables.
- Composite Primary Key in `WORKER_SERVICE`.
- `UNIQUE` constraints for one-to-one/optional relationships.
- `NOT NULL` constraints for required attributes.
- `CHECK` constraint on review ratings.
- `AUTO_INCREMENT` for generated identifiers.

---

## 6. Normalization

The database has been designed to reduce redundancy and avoid
update, insertion and deletion anomalies.

The design follows normalization principles up to **BCNF** for the
functional dependencies identified in the project.

Examples:

- Worker and service information are separated.
- The many-to-many Worker–Service relationship is separated into
  `WORKER_SERVICE`.
- Land information is separated from farmer information because one
  farmer may own/manage multiple lands.
- Booking, payment and review information are maintained separately.

---

## 7. SQL Features Demonstrated

The project demonstrates:

- SELECT and filtering
- ORDER BY and DISTINCT
- INNER JOIN and LEFT JOIN
- Aggregate functions
- GROUP BY and HAVING
- Subqueries
- CASE expressions
- Common Table Expressions (CTEs)
- Window functions
- Views
- Transactions
- Primary and foreign key constraints
- UNIQUE and CHECK constraints

---

## 8. Project Files

```text
database/
├── schema.sql
├── sample_data.sql
└── queries.sql
