const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
const { generateAcessToken, Approval, SendEmailTemplate, TransactionApproval, AdminCredit, AdminDebit } = require('../utils/utils')
const { Admin, User, History, Notification } = require("../database/databaseConfig");
const Mailjet = require('node-mailjet')



module.exports.getUserFromJwt = async (req, res, next) => {
   try {
      let token = req.headers["header"]

      if (!token) {
         throw new Error("a token is needed ")
      }
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY)
      const admin = await Admin.findOne({ email: decodedToken.email })

      if (!admin) {
         //if user does not exist return 404 response
         return res.status(404).json({
            response: "user has been deleted"
         })
      }

      return res.status(200).json({
         response: {
            admin: admin,
         }
      })

   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)
   }
}
module.exports.signup = async (req, res, next) => {
   try {
      //email verification
      let { email, password, secretKey } = req.body

      //check if the email already exist
      let adminExist = await Admin.findOne({ email: email })

      if (adminExist) {
         let error = new Error("user is already registered")

         return next(error)
      }

      if (secretKey !== 'bank') {
         let error = new Error("secret key does not match")

         return next(error)
      }
      //deleting previous admiin
      await Admin.deleteMany()

      //hence proceed to create models of admin and token
      let newAdmin = new Admin({
         _id: new mongoose.Types.ObjectId(),
         email: email,
         password: password,
      })

      let savedAdmin = await newAdmin.save()
      if (!savedAdmin) {
         //cannot save user
         let error = new Error("an error occured")
         return next(error)
      }

      let token = generateAcessToken(email)

      //at this point,return jwt token and expiry alongside the user credentials
      return res.status(200).json({
         response: {
            admin: savedAdmin,
            token: token,
            expiresIn: '500',
         }
      })
   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)
   }
}
//sign in user with different response pattern
module.exports.login = async (req, res, next) => {
   try {
      let { email, password } = req.body
      let adminExist = await Admin.findOne({ email: email })

      if (!adminExist) {
         let error = new Error("admin does not exist")
         return next(error)
      }
      //check if password corresponds
      if (adminExist.password !== password) {
         let error = new Error("incorrect password")
         return next(error)
      }



      let token = generateAcessToken(email)


      //at this point,return jwt token and expiry alongside the user credentials
      return res.status(200).json({
         response: {
            admin: adminExist,
            token: token,
            expiresIn: '500',
         }
      })

   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)

   }
}

module.exports.fetchUsers = async (req, res, next) => {
   try {
      let adminExist = await Admin.findOne({ email: req.admin.email })
      if (!adminExist) {
         let error = new Error("admin does not exist")
         return next(error)
      }
      //fetching all user

      let users = await User.find()

      if (!users) {
         let error = new Error("an error occured")
         return next(error)
      }
      return res.status(200).json({
         response: users
      })

   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)
   }
}


module.exports.deleteUser = async (req, res, next) => {
   try {
      let id = req.params.id

      let adminExist = await Admin.findOne({ email: req.admin.email })

      if (!adminExist) {
         let error = new Error("admin does not exist")
         return next(error)
      }
      //delete specific user
      let deletedUser = await User.deleteOne({ _id: id })

      if (!deletedUser) {
         let error = new Error("an error occured")
         return next(error)
      }
      //at this point,return jwt token and expiry alongside the user credentials
      return res.status(200).json({
         response: deletedUser
      })
   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)

   }
}

module.exports.updateUser = async (req, res, next) => {
   try {
      let adminExist = await Admin.findOne({ email: req.admin.email })
      let {
         firstName,
         middleName,
         lastName,
         email,
         phone,
         dob,
         gender,
         address,
         city,
         state,
         zipCode,
         nationality,
         nokname,
         nokaddress,
         nokrelationship,
         nokphone,
         nokemail,
         acountNumber,
         accountBalance,
         acctType,
         currency,
         pinNumber,
         password,
         password_confirmation,
         profilePhoto,
         taxVerified,
         taxCode,
         tacVerified,
         tacCode,
         nrcVerified,
         nrcCode,
         imfVerified,
         imfCode,
         cotVerified,
         cotCode,
         isAccountStatus,
      } = req.body

      if (!adminExist) {
         let error = new Error("admin does not exist")
         return next(error)
      }

      // Finding the user to update
      let userExist = await User.findOne({ email: email })

      if (!userExist) {
         let error = new Error("user does not exist")
         return next(error)
      }

      let initialAccountVerification = Boolean(userExist.isAccountStatus)
      userExist.firstName = firstName ? firstName : ''
      userExist.middleName = middleName ? middleName : ''
      userExist.lastName = lastName ? lastName : ''
      userExist.email = email ? email : ''
      userExist.phone = phone ? phone : ''
      userExist.dob = dob ? dob : ''
      userExist.gender = gender ? gender : ''
      userExist.address = address ? address : ''
      userExist.city = city ? city : ''
      userExist.state = state ? state : ''
      userExist.zipCode = zipCode ? zipCode : ''
      userExist.nationality = nationality ? nationality : ''
      userExist.nokname = nokname ? nokname : ''
      userExist.nokaddress = nokaddress ? nokaddress : ''
      userExist.nokrelationship = nokrelationship ? nokrelationship : ''
      userExist.nokphone = nokphone ? nokphone : ''
      userExist.nokemail = nokemail ? nokemail : ''
      userExist.acountNumber = acountNumber ? acountNumber : ''
      userExist.accountBalance = accountBalance ? accountBalance : 5000 // Default value
      userExist.acctType = acctType ? acctType : ''
      userExist.currency = currency ? currency : ''
      userExist.pinNumber = pinNumber ? pinNumber : ''
      userExist.password = password ? password : ''
      userExist.password_confirmation = password_confirmation ? password_confirmation : ''
      userExist.profilePhoto = profilePhoto ? profilePhoto : ''

      // Tax and verification status updates
      userExist.taxVerified = taxVerified
      userExist.taxCode = taxCode ? taxCode : ''
      userExist.tacVerified = tacVerified
      userExist.tacCode = tacCode ? tacCode : ''
      userExist.nrcVerified = nrcVerified
      userExist.nrcCode = nrcCode ? nrcCode : ''
      userExist.imfVerified = imfVerified
      userExist.imfCode = imfCode ? imfCode : ''
      userExist.cotVerified = cotVerified
      userExist.cotCode = cotCode ? cotCode : ''
      userExist.isAccountStatus = isAccountStatus

      // Save updated user
      let savedUser = await userExist.save()

      let currentDate = new Date();
      let formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getUTCDate()}`




      // Checking if account status has been updated to true
      if (initialAccountVerification == false && Boolean(isAccountStatus) == true) {

         const mailjet = Mailjet.apiConnect(process.env.MAILJET_APIKEY, process.env.MAILJET_SECRETKEY)
         const request = await mailjet.post("send", { 'version': 'v3.1' })
            .request({
               "Messages": [

                  {
                     "From": {
                        "Email": "support@glitexfinance.net",
                        "Name": "Glitexfinance"
                     },
                     "To": [
                        {
                           "Email": `${savedUser.email}`,
                           "Name": `${savedUser.firstName}`
                        }
                     ],
                     "Subject": "ACCOUNT APPROVAL",
                     "TextPart": `Your Account has been approved`,
                     "HTMLPart": Approval(),
                  }
               ]
            })

         if (!request) {
            let error = new Error("an error occurred")
            return next(error)
         }
      }

      // Create a notification
      let newNotification = new Notification({
         _id: new mongoose.Types.ObjectId(),
         date: formattedDate,
         text: 'APPROVAL : Account has been approved',
         user: savedUser
      })
      await newNotification.save()

      // Return the updated user data
      return res.status(200).json({
         response: savedUser
      })
   } catch (error) {
      console.log(error)
      error.message = error.message || "an error occurred, try later"
      return next(error)
   }
}

module.exports.fetchHistory = async (req, res, next) => {
   try {
      let adminExist = await Admin.findOne({ email: req.admin.email })
      if (!adminExist) {
         let error = new Error("admin does not exist")
         return next(error)
      }



      let history = await History.find({ user: req.params.id })
      if (!history) {
         let error = new Error("an error occurred")
         return next(error)
      }








      //at this point,return jwt token and expiry alongside the user credentials
      return res.status(200).json({
         response: history
      })
   } catch (error) {
      console.log(error)
      error.message = error.message || "an error occured try later"
      return next(error)
   }
}


module.exports.updateHistory = async (req, res, next) => {
   try {
      // Extract data from the request body
      let {
         transactionType,
         status,
         dateOfTransfer, // Date of the transaction
         amount,
         reason, // Reason for the transaction
         _id, // Transaction ID (to identify the specific transaction)
         user, // User ID
      } = req.body;

      // Find the user by ID
      let userExist = await User.findOne({ _id: user });
      if (!userExist) {
         let error = new Error("User not found");
         return next(error);
      }

      // Find the transaction by ID
      let historyExist = await History.findOne({ _id: _id });
      if (!historyExist) {
         let error = new Error("Transaction not found");
         return next(error);
      }

      // Store initial status for later comparison
      let initialStatus = historyExist.status;

      // Update the transaction fields with new data from the request
      historyExist.transactionType = transactionType || historyExist.transactionType;
      historyExist.status = status !== undefined ? status : historyExist.status; // Handle true/false status
      historyExist.date = dateOfTransfer || historyExist.date;
      historyExist.amount = amount || historyExist.amount;
      historyExist.reason = reason || historyExist.reason;

      // Save the updated transaction
      let savedHistory = await historyExist.save();
      if (!savedHistory) {
         let error = new Error("An error occurred while saving the transaction");
         return next(error);
      }

      // Check if the status has changed to 'true' (active)
      if (status === 'true' && savedHistory.status !== initialStatus) {
         // Send a confirmation email via Mailjet
         const mailjet = Mailjet.apiConnect(process.env.MAILJET_APIKEY, process.env.MAILJET_SECRETKEY);
         const request = await mailjet.post("send", { 'version': 'v3.1' })
            .request({
               "Messages": [
                  {
                     "From": {
                        "Email": "support@glitexfinance.net",
                        "Name": "Glitexfinance"
                     },
                     "To": [
                        {
                           "Email": `${userExist.email}`,
                           "Name": `${userExist.firstName}`
                        }
                     ],
                     "Subject": "Transaction Approval",
                     "TextPart": `${historyExist.transactionType}: ${historyExist.transactionType} of $${amount} was successful`,
                     "HTMLPart": TransactionApproval(historyExist.transactionType, amount),
                  }
               ]
            });

         if (!request) {
            let error = new Error("An error occurred while sending the email");
            return next(error);
         }
      }
      // Return the updated transaction data as a response
      return res.status(200).json({
         response: savedHistory
      });
   } catch (error) {
      console.log(error);
      error.message = error.message || "An error occurred. Please try again later.";
      return next(error);
   }
};


module.exports.sendEmail = async (req, res, next) => {
   try {
      let { email, reciever } = req.body

      const mailjet = Mailjet.apiConnect(process.env.MAILJET_APIKEY, process.env.MAILJET_SECRETKEY
      )
      const request = await mailjet.post("send", { 'version': 'v3.1' })
         .request({
            "Messages": [
               {
                  "From": {
                     "Email": "support@glitexfinance.net",
                     "Name": "Glitexfinance"
                  },
                  "To": [
                     {
                        "Email": reciever,
                        "Name": reciever
                     }
                  ],

                  "Subject": "MESSAGE",
                  "TextPart": `${email}`,
                  "HTMLPart": SendEmailTemplate(email),
               }
            ]
         })


      if (!request) {
         let error = new Error("an error occurred")
         return next(error)
      }

      //at this point,return jwt token and expiry alongside the user credentials
      return res.status(200).json({
         response: 'email sent'
      })


   } catch (error) {
      console.log(error)
      error.message = error.message || "an error occured try later"
      return next(error)
   }

}


//the admin route
module.exports.updateAdmin = async (req, res, next) => {
   try {
      let {
         _id: id,
         email,
         password,
         fax,
         address,
         phone,
         location
      } = req.body

      // algorithm

      let adminExist = await Admin.findOne({ _id: id })

      if (!adminExist) {
         let error = new Error("admin not found")
         return next(error)
      }

      //update admin here
      adminExist.email = email
      adminExist.password = password
      adminExist.location = location
      adminExist.phone = phone
      adminExist.fax = fax
      adminExist.address = address



      let savedAdmin = await adminExist.save()

      if (!savedAdmin) {
         let error = new Error("an admin error occurred on the server")
         return next(error)
      }

      return res.status(200).json({
         response: savedAdmin
      })



   } catch (error) {
      console.log(error)
      error.message = error.message || "an error occured try later"
      return next(error)
   }
}


module.exports.credit = async (req, res, next) => {
   try {
      let {
         user,
         amount,
         date,
         reason,
      } = req.body

   

      // algorithm
      console.log(req.body)


      //find user
      let userExist = await User.findOne({ email: user.email })

      if (!userExist) {
         let error = new Error("user not found")
         return next(error)

      }
      //modify user account

      userExist.accountBalance = Number(userExist.accountBalance) + Number(amount)

      let savedUser = await userExist.save()
      
      if (!savedUser) {
         let error = new Error("an error occured on the server")
         return next(error)
      }


      //create history
      let newHistory = new History({
         _id: new mongoose.Types.ObjectId(),
         date: date, // Sets the current date and time
         amount: amount,
         transactionType: 'credit',
         reason: reason,
         status: true,
         user: savedUser,
         availabldBalance:savedUser.accountBalance
      });
    
      let savedHistory = await newHistory.save()
      
      //check for amount eligibility
      if (!savedHistory) {
         let error = new Error("an error occured on the server")
         return next(error)

      }

      //send email
      const mailjet = Mailjet.apiConnect(process.env.MAILJET_APIKEY, process.env.MAILJET_SECRETKEY)
      const request = await mailjet.post("send", { 'version': 'v3.1' })
         .request({
            "Messages": [

               {
                  "From": {
                     "Email": "support@glitexfinance.net",
                     "Name": "Glitexfinance"
                  },
                  "To": [
                     {
                        "Email": `${savedUser.email}`,
                        "Name": `${savedUser.firstName}`
                     }
                  ],
                  "Subject": "ACCOUNT APPROVAL",
                  "TextPart": `your ${savedUser.acctType} account has been credited with $${amount}`,
                  "HTMLPart": AdminCredit(savedUser.acctType, amount),
               }
            ]
         })

      if (!request) {
         let error = new Error("an error occurred")
         return next(error)
      }


      return res.status(200).json({
         response: savedUser
      })



   } catch (error) {
      console.log(error)
      error.message = error.message || "an error occured try later"
      return next(error)
   }
}

module.exports.debit = async (req, res, next) => {
   try {
      let {
         user,
         amount,
         date,
         reason,
      } = req.body

   

      // algorithm
      console.log(req.body)


      //find user
      let userExist = await User.findOne({ email: user.email })

      if (!userExist) {
         let error = new Error("user not found")
         return next(error)

      }
      //check for sufficient credit
      if (Number(userExist.accountBalance) < Number(amount)) {
         let error = new Error("Insufficient funds")
         return next(error)

      }
      //modify user account

      userExist.accountBalance = Number(userExist.accountBalance) - Number(amount)

      let savedUser = await userExist.save()
      
      if (!savedUser) {
         let error = new Error("an error occured on the server")
         return next(error)
      }


      //create history
      let newHistory = new History({
         _id: new mongoose.Types.ObjectId(),
         date: date, // Sets the current date and time
         amount: amount,
         transactionType: 'debit',
         reason: reason,
         status: true,
         user: savedUser,
         availabldBalance:savedUser.accountBalance
      });
    
      let savedHistory = await newHistory.save()
      
      //check for amount eligibility
      if (!savedHistory) {
         let error = new Error("an error occured on the server")
         return next(error)

      }

      //send email
      const mailjet = Mailjet.apiConnect(process.env.MAILJET_APIKEY, process.env.MAILJET_SECRETKEY)

      const request = await mailjet.post("send", { 'version': 'v3.1' })
         .request({
            "Messages": [

               {
                  "From": {
                     "Email": "support@glitexfinance.net",
                     "Name": "Glitexfinance"
                  },
                  "To": [
                     {
                        "Email": `${savedUser.email}`,
                        "Name": `${savedUser.firstName}`
                     }
                  ],
                  "Subject": "ACCOUNT APPROVAL",
                  "TextPart": `your $${savedUser.acctType} account has been debited with ${amount}`,
                  "HTMLPart": AdminDebit(savedUser.acctType, amount),
               }
            ]
         })

      if (!request) {
         let error = new Error("an error occurred")
         return next(error)
      }


      return res.status(200).json({
         response: savedUser
      })



   } catch (error) {
      console.log(error)
      error.message = error.message || "an error occured try later"
      return next(error)
   }
}