import http from "http";

import routes from "./routes.js";

let server = http.createServer(function (req, res) {
	if (routes[req.url] !== undefined) {
		routes[req.url](req, res);
	} else {
		res.setHeader("Content-Type", "text/plain");
		res.statusCode = 404;
		res.end("Not Found");
	}
});

server.listen(8000, function () {
	console.log("Listening on port 8000");
});
