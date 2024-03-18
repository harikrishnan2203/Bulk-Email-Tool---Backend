## Bulk Email Tool - Server
 - This is a basic Express application configured to create user and send mails using Nodemailer. It includes routes for user management, sending emails, and managing mail credentials.

## Getting Started
 - To get started with this project, follow these steps:

## Clone the repository:
 - git clone <repository-url>

## Install dependencies:
 - npm install

## Set up environment variables:
 - Create a .env file in the root directory of the project and add the following variables:

 - HOST: SMTP host for sending emails (in this case, smtp.gmail.com).
 - SERVICE: The email service provider (in this case, gmail).
 - PORT: Port number for the SMTP server (in this case, 465).
 - SECURE: Indicates whether the connection is secure (in this case, true).
 - USER: Email address used for sending emails (e.g., example@gmail.com).
 - PASS: Password or an app-specific password for the email account. Ensure this is kept secure.
 - FROM: The sender's email address (in this case, example@gmail.com).
 - SECRET_KEY: A secret key used for authentication or other purposes within your application (e.g., ******).

## Start the server:
 - npm start

## Project Structure
 - The project structure is as follows:

 - Database: Contains the database connection setup.
 - Routes: Contains route definitions for different features.
 - Middleware: Contains middleware functions.
 - Controller: Contains controller functions for different routes.
 - index.js: Main entry point of the application.

## Dependencies
 - express: Fast, unopinionated, minimalist web framework for Node.js.
 - body-parser: Node.js body parsing middleware.
 - cors: CORS (Cross-Origin Resource Sharing) middleware.
 - dotenv: Loads environment variables from a .env file.
 - mongodb: Official MongoDB driver for Node.js.
 - jsonwebtoken: JSON Web Token implementation for Node.js.
 - bcryptjs: Library for hashing passwords.
 - nodemailer: Module for sending emails.

## Usage
# User Routes: Access user-related endpoints at /user.
 - /signup: Route for user registration.
 - /verifyemail/:id: Verify user email.
 - /resetpassword: Initiate password reset.
 - /resetpassword/:string: Check user for password reset.
 - /changepassword/:string: Change user password.
 - /login: User login.
 - /verify-token: Verify JWT token.

# Mail Routes: Access mail-related endpoints at /mail.
 - /create-cred: Create mail credentials.
 - /get-cred: Get mail credentials.
 - /deletion-cred: Delete mail credentials.
 - /sendmail: Send mail.
 - /get-logs: Get mail logs.
 - /today-count: Count today's mail.
 - /chart: Generate mail logs chart.

## Contributing
 - Contributions are welcome! Feel free to open issues or pull requests.

 ## License
 - "This project is licensed under the MIT License.