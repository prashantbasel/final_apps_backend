const router = require('express').Router();
const userController = require('../controllers/userControllers');
const { authGuard } = require('../middleware/authGuard');


// Creating user registration route 

router.post('/create', userController.createUser)

// login route
router.post('/login', userController.loginUser)

// get current user
router.get('/current', authGuard, userController.getCurrentUser)

router.post("/forgot_password", userController.forgotPassword);

router.post("/verify_otp", userController.verifyOtpAndSetNewPassword);

//profile
router.get('/profile', userController.getUserProfile);

router.put('/profile', userController.updateUserProfile);

// Search users
router.get('/search', authGuard, userController.searchUser);

// Add a friend
router.post('/add-friend', authGuard, userController.addFriend);

// Delete a friend
router.post('/delete-friend', authGuard, userController.deleteFriend);

router.get('/friend-requests', authGuard, userController.getFriendRequests);

router.get('/friends', authGuard, userController.getFriends);

router.post("/accept-friend-request", authGuard, userController.acceptFriendRequest);

router.post("/reject-friend-request", authGuard, userController.rejectFriendRequest);

router.post('/remove-friend', authGuard, userController.removeFriend);

// exporting the router 
module.exports = router