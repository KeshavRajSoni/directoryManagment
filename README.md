# Directory Management System

## Overview
A Directory Management System for managing local businesses, built using **.NET Core (Backend API)** and **React/Angular (Frontend)**. This project includes CRUD operations, search, pagination, and sorting functionality.

---

## Features
1. **Business Listing Management**:
   - Add, update, delete, and view businesses.
   - Inline actions for editing and deleting businesses.
2. **Search Functionality**:
   - Search by business name or city.
3. **Pagination**:
   - Displays 10 records per page with navigation options.
4. **Sorting**:
   - Sort data by business name and city (ascending/descending).
5. **Responsive Design**:
   - Fully responsive and user-friendly interface.

---

## Technologies Used
- **Backend**: .NET Core
- **Frontend**: React
- **Database**: SQL Server
- **Styling**: Bootstrap

---

## How to Run Locally
### Prerequisites:
1. **Backend**:
   - Install [.NET Core SDK](https://dotnet.microsoft.com/download).
   - Install SQL Server Management Studio (SSMS).
2. **Frontend**:
   - Install [Node.js](https://nodejs.org/).

### Steps:
1. **Clone the repository**:
   ```bash
   git clone <repository-link>
   cd <repository-name>

2. **Run the backend**:

   ```bash
   cd backend
   dotnet restore
   dotnet run
inside the **DirectoryContext.cs** file update the server connection string.
=> optionsBuilder.UseSqlServer("Server=YOUR_SERVER;Database=YOUR_DATABASE;Trusted_Connection=True;TrustServerCertificate=True;")

The backend should now run on http://localhost:5264/.

To test apis on Swagger http://localhost:5264/swagger/index.html

3. **Run the frontend**:
    ```bash
    cd frontend
    npm install
    npm start

The frontend should now run on http://localhost:3000.


