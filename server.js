const express = require("express");
const path = require("path");
const app = express();
// const PORT = process.env.PORT || 3000;

// Serve static assets from react build
// app.use("/", express.static(path.join(__dirname, "client/public")));
app.use("/static", express.static(path.join(__dirname, 'client/build/static')));
app.use("/src", function (req, res) {
	console.log(path.join(__dirname, "src"));
	res.sendFile(path.join(__dirname, "client/src"));
});

app.use(function (err, req, res, next) {
	console.error(err.stack);
	res.status(500).send("Something broke!");
});

// // Start the API server
// app.listen(PORT, function () {
// 	console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
// });
