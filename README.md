# Rebu

**Rebu** is a full-stack car rental application built with the MERN stack. The platform allows users to rent cars with an intuitive interface, while providing admins with the ability to manage car listings. The application features robust CRUD operations for car management and a flexible refund policy for cancellations.

## Features

- **Car Rental Management:** Users can book cars for rental.
- **Admin Functionality:** Admins can add or delete car listings.
- **Booking Cancellation:** 
  - 100% refund if canceled 48 hours before the start time.
  - 50% refund if canceled within 24 hours.

## Technologies Used

- **MongoDB:** NoSQL database for storing car and booking data.
- **Express.js:** Web application framework for Node.js.
- **React.js:** Front-end library for building user interfaces.
- **Node.js:** JavaScript runtime for server-side logic.

## Installation

To set up the project locally:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/apkharsh/rebu.git
   cd rebu

2. **Setup Environment Variables:**

   ```bash
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret

3. **Run the Application:**

   ```bash
   npm run dev
