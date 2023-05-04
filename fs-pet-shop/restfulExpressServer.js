import express from "express";
import fs from "fs/promises";

const server = express();
const port = 3000;

const postErr =
	'| Request Method | Request URL | Request Body | Response Status | Response Content-Type | Response Body | | -------------- | ----------- | ------------------------------------------ | --------------- | --------------------- | ------------- | --- | | POST | /pets | { "name": "", "age": "two", "kind": "" } | 400 | text/plain | Bad Request | |';

// JSON parser for POST reqs
server.use(express.json());

server.post("/pets", (req, res) => {
	// Get post info from req body
	// Create new pet
	const { age, name, kind } = req.body;

	if (name && kind && Number.isInteger(age)) {
		const pet = { age, name, kind };

		// Add it to pets.json
		fs.readFile("pets.json", "utf-8").then((data) => {
			const pets = JSON.parse(data);
			pets.push(pet);
			return fs
				.writeFile("pets.json", JSON.stringify(pets))
				.then(() => {
					res.status(201).send(pet);
				})
				.catch((err) => {
					throw err;
				});
		});
	} else {
		res.status(400).send(postErr);
	}
});

server.get("/pets/:petIndex", (req, res) => {
	let i = Number(req.params.petIndex);
	fs.readFile("pets.json", "utf-8")
		.then((petsJSON) => {
			if (i === undefined) {
				res.sendStatus(404);
				return;
			} else {
				const str = JSON.parse(petsJSON);
				if (str[i] === undefined) {
					res.sendStatus(404);
					return;
				}
				res.set("Content-Type", "application/json");
				res.send(str[i]);
			}
		})
		.catch((err) => {
			throw err;
		});
});

server.patch("/pets/:petIndex", (req, res) => {
	const { age, name, kind } = req.body;
	const key = Object.keys(req.body)[0];
	const val = req.body[key];

	console.log(typeof key, key);
	// guard clauses
	if (key === "age" && !Number.isInteger(+age)) {
		res.status(400).send();
		return;
	} else if (typeof req.body[key] !== "string") {
		res.status(400).send();
		return;
	}

	// happy path
	fs.readFile("pets.json", "utf-8")
		.then((petsJSON) => {
			const arr = JSON.parse(petsJSON);
			console.log(arr);
			// find index in pets.json
			let i = Number(req.params.petIndex);
			if (arr[i] === undefined) {
				res.sendStatus(400);
				return;
			}
			// update index
			arr[i][key] = val;
			return fs.writeFile("pets.json", JSON.stringify(arr)).then(() => {
				res.status(201).json(arr[i]);
			});
		})
		.catch((err) => {
			if (err) throw err;
		});
});

server.delete("/pets/:petIndex", (req, res) => {
	// read file
	fs.readFile("pets.json", "utf-8")
		.then((petsJSON) => {
			const arr = JSON.parse(petsJSON);
			console.log(arr);
			// find index in pets.json
			let i = Number(req.params.petIndex);
			let pet = arr[i];
			if (arr[i] === undefined) {
				res.sendStatus(400);
				return;
			}
			// delete index
			arr.splice(i, 1);
			return fs.writeFile("pets.json", JSON.stringify(arr)).then(() => {
				res.status(200).json(pet);
			});
		})
		.catch((err) => {
			if (err) throw err;
		});
});

// default route
server.get("/*", (req, res) => {
	res.status(404).send();
});

server.listen(port, () => console.log(`Listening on port ${port}`));
