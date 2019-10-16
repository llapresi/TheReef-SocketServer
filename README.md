# TheReef-SocketServer
WebSocket Server and web app component of [The Reef](https://lukelapresi.com/the-reef).
Host webapp for phone which sends commands to this socket server, which in turn sends commands to to Unity client.
Utilizes [Gyronorm.js](https://github.com/dorukeker/gyronorm.js/) for consistent crossplatform orientation data.

## Outline
* "/clients" folder contains modules handling sending messages to clients
* "/socket-events" folder contains modules handling events (reciving messages and clients connecting/disconnecting)
* "/static" folder contains source for web app used by phone clients.
* "/utils" folder contains misc. modules
* "server.js" file contain sapp entry point and client connection logic.

## To Install
1. Clone this repo
2. Run "npm install" in folder
3. In Unity project set "SocketConnection -> SocketTest (Script)" Server URL to "ws://localhost:3000"
