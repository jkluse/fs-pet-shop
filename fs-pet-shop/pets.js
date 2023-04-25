import process from "node:process";
import fs from "fs";
import { type } from "node:os";

const subcommand = process.argv[2];
const index = process.argv[3];
const args = process.argv;

fs.readFile("pets.json", "utf-8", function (err, data) {
	if (err) throw err;

	const objData = JSON.parse(data);
	if (subcommand === "read") {
		if (index === undefined || +index >= objData.length || +index < 0) {
			console.log("Usage: node pets.js read INDEX");
		} else {
			console.log(objData[index]);
		}
	} else if (subcommand === "create") {
		if (process.argv.length !== 6) {
			console.log("Usage: node pets.js create AGE KIND NAME");
		} else {
			let newRecord = {
				age: +args[3],
				kind: args[4],
				name: args[5],
			};
			objData.push(newRecord);
			// console.log(JSON.stringify(objData));
			fs.writeFile("pets.json", JSON.stringify(objData), function (err) {
				if (err) throw err;
				console.log(newRecord);
			});
		}
	} else if (subcommand === "update") {
		console.log("updating");
		if (process.argv.length !== 7) {
			console.log("Usage: node pets.js update INDEX AGE KIND NAME");
		} else {
			let arrIndex = +args[3];
			if (arrIndex >= objData.length || arrIndex < 0) {
				console.log("INDEX is out of bounds, dude");
				return;
			}
			objData[arrIndex] = {
				age: +args[4],
				kind: args[5],
				name: args[6],
			};
			fs.writeFile("pets.json", JSON.stringify(objData), function (err) {
				if (err) throw err;
				console.log(objData[arrIndex]);
			});
		}
	} else if (subcommand === "destroy") {
		console.log("destroying");
	} else {
		console.error("Usage: node pets.js [read | create | update | destroy]");
		process.exit(1);
	}
});
