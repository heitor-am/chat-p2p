const net = require("net");

module.exports = class Peer {
	constructor(port, username) {
		this.port = port;
		this.username = username;
		this.logs = [];
		this.connections = [];
		
		const server = net.createServer( (socket) => {
			this.onSocketConnected(socket)
		});

		server.listen(port, () => console.log("Ouvindo porta " + port) );
	}

	connectTo(address) {
		if(address.split(":").length !== 2)
			throw Error("O endereço do outro peer deve ser composto por host:port ");

		const [ host, port ] = address.split(":");

		const socket = net.createConnection({ port, host }, () =>
			this.onSocketConnected(socket)
		);
	}

	onSocketConnected(socket) {
		this.connections.push(socket);
		
		socket.on('data', (data) =>
			this.onData(socket, data)
		);

		socket.on('close', () => {
			this.connections = this.connections.filter( conn => {
				return conn !== socket;
			})
		});

		this.onConnection(socket);
	}

	onConnection(socket) {}

	onData(socket, data) {}

	onMessage(data) {
		this.logs.push(data);
	}

	broadcast(data) {
		this.connections.forEach( socket => socket.write(data) );
	}
}
