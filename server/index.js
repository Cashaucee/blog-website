const express = require("express");
const mongoose = require("mongoose");


//Allow our backend application to be available to our frontend application
//Allows us to controll the app's Cross Origin Resource Sharing Settings
const cors = require("cors");

const userRoutes = require("./routes/user");
/* ACTIVITY SOLUTION START */
const postRoutes = require("./routes/post");
const commentRoutes = require("./routes/comment");



//[SECTION] Environment setup
//const port = 4000;
require('dotenv').config();

const app = express();

app.use(express.json());

// Configure CORS: allow the frontend origin (default Vite dev server)
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const corsOptions = {
	origin: CLIENT_URL,
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true,
	optionsSuccessStatus: 200
};

app.use(cors(corsOptions));


//[SECTION] Database Connection
//Connect to our MongoDB database
mongoose.connect(process.env.MONGODB_STRING);

mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas.'))


app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);


if(require.main === module) {

	app.listen(process.env.PORT || 3000, () => {
		console.log(`API is now online on port ${process.env.PORT || 3000}`);
	})
}

module.exports = { app, mongoose };