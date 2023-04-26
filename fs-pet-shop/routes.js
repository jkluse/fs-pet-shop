import fs from "node:fs";

const routes = {
	"/pets": function (req, res) {
		fs.readFile("pets.json", "utf-8", function (err, petsJSON) {
			res.setHeader("Content-Type", "application/json");
			res.statusCode = 200;
			res.end(petsJSON);
		});
	},
	"/pets/0": function (req, res) {
		fs.readFile("pets.json", "utf-8", function (err, petsJSON) {
			res.setHeader("Content-Type", "application/json");
			res.statusCode = 200;
			let petsObj = JSON.parse(petsJSON);
			let petJSON = JSON.stringify(petsObj[0]);
			res.end(petJSON);
		});
	},
	"/pets/1": function (req, res) {
		fs.readFile("pets.json", "utf-8", function (err, petsJSON) {
			res.setHeader("Content-Type", "application/json");
			res.statusCode = 200;
			let petsObj = JSON.parse(petsJSON);
			let petJSON = JSON.stringify(petsObj[1]);
			res.end(petJSON);
		});
	},
};

export default routes;
