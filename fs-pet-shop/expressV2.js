import express from "express";
import fs from "fs";

// create server
const app = express();
const port = 3000;
let dataLen;
let i;
// set variables
app.use((req, res, next) => {
	let file = fs.readFileSync("pets.json", "utf-8");
	dataLen = JSON.parse(file).length;

	next();
});

//create routes
app.get("/pets", (req, res) => {
	fs.readFile("pets.json", "utf-8", function (err, petsJSON) {
		res.set("Content-Type", "application/json");
		res.send(petsJSON);
	});
});

// dynamic pet route
app.get("/pets/:petIndex", (req, res) => {
	i = Number(req.params.petIndex);
	console.log(i);
	console.log(dataLen);
	if (i === undefined || isNaN(i) || i >= dataLen || i < 0) {
		res.sendStatus(404);
		return;
	} else {
		fs.readFile("pets.json", "utf-8", function (err, petsJSON) {
			const str = JSON.parse(petsJSON);
			res.set("Content-Type", "application/json");
			res.send(str[i]);
		});
	}
});

// start running
app.listen(port, () => console.log(`Listening on port ${port}`));
