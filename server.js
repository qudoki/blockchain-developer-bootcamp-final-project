const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static assets from react build
// app.use(express.static("client/build"));
app.use(express.static(path.join(__dirname, 'build')));
app.get("/", function (req, res) {
	console.log(path.join(__dirname, "build"));
	res.sendFile(path.join(__dirname, "/build/index.html"));
});

// Start the API server
app.listen(PORT, function () {
	console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});
