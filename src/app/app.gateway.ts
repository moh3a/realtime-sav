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

type CollectionsNames =
  | "clients"
  | "entries"
  | "deliveries"
  | "products"
  | "jobs"
  | "prestations"
  | "prestationDetails"
  | "users"
  | "transactions"
  | "orders";

@WebSocketGateway({ cors: { origin: "http://localhost:3000" } })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;
  private logger = new Logger("AppGateway");

  afterInit() {
    this.logger.log("🥳 Socket initialized!");
  }

  handleConnection(client: Socket) {
    this.logger.log(`🙂 Client ${client.id} connected`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`🙁 Client ${client.id} disconnected`);
  }

  @SubscribeMessage("action")
  handleMessage(client: Socket, payload: CollectionsNames): void {
    this.wss.emit("reaction", payload);
    this.logger.log(`✍️ ${client.id} revalidated ${payload}`);
  }
}
