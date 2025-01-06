const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendOtp = require('../service/sendOtp');


const createUser = async (req, res) => {
    try {
        const { firstName, phone, email, password } = req.body;

        if (!firstName || !phone || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter all fields!"
            });
        }

        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.json({
                success: false,
                message: "User already exists!"
            });
        }

        const randomSalt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, randomSalt);

        const newUser = new userModel({
            firstName,
            phone,
            email,
            password: hashedPassword
        });

        await newUser.save();

        return res.status(201).json({
            success: true,
            message: "User created successfully!"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error!"
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter all fields!"
            });
        }

        const user = await userModel.findOne({ email: email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found!"
            });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: "Password does not match"
            });
        }

        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);

        return res.status(201).json({
            success: true,
            message: "Login successfully!",
            token,
            userData: user
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error!"
        });
    }
};
const getCurrentUser = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id).select('-password'); // Do not return the password
 
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found!'
            });
        }
 
        res.status(200).json({
            success: true,
            message: 'User found!',
            user: user
        });
 
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}
const getUserProfile = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1]; // Assuming Bearer token
  if (!token) {
      return res.status(401).json({ message: 'Authorization token is missing' });
  }
  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await userModel.findById(decoded.id);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
};

const updateUserProfile = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1]; // Assuming Bearer token
  if (!token) {
      return res.status(401).json({ message: 'Authorization token is missing' });
  }
  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await userModel.findById(decoded.id);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      const { firstName, phone, password } = req.body;
      if (firstName) user.firstName = firstName;
    
      if (phone) user.phone = phone;
      if (password) user.password = await bcrypt.hash(password, 10);

      await user.save();
      res.json(user);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
};

 
const getToken = async (req, res) => {
    try {
      console.log(req.body);
      const { id } = req.body;
   
      const user = await userModel.findById(id);
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'User not found',
        });
      }
   
      const token = await jwt.sign(
            {
                id : user._id, isAdmin : user.isAdmin},
                process.env.JWT_SECRET
      );
   
      return res.status(200).json({
        success: true,
        message: 'Token generated successfully!',
        token: token,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: error,
      });
    }
  };

  const forgotPassword = async (req, res) => {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Please provide your phone number!",
      });
    }
   
    try {
      const user = await userModel.findOne({ phone: phone });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found!",
        });
      }
      // generate random 6 digit otp
      const otp = Math.floor(100000 + Math.random() * 900000);
      // generate expiry date
      const expiryDate = Date.now() + 360000;
      // save to database for verification
      user.resetPasswordOTP = otp;
      user.resetPasswordExpiry = expiryDate;
      await user.save();
   
      // send otp to registered phone
      const isSent = await sendOtp(phone, otp);
      if (!isSent) {
        return res.status(400).json({
          success: false,
          message: "error sending opt code!",
        });
      }
      res.status(200).json({
        success: true,
        message: "OTP sent successfully!",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Internal server error!",
      });
    }
  };
  // verify otp and send new password
  const verifyOtpAndSetNewPassword = async (req, res) => {
    // get data
    const { phone, otp, newPassword } = req.body;
    if (!phone || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide all fields!",
      });
    }
    try {
      const user = await userModel.findOne({ phone: phone });
      // verify otp
      if (user.resetPasswordOTP != otp) {
        res.status(400).json({
          success: false,
          message: "invalid otp!",
        });
      }
      if (user.resetPasswordExpiry < Date.now()) {
        res.status(400).json({
          success: false,
          message: "otp expired!",
        });
      }
      // password hash
      const randomSalt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, randomSalt);
   
      // save new password and update to database
      user.password = hashedPassword;
      await user.save();
   
      // response
      res.status(200).json({
        success: true,
        message: "Password changed successfully!",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Internal server error!",
      });
    }
  };

  const searchUser = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Search query cannot be empty",
            });
        }

        const users = await userModel.find({
            $or: [
                { firstName: { $regex: query, $options: "i" } },
                { email: { $regex: query, $options: "i" } },
            ],
        });

        res.status(200).json({
            success: true,
            users,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


const addFriend = async (req, res) => {
  try {
      const { friendId } = req.body; // Make sure you're expecting friendId in the request body
      const userId = req.user.id; // Extract the userId from the token

      if (!friendId) {
          return res.status(400).json({ message: "Friend ID is required" });
      }

      // Ensure the friend exists
      const friend = await userModel.findById(friendId);
      if (!friend) {
          return res.status(404).json({ message: "Friend not found" });
      }

      // Check if they are already friends
      const user = await userModel.findById(userId);
      if (user.friends && user.friends.includes(friendId)) {
          return res.status(400).json({ message: "Already friends" });
      }

      // Add friend
      user.friends.push(friendId);
      friend.friends.push(userId);

      await user.save();
      await friend.save();

      res.status(200).json({ message: "Friend added successfully" });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
  }
};


const deleteFriend = async (req, res) => {
    try {
        const { friendId } = req.body;
        const userId = req.user.id; // Get the logged-in user's ID from the auth middleware

        if (!friendId) {
            return res.status(400).json({
                success: false,
                message: "Friend ID is required!"
            });
        }

        const user = await userModel.findById(userId);
        const friend = await userModel.findById(friendId);

        if (!user || !friend) {
            return res.status(404).json({
                success: false,
                message: "User or friend not found!"
            });
        }

        // Remove the friend from each other's friend list
        user.friends = user.friends.filter(id => id.toString() !== friendId);
        friend.friends = friend.friends.filter(id => id.toString() !== userId);

        await user.save();
        await friend.save();

        res.status(200).json({
            success: true,
            message: "Friend removed successfully!"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error!"
        });
    }
};
const getFriendRequests = async (req, res) => {
  try {
      // Assume the user model has a `friendRequests` array with user IDs of the senders
      const user = await userModel.findById(req.user.id).populate('friendRequests', 'firstName email avatar');
      
      if (!user) {
          return res.status(404).json({
              success: false,
              message: "User not found!",
          });
      }

      res.status(200).json({
          success: true,
          friendRequests: user.friendRequests,
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({
          success: false,
          message: "Internal server error!",
      });
  }
};
const getFriends = async (req, res) => {
  try {
      // Find the logged-in user and populate their friends list
      const user = await userModel.findById(req.user.id).populate('friends', 'firstName email phone avatar');
      
      if (!user) {
          return res.status(404).json({
              success: false,
              message: "User not found!",
          });
      }

      res.status(200).json({
          success: true,
          friends: user.friends,
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({
          success: false,
          message: "Internal server error!",
      });
  }
};

const acceptFriendRequest = async (req, res) => {
  try {
      const { requestId } = req.body; // ID of the friend who sent the request
      const userId = req.user.id; // Logged-in user's ID

      const user = await userModel.findById(userId);
      const friend = await userModel.findById(requestId);

      if (!user || !friend) {
          return res.status(404).json({ message: "User not found" });
      }

      // Add the friend to the user's friend list
      if (!user.friends.includes(requestId)) {
          user.friends.push(requestId);
      }

      // Add the user to the friend's friend list (optional: mutual friendship)
      if (!friend.friends.includes(userId)) {
          friend.friends.push(userId);
      }

      // Remove the friend request
      user.friendRequests = user.friendRequests.filter(
          (req) => req.toString() !== requestId
      );

      await user.save();
      await friend.save();

      res.status(200).json({ message: "Friend request accepted!" });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
  }
};
const rejectFriendRequest = async (req, res) => {
  try {
      const { requestId } = req.body; // ID of the friend who sent the request
      const userId = req.user.id; // Logged-in user's ID

      const user = await userModel.findById(userId);

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      // Remove the friend request
      user.friendRequests = user.friendRequests.filter(
          (req) => req.toString() !== requestId
      );

      await user.save();

      res.status(200).json({ message: "Friend request rejected!" });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
  }
};
const removeFriend = async (req, res) => {
  try {
      const { friendId } = req.body;

      // Find the current user
      const user = await userModel.findById(req.user.id);

      if (!user) {
          return res.status(404).json({ success: false, message: "User not found!" });
      }

      // Remove the friend
      user.friends = user.friends.filter((id) => id.toString() !== friendId);

      await user.save();

      res.status(200).json({
          success: true,
          message: "Friend removed successfully!",
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({
          success: false,
          message: "Internal server error!",
      });
  }
};

module.exports = {
  removeFriend,
};

   

module.exports = {
    createUser,
    loginUser,
    getCurrentUser,
    forgotPassword,
    verifyOtpAndSetNewPassword,
    updateUserProfile,
    getUserProfile,
    searchUser,
    addFriend,
    deleteFriend,
    getFriendRequests,
    getFriends,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend
    

};
