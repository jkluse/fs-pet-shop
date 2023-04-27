import http from "http";
import fs from "node:fs";
import routes from "./routes.js";

let server = http.createServer(function (req, res) {
	const petRegExp = /^\/pets\/(.*)$/;
	const hasPetInPath = petRegExp.test(req.url);

	if (hasPetInPath && req.method === "GET") {
		// --> pets path

		let resource = req.url.match(petRegExp)[1];
		if (req.url.match(petRegExp)) {
			fs.readFile("pets.json", "utf-8", function (err, petsJSON) {
				res.setHeader("Content-Type", "application/json");

				// All pets
				if (resource === "") {
					res.end(petsJSON);
				} else {
					// pets/num
					let petsObj = JSON.parse(petsJSON);
					if (petsObj[resource] === undefined) {
						returnNotFound();
					}
					let petJSON = JSON.stringify(petsObj[+resource]);
					res.end(petJSON);
				}
			});
		}
	} else {
		// --> default case (ie. no valid path)
		returnNotFound();
	}

	// if (routes[req.url] !== undefined && req.method === "GET") {
	// 	routes[req.url](req, res);
	// } else {
	// 	res.setHeader("Content-Type", "text/plain");
	// 	res.statusCode = 404;
	// 	res.end("Not Found");
	// }

	function returnNotFound() {
		res.setHeader("Content-Type", "text/plain");
		res.statusCode = 404;
		res.end("Not Found");
	}
});

server.listen(8000, function () {
	console.log("Listening on port 8000");
});
