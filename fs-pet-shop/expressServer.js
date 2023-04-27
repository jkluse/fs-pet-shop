import express from "express";
import fs from "fs";
const app = express();

let petRegExp = /^\/pets\/(.*)$/;
let hasPetInPath;
let matchPets;
let index;
let dataLength;

app.use((req, res, next) => {
	hasPetInPath = petRegExp.test(req.url);
	matchPets = req.url.match(petRegExp);
	index = req.url.match(petRegExp)?.[1];

	fs.readFile("pets.json", "utf-8", function (err, petsJSON) {
		dataLength = JSON.parse(petsJSON).length;
	});

	next();
});

// All pets
app.get("/pets", (req, res) => {
	console.log("Accessing /pets");
	fs.readFile("pets.json", "utf-8", function (err, petsJSON) {
		res.setHeader("Content-Type", "application/json");
		res.statusCode = 200;
		res.end(petsJSON);
	});
});

// Dynamic pet index
app.use((req, res, next) => {
	// If there is a valid index, return pet data
	// console.log(hasPetInPath);
	// console.log(matchPets);
	// not valid
	if (index === undefined || isNaN(index) || index >= dataLength || index < 0) {
		res.setHeader("Content-Type", "text/plain");
		res.statusCode = 404;
		res.end("Sorry...Not Found");
		return;
	}
	next();
});

app.get("/pets/*", (req, res) => {
	fs.readFile("pets.json", "utf-8", function (err, petsJSON) {
		res.setHeader("Content-Type", "application/json");
		res.statusCode = 200;
		let petsObj = JSON.parse(petsJSON);
		let petJSON = JSON.stringify(petsObj[index]);
		res.end(petJSON);
	});
});

// Default route
app.get("*", (req, res) => {
	res.setHeader("Content-Type", "text/plain");
	res.statusCode = 404;
	res.end("Not Found!");
});

// listen on port
app.listen(8800, () => console.log("Server listening on port 8800"));
