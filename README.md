Moto Maintain: Maintenance Booking System – Backend

Overview

The backend for the Moto Maintain App is built with Node.js and provides essential functionalities for managing maintenance bookings. It handles data management, authentication, and various API endpoints for service scheduling, customer management, and payment processing. This system is designed to seamlessly connect bike owners with service providers, ensuring efficient appointment management and tracking of service history.


POST /api/user/create
•	Description: Register a new user.
•	Function: registerUserApi(data)

POST /api/user/login
•	Description: Log in a user.
•	Function: loginUserApi(data)

POST /api/user/forgot_password
•	Description: Initiate the password recovery process.
•	Function: ForgetPasswordApi(data)

POST /api/user/verify_otp
•	Description: Verify OTP and set a new password.
•	Function: verifyOtpApi(data)

GET /api/user/profile
•	Description: Get the user's profile.
•	Function: getUserProfileApi()

PUT /api/user/profile
•	Description: Update the user's profile.
•	Function: updateUserProfileApi(data)

Product API

POST /api/product/create
•	Description: Create a new product.
•	Function: createProductApi(data)

GET /api/product/get_all_products
•	Description: Retrieve all products.
•	Function: getAllProducts()

GET /api/product/get_single_product/:id
•	Description: Retrieve a single product by ID.
•	Function: getSingleProduct(id)

DELETE /api/product/delete_product/:id
•	Description: Delete a product by ID.
•	Function: deleteProduct(id)

PUT /api/product/update_product/:id
•	Description: Update a product by ID.
•	Function: updateProduct(id, data)

GET /api/product/get_all_products?page=:page&limit=:limit
•	Description: Retrieve products with pagination.
•	Function: paginationproduct(page, limit)

Booking API

POST /api/booking/add
•	Description: Add a new appointment.
•	Function: addAppointment(data)

POST /api/booking/check-timeslot
•	Description: Check availability of a timeslot for an appointment.
•	Function: addAppointmentCheck(data)

GET /api/booking/all
•	Description: Retrieve all bookings.
•	Function: getAllBookings()

Contact API

GET /api/contact/all
•	Description: Retrieve all contact items.
•	Function: getAllContacts()

Test API

GET /test
•	Description: Test API endpoint.
•	Function: testApi()

Author 
Prashant Basel
