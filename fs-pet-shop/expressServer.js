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

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));

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

app.post("/pets", (req, res) => {
	const body = req.body;

	// update pets.json
	if (body.name && body.kind && Number.isInteger(body.age)) {
		let petsObj = fs.readFileSync("pets.json", "utf-8");
		petsObj = JSON.parse(petsObj);
		petsObj.push(body);
		fs.writeFile("pets.json", JSON.stringify(petsObj), (err) => {
			if (err) throw err;
			res.send(body);
		});
	} else {
		res.sendStatus(400);
	}
});

app.use((err, req, res, next) => {});

// start running
app.listen(port, () => console.log(`Listening on port ${port}`));
