import http from "http";

let server = http.createServer(function (req, res) {
	if (req.method === "GET" && req.url === "/cats") {
		res.setHeader("Content-Type", "text/plain");
		res.end("...meow");
	} else {
		res.statusCode = 404;
		res.setHeader("Content-Type", "text/plain");
		res.end("Not found");
	}
});

server.listen(8000, function () {
	console.log("Listening on port", port);
});
