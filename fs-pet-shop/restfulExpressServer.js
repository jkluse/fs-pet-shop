import express from "express";
import fs from "fs/promises";
import pg from "pg";
const server = express();
const port = 3000;

const db = new pg.Pool({
	database: "petshop",
});

// JSON parser for POST reqs
server.use(express.json());

server.post("/pets", (req, res) => {
	const { age, name, kind } = req.body;

	if (name && kind && Number.isInteger(age)) {
		db.query("INSERT INTO pet(name, kind, age) VALUES ($1, $2, $3) RETURNING *", [name, kind, age], (err, result) => {
			if (err) throw err;
			res.status(201).json(result.rows[0]);
		});
	} else {
		res.status(400).send();
	}
});

server.get("/pets", (req, res) => {
	db.query("SELECT * FROM pet", [], (err, result) => {
		if (err) throw err;
		res.json(result.rows);
	});
});

server.get("/pets/:petIndex", (req, res) => {
	let i = Number(req.params.petIndex);
	if (!Number.isInteger(i)) {
		res.status(422).send();
	}

	db.query("SELECT * FROM pet WHERE id = $1", [i], (err, result) => {
		console.log(result.rows.length);
		if (err) throw err;
		if (result.rows.length === 0) {
			res.status(404).send();
		} else {
			console.log("has rows");
			res.json(result.rows[0]);
		}
	});
});

server.patch("/pets/:petIndex", (req, res) => {
	const { age, name, kind } = req.body;
	let i = Number(req.params.petIndex);

	// guard clauses age is INT
	if ((age !== undefined && typeof age !== "number") || age < 0) {
		res.sendStatus(400);
		return;
	}

	db.query("UPDATE pet SET age = COALESCE($1, age), kind = COALESCE($2, kind), name = COALESCE($3, name) WHERE id = $4 RETURNING *", [age, kind, name, i], (err, result) => {
		if (err) throw err;
		if (result.rows.length === 0) {
			res.sendStatus(404);
		} else {
			res.status(201).send(result.rows[0]);
		}
	});
	return;
});

server.delete("/pets/:petIndex", (req, res) => {
	let i = Number(req.params.petIndex);

	db.query("DELETE FROM pet WHERE id = $1 RETURNING *", [i], (err, result) => {
		if (err) throw err;
		if (result.rows.length === 0) {
			res.sendStatus(404);
		} else {
			res.status(200).json(result.rows[0]);
		}
	});
	return;
});

// default route
server.get("/*", (req, res) => {
	res.status(404).send();
});

server.listen(port, () => console.log(`Listening on port ${port}`));
