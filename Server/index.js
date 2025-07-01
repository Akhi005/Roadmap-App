const express = require('express')
const cors = require('cors')
const { MongoClient, ObjectId } = require('mongodb')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 4000

const allowedOrigins = [
  'http://localhost:5173',
  'https://roadmap-app-n2na.vercel.app'
]
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))

app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tvkzth2.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri)

let db, usersCollection, roadmapCollection, upvotesCollection, commentsCollection

async function connectDB() {
  try {
    await client.connect()
    db = client.db("roadmap")
    usersCollection = db.collection("users")
    roadmapCollection = db.collection("roadmaps")
    upvotesCollection = db.collection("upvotes")
    commentsCollection = db.collection("comments")

    await usersCollection.createIndex({ email: 1 }, { unique: true })
    await upvotesCollection.createIndex({ userId: 1, roadmapId: 1 }, { unique: true })
    await commentsCollection.createIndex({ roadmapId: 1 })
    await commentsCollection.createIndex({ parentId: 1 })

    console.log("MongoDB Database connected successfully!")
  } catch (err) {
    console.error("MongoDB connection error:", err)
    process.exit(1)
  }
}

connectDB().then(() => {
  const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ message: 'Authentication required: No token provided' })
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' })
      }
      req.userId = decoded.id
      next()
    })
  }
  app.post('/auth/signup', async (req, res) => {
    const { username, email, password } = req.body
    if (!username || !email || !password) return res.status(400).json({ message: "All fields are required" })
    if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters long" })
    try {
      const existingUser = await usersCollection.findOne({ email })
      if (existingUser) return res.status(400).json({ message: "User with this email already exists" })
      const hashedPassword = await bcrypt.hash(password, 10)
      const newUser = { username, email, password: hashedPassword, createdAt: new Date() }
      const result = await usersCollection.insertOne(newUser)
      const userIdString = result.insertedId.toString()
      const token = jwt.sign({ id: userIdString }, process.env.JWT_SECRET, { expiresIn: '1d' })
      res.status(201).json({
        success: true,
        user: { _id: userIdString, username: newUser.username, email: newUser.email },
        token
      })
    } catch (err) {
      res.status(500).json({ message: "Error creating user", details: err.message })
    }
  })

  app.post('/auth/signin', async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" })
    try {
      const user = await usersCollection.findOne({ email })
      if (!user || !(await bcrypt.compare(password, user.password))) return res.status(400).json({ message: "Invalid credentials (email or password)" })
      const userIdString = user._id.toString()
      const token = jwt.sign({ id: userIdString }, process.env.JWT_SECRET, { expiresIn: '1d' })
      res.status(200).json({
        token,
        user: { _id: userIdString, username: user.username, email: user.email }
      })
    } catch (err) {
      res.status(500).json({ message: "Error authenticating user", details: err.message })
    }
  })

  app.get('/upvotes/status', verifyToken, async (req, res) => {
    const { roadmapId } = req.query
    const userId = req.userId
    if (!roadmapId || !ObjectId.isValid(roadmapId)) return res.status(400).json({ message: "Invalid roadmap ID" })
    try {
      const existingUpvote = await upvotesCollection.findOne({ userId: new ObjectId(userId), roadmapId: new ObjectId(roadmapId) })
      res.status(200).json({ hasUpvoted: !!existingUpvote })
    } catch (err) {
      res.status(500).json({ message: "Failed to check upvote status", details: err.message })
    }
  })

  app.get('/users', verifyToken, async (req, res) => {
    try {
      const users = await usersCollection.find({}, { projection: { password: 0, createdAt: 0 } }).toArray()
      const formattedUsers = users.map(user => ({ ...user, _id: user._id.toString() }))
      res.status(200).json(formattedUsers)
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch users", details: err.message })
    }
  })

  app.get('/roadmaps', async (req, res) => {
    try {
      const { status, category, sort } = req.query
      const filter = {}
      if (status) {
        const statusArray = status.split(',').map(s => s.trim()).filter(s => s !== '')
        if (statusArray.length > 0) filter.status = { $in: statusArray }
      }
      if (category) {
        const categoryArray = category.split(',').map(c => c.trim()).filter(c => c !== '')
        if (categoryArray.length > 0) filter.category = { $in: categoryArray }
      }
      const sortOptions = {}
      if (sort === 'upvotes') sortOptions.upvoteCount = -1
      else if (sort === 'newest') sortOptions.createdAt = -1
      else if (sort === 'oldest') sortOptions.createdAt = 1
      else sortOptions.createdAt = -1
      const roadmapItems = await roadmapCollection.find(filter).sort(sortOptions).toArray()
      res.json(roadmapItems)
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch roadmap items', details: err.message })
    }
  })

  app.put('/roadmaps/:roadmapId/upvote', verifyToken, async (req, res) => {
    const { roadmapId } = req.params
    const userId = req.userId
    if (!ObjectId.isValid(roadmapId)) return res.status(400).json({ message: "Invalid roadmap ID format" })
    try {
      const roadmapObjectId = new ObjectId(roadmapId)
      const userObjectId = new ObjectId(userId)
      const existingUpvote = await upvotesCollection.findOne({ userId: userObjectId, roadmapId: roadmapObjectId })
      if (existingUpvote) return res.status(409).json({ success: false, message: "You have already upvoted this roadmap." })
      else {
        await upvotesCollection.insertOne({ userId: userObjectId, roadmapId: roadmapObjectId, createdAt: new Date() })
        const updateResult = await roadmapCollection.updateOne({ _id: roadmapObjectId }, { $inc: { upvoteCount: 1 } })
        if (updateResult.modifiedCount === 0) return res.status(404).json({ success: false, message: "Roadmap not found." })
      }
      const updatedRoadmap = await roadmapCollection.findOne({ _id: roadmapObjectId })
      res.status(200).json({ success: true, message: "Roadmap upvoted successfully", roadmap: updatedRoadmap })
    } catch (err) {
      if (err.code === 11000 && err.message.includes('upvotes.$userId_1_roadmapId_1')) {
        return res.status(409).json({ success: false, message: "You have already upvoted this roadmap." })
      }
      res.status(500).json({ message: "Failed to upvote roadmap", details: err.message })
    }
  })

  app.put('/roadmaps/:roadmapId/status', verifyToken, async (req, res) => {
    const { roadmapId } = req.params
    const { status } = req.body
    const allowedStatuses = ['Not Started', 'In Progress', 'Completed', 'Planned']
    if (!status || !allowedStatuses.includes(status)) return res.status(400).json({ message: "Invalid or missing status" })
    if (!ObjectId.isValid(roadmapId)) return res.status(400).json({ message: "Invalid roadmap ID format" })
    try {
      const result = await roadmapCollection.updateOne({ _id: new ObjectId(roadmapId) }, { $set: { status } })
      if (result.modifiedCount === 0) return res.status(404).json({ message: "Roadmap not found or status unchanged" })
      const updatedRoadmap = await roadmapCollection.findOne({ _id: new ObjectId(roadmapId) })
      res.json({ success: true, message: "Roadmap status updated successfully", roadmap: updatedRoadmap })
    } catch (err) {
      res.status(500).json({ message: "Server error updating roadmap status", details: err.message })
    }
  })


  app.post('/comments', verifyToken, async (req, res) => {
    const { roadmapId, stepId, content, parentId } = req.body
    if (!content || typeof content !== 'string' || content.trim().length === 0 || content.length > 300) {
      return res.status(400).json({ message: "Comment content is required and must be between 1 and 300 characters." })
    }
    if (!ObjectId.isValid(roadmapId)) return res.status(400).json({ message: "Invalid roadmap ID format" })
    if (parentId && !ObjectId.isValid(parentId)) return res.status(400).json({ message: "Invalid parent ID format" })

    const commentData = {
      roadmapId: new ObjectId(roadmapId),
      stepId: stepId || null,
      userId: new ObjectId(req.userId),
      content: content.trim(),
      parentId: parentId ? new ObjectId(parentId) : null,
      nestingLevel: parentId ? 1 : 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    try {
      const result = await commentsCollection.insertOne(commentData)
      const user = await usersCollection.findOne({ _id: new ObjectId(req.userId) }, { projection: { username: 1 } })
      const responseComment = {
        ...commentData, 
        _id: result.insertedId.toString(), 
        userId: req.userId, 
        user: user ? { _id: user._id.toString(), username: user.username } : null
      }
      res.status(201).json({
        success: true,
        message: "Comment added successfully",
        comment: responseComment 
      })
    } catch (err) {
      res.status(500).json({ message: "Failed to post comment", details: err.message })
    }
  })
  app.get('/comments/:roadmapId', async (req, res) => {
    const { roadmapId } = req.params
    if (!ObjectId.isValid(roadmapId)) {
      return res.status(400).json({ message: "Invalid roadmap ID format" })
    }
    try {
      const comments = await commentsCollection.aggregate([
        {
          $match: { roadmapId: new ObjectId(roadmapId) }
        },{
          $lookup: {
            from: "users",         
            localField: "userId",   
            foreignField: "_id",   
            as: "authorInfo"        
          }
        },{
          $unwind: {
            path: "$authorInfo",
            preserveNullAndEmptyArrays: true 
          }
        },{
          $project: {
            _id: { "$toString": "$_id" },
            roadmapId: { "$toString": "$roadmapId" },
            stepId: 1,
            content: 1,
            userId: { "$toString": "$userId" }, 
            parentId: {
              $cond: { if: "$parentId", then: { "$toString": "$parentId" }, else: null }
            },
            nestingLevel: 1,
            createdAt: 1,
            updatedAt: 1,
            user: {
              $cond: {
                if: "$authorInfo._id",
                then: {
                  _id: { "$toString": "$authorInfo._id" }, 
                  username: "$authorInfo.username"         
                },
                else: null 
              }
            }}},
        {
          $sort: { createdAt: 1 }
        }
      ]).toArray()

      res.json(comments)
    } catch (err) {
      res.status(500).json({ message: "Failed to load comments", details: err.message })
    }
  })
  app.put('/comments/:id', verifyToken, async (req, res) => {
    const { content } = req.body
    if (!content || content.length > 300) return res.status(400).json({ message: "Invalid content" })
    try {
      const result = await commentsCollection.updateOne(
        { _id: new ObjectId(req.params.id), userId: new ObjectId(req.userId) },
        { $set: { content: content.trim(), updatedAt: new Date() } }
      )
      if (result.modifiedCount === 0) return res.status(403).json({ message: "Unauthorized or no change" })
      res.json({ success: true, message: "Comment updated successfully" }) 
    } catch (err) {
      res.status(500).json({ message: "Error updating comment", details: err.message }) 
    }
  })
  app.delete('/comments/:id', verifyToken, async (req, res) => {
    try {
      const result = await commentsCollection.deleteOne({
        _id: new ObjectId(req.params.id),
        userId: new ObjectId(req.userId)
      })
      if (result.deletedCount === 0) return res.status(403).json({ message: "Unauthorized or not found" })
      res.json({ success: true, message: "Comment deleted successfully" }) 
    } catch (err) {
      res.status(500).json({ message: "Error deleting comment", details: err.message }) 
    }
  })
  app.get('/', (req, res) => {
    res.send('Roadmap API is running!')
  })
  app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
}).catch(err => {
  console.error("Failed to start server due to DB connection issue:", err)
})
