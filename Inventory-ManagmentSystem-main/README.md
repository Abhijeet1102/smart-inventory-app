
# Inventory Management System

## 📦 Project Description

The **Inventory Management System** is a comprehensive desktop-based application built using **Java Swing** and **MySQL** to simplify and automate inventory and billing processes for small businesses, retail shops, and warehouses.

This system provides a user-friendly interface for managing:

- **Products** – including adding, updating, deleting items, and tracking stock quantity.
- **Customers** – saving customer details to be used in invoices and order history.
- **Orders and Billing** – allowing the user to select products, quantities, calculate totals, and automatically generate **professional PDF bills** using the **iText library**.

It also features **user login and authentication**, ensuring that only authorized users can access and manage inventory data. Input validation is implemented for email and phone numbers to ensure data quality.

The system is ideal for local businesses looking to move away from manual registers and Excel sheets to a more organized and secure system that ensures data consistency and efficient stock tracking.

## 🚀 Features

- Login & User Authentication
- Add / Update / Delete Products
- Customer Management
- Place Orders & Generate Bills
- Automatic PDF Invoice Creation (using iText)
- Real-time Inventory Updates
- Input Validations for Email & Phone Number

## 🛠️ Technologies Used

- **Java (Swing)**
- **MySQL**
- **JDBC**
- **iText PDF Library**
- **NetBeans IDE** (recommended)

## 🖥️ Installation & Setup

1. **Clone or Download** the repository:
   ```bash
   git clone https://github.com/your-username/Inventory-Management-System.git
   ```

2. **Open in NetBeans IDE**

3. **Configure Database:**
   - Create a MySQL database (e.g., `inventory`)
   - Import the provided `.sql` file if available
   - Update DB credentials in `ConnectionProvider.java`

4. **Run the Application:**
   - Build the project
   - Run the main form (e.g., `Main.java` or `Login.java`)

## 🧪 Validation Logic

- **Phone Number**: Only 10-digit numeric values allowed
- **Email**: Must contain `@` and valid domain

## 📸 Screenshots

> _Add screenshots of the application UI here_

## 👤 Author

**Abhijeet Rai**

