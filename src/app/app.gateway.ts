import { Logger } from "@nestjs/common";
import {
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";

@WebSocketGateway({ cors: { origin: "http://localhost:3000" } })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;
  private logger = new Logger("AppGateway");

  afterInit(server: Server) {
    this.logger.log("🥳 Socket initialized!");
    this.logger.log(server.sockets);
  }

  handleConnection(client: Socket) {
    this.logger.log(`🙂 Client ${client.id} connected`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`🙁 Client ${client.id} disconnected`);
  }

  @SubscribeMessage("action")
  handleMessage(client: Socket, payload: string): void {
    this.wss.emit("reaction", payload);
  }
}