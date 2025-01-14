const express = require("express")
const router = express.Router()
const { verifyAdmin} = require("../utils/utils")
const  {fetchHistory, updateHistory,fetchAccounts,createAccounts, deleteAccounts,updateAccounts, credit, debit, fetchLoan, updateLoan, fetchCard, updateCard,updateAdmin } = require("../controller/admin")

let login = require("../controller/admin").login
let signup = require("../controller/admin").signup
let fetchUsers = require("../controller/admin").fetchUsers
let updateUser = require("../controller/admin").updateUser
let deleteUser = require("../controller/admin").deleteUser
let sendEmail = require("../controller/admin").sendEmail


//auth route
router.post("/adminlogin",login)
router.post('/adminsignup',signup)
//user routes
router.get('/users',verifyAdmin,fetchUsers)
router.patch('/users',verifyAdmin,updateUser)
router.delete('/users/:id',verifyAdmin,deleteUser)

//transfers routes
router.get('/history/:id',verifyAdmin,fetchHistory)
router.patch('/history/:id',verifyAdmin,updateHistory)
router.post('/sendemail',verifyAdmin,sendEmail)


//credit and debit route
router.post('/credit',verifyAdmin,credit)
router.post('/debit',verifyAdmin,debit)




router.patch('/admin/:id',verifyAdmin,updateAdmin)






exports.router = router