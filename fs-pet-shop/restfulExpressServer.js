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

server.get("/pets", (req, res) => {
	fs.readFile("pets.json", "utf-8").then((petsJSON) => {
		petsJSON = JSON.parse(petsJSON);
		res.json(petsJSON);
	});
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
	// get data to update
	const { age, name, kind } = req.body;
	const petToUpdate = { age, name, kind };
	const key = Object.keys(req.body)[0];
	const val = req.body[key];

	// guard clauses age is INT and name/kind
	if (!age && !name && !kind) {
		res.sendStatus(400);
		return;
	}
	if ((age !== undefined && typeof age !== "number") || age < 0) {
		res.sendStatus(400);
		return;
	}

	// happy path
	fs.readFile("pets.json", "utf-8")
		.then((petsJSON) => {
			const arr = JSON.parse(petsJSON);

			// index must be in range
			let i = Number(req.params.petIndex);
			if (arr[i] === undefined) {
				res.sendStatus(400);
				return;
			}
			// create updated obj
			let updatedPet = {};
			for (let prop in petToUpdate) {
				if (petToUpdate[prop]) {
					updatedPet[prop] = petToUpdate[prop];
				}
			}
			// find index in pets.json
			// update index
			arr[i] = { ...arr[i], ...updatedPet };
			return fs.writeFile("pets.json", JSON.stringify(arr)).then(() => {
				res.status(200).json(arr[i]);
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
