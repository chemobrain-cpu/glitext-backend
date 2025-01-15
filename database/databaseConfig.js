const mongoose = require("mongoose")

mongoose.connect(process.env.DB_STRING).then(() => {
    console.log("connected to database")
})


const AdminSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },

    location: {
        type: String,
    },

    phone: {
        type: String,
    },
    fax: {
        type: String,
    },

    address: {
        type: String,
    },






})
const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    firstName: {
        type: String
    },
    middleName: {
        type: String
    },
    lastName: {
        type: String
    },
    address: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    zipCode: {
        type: String
    },
    nationality: {
        type: String
    },
    phone: {
        type: String
    },
    email: {
        type: String
    },
    dob: {
        type: String
    },
    gender: {
        type: String
    },
    employStatus: {
        type: String
    },
    acctType: {
        type: String
    },
    currency: {
        type: String
    },
    pinNumber: {
        type: String
    },
    password: {
        type: String
    },
    password_confirmation: {
        type: String
    },
    nokname: {
        type: String
    },
    nokaddress: {
        type: String
    },
    nokrelationship: {
        type: String
    },
    nokphone: {
        type: String
    },
    nokemail: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    nextOfKinEmail: {
        type: String
    },

    taxVerified: {
        type: Boolean,
        default: false
    },
    taxCode: {
        type: Number,
        default: () => Math.floor(1000 + Math.random() * 9000) // Generates a random 4-digit number
    },

    tacVerified: {
        type: Boolean,
        default: false
    },
    tacCode: {
        type: Number,
        default: () => Math.floor(1000 + Math.random() * 9000) // Generates a random 4-digit number
    },

    nrcVerified: {
        type: Boolean,
        default: false
    },
    nrcCode: {
        type: Number,
        default: () => Math.floor(1000 + Math.random() * 9000) // Generates a random 4-digit number
    },

    imfVerified: {
        type: Boolean,
        default: false
    },
    imfCode: {
        type: Number,
        default: () => Math.floor(1000 + Math.random() * 9000) // Generates a random 4-digit number
    },

    cotVerified: {
        type: Boolean,
        default: false
    },
    cotCode: {
        type: Number,
        default: () => Math.floor(1000 + Math.random() * 9000) // Generates a random 4-digit number
    },

    acountNumber: {

        type: String
    },
    accountBalance: {
        type: Number,
        default: "5000"
    },
    profilePhoto: {
        type: String,
    },
    isAccountStatus: {
        type: Boolean,
        default: false
    },
})
const HistorySchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    id: {
        type: String,
    },

    nameOfBank: {
        type: String,
    },
    date: {
        type: String,
    },
    amount: {
        type: String,
    },
    availabldBalance: {
        type: String,
    },
    transactionType: {
        type: String,
    },
    accountName: {
        type: String,
    },

    reason: {
        type: String,
    },
    status: {
        type: String,
        default: 'Pending'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})
const NotificationSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    text: {
        type: String,
    },
    date: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})



let User = new mongoose.model("User", userSchema)
let History = new mongoose.model("History", HistorySchema)
let Notification = new mongoose.model('Notification', NotificationSchema)
let Admin = new mongoose.model('Admin', AdminSchema)








module.exports.User = User
module.exports.Admin = Admin
module.exports.History = History
module.exports.Notification = Notification
