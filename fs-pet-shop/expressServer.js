import express from "express";
import fs from "fs";
const app = express();

// handle requests w/Express
app.get("/pets", (req, res) => {
	fs.readFile("pets.json", "utf-8", function (err, petsJSON) {
		res.setHeader("Content-Type", "application/json");
		res.statusCode = 200;
		res.end(petsJSON);
	});
});

app.get("/pets/0", (req, res) => {
	fs.readFile("pets.json", "utf-8", function (err, petsJSON) {
		res.setHeader("Content-Type", "application/json");
		res.statusCode = 200;
		let petsObj = JSON.parse(petsJSON);
		let petJSON = JSON.stringify(petsObj[0]);
		res.end(petJSON);
	});
});

app.get("/pets/1", (req, res) => {
	fs.readFile("pets.json", "utf-8", function (err, petsJSON) {
		res.setHeader("Content-Type", "application/json");
		res.statusCode = 200;
		let petsObj = JSON.parse(petsJSON);
		let petJSON = JSON.stringify(petsObj[1]);
		res.end(petJSON);
	});
});

app.get("*", (req, res) => {
	res.setHeader("Content-Type", "text/plain");
	res.statusCode = 404;
	res.end("Not Found");
});

// listen on port
app.listen(8800, () => console.log("Server listening on port 8800"));
