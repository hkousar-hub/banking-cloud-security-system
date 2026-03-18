require("dotenv").config()

const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")

const authRoutes = require("./routes/authRoutes")

const app = express()


// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use("/api",authRoutes)

// Test route
app.get("/",(req,res)=>{
 res.send("Server is running")
})

// Logger
app.use((req,res,next)=>{
 console.log(`${req.method} ${req.url}`)
 next()
})


// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(()=>{

 console.log("✅ MongoDB Connected")

 app.listen(process.env.PORT,()=>{
  console.log(`🚀 Server running on port ${process.env.PORT}`)
 })

})
.catch(err=>{
 console.error("❌ MongoDB connection error:",err.message)
})