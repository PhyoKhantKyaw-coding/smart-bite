import * as signalR from "@microsoft/signalr";
import axios from "axios";

export interface OrderDeliveryLocationUpdate {
  orderId: string;
  deliveryId: string;
  deliveryName: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private connectionPromise: Promise<void> | null = null;

  constructor() {
    this.initializeConnection();
  }

  private initializeConnection() {
    // Get the API base URL from environment or use default (same as axios)
    const apiBaseUrl = (axios.defaults.baseURL || 'https://localhost:7112/').replace(/\/$/, '');
    const hubUrl = `${apiBaseUrl}/deliveryTrackingHub`;

    console.log("SignalR Hub URL:", hubUrl); // Debug log

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        skipNegotiation: false,
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.ServerSentEvents | signalR.HttpTransportType.LongPolling,
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          if (retryContext.previousRetryCount < this.maxReconnectAttempts) {
            return Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 30000);
          }
          return null;
        },
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.setupConnectionHandlers();
  }

  private setupConnectionHandlers() {
    if (!this.connection) return;

    this.connection.onreconnecting((error) => {
      console.log("SignalR reconnecting...", error);
    });

    this.connection.onreconnected((connectionId) => {
      console.log("SignalR reconnected:", connectionId);
      this.reconnectAttempts = 0;
    });

    this.connection.onclose((error) => {
      console.log("SignalR connection closed:", error);
      this.connectionPromise = null;
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        setTimeout(() => this.startConnection(), 5000);
      }
    });
  }

  async startConnection(): Promise<void> {
    if (!this.connection) {
      throw new Error("Connection not initialized");
    }

    // If already connected, return immediately
    if (this.connection.state === signalR.HubConnectionState.Connected) {
      return;
    }

    // If connecting, wait for the existing connection attempt
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    // If already connecting, wait
    if (this.connection.state === signalR.HubConnectionState.Connecting) {
      // Wait for connection to complete
      return new Promise((resolve, reject) => {
        const checkConnection = setInterval(() => {
          if (this.connection?.state === signalR.HubConnectionState.Connected) {
            clearInterval(checkConnection);
            resolve();
          } else if (this.connection?.state === signalR.HubConnectionState.Disconnected) {
            clearInterval(checkConnection);
            reject(new Error("Connection failed"));
          }
        }, 100);
      });
    }

    // Start new connection
    this.connectionPromise = (async () => {
      try {
        if (this.connection!.state === signalR.HubConnectionState.Disconnected) {
          await this.connection!.start();
          console.log("SignalR connected successfully");
        }
      } catch (error) {
        console.error("Error starting SignalR connection:", error);
        this.connectionPromise = null;
        throw error;
      }
    })();

    return this.connectionPromise;
  }

  async stopConnection(): Promise<void> {
    if (this.connection && this.connection.state !== signalR.HubConnectionState.Disconnected) {
      await this.connection.stop();
      console.log("SignalR connection stopped");
      this.connectionPromise = null;
    }
  }

  // Subscribe to specific order tracking
  async subscribeToOrder(orderId: string): Promise<void> {
    try {
      // Ensure connection is established
      await this.startConnection();

      // Double check connection state
      if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
        throw new Error("Connection not in Connected state");
      }

      await this.connection.invoke("SubscribeToOrder", orderId);
      console.log(`Subscribed to order: ${orderId}`);
    } catch (error) {
      console.error("Error subscribing to order:", error);
      throw error;
    }
  }

  // Unsubscribe from order tracking
  async unsubscribeFromOrder(orderId: string): Promise<void> {
    if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
      try {
        await this.connection.invoke("UnsubscribeFromOrder", orderId);
        console.log(`Unsubscribed from order: ${orderId}`);
      } catch (error) {
        console.error("Error unsubscribing from order:", error);
      }
    }
  }

  // Listen for order delivery location updates
  onOrderDeliveryLocationUpdate(callback: (data: OrderDeliveryLocationUpdate) => void): void {
    if (!this.connection) return;

    this.connection.on("ReceiveOrderDeliveryLocationUpdate", (data: OrderDeliveryLocationUpdate) => {
      console.log("Received delivery location update:", data);
      callback(data);
    });
  }

  // Remove listener
  offOrderDeliveryLocationUpdate(): void {
    if (this.connection) {
      this.connection.off("ReceiveOrderDeliveryLocationUpdate");
    }
  }

  // Get connection state
  getConnectionState(): signalR.HubConnectionState {
    return this.connection?.state || signalR.HubConnectionState.Disconnected;
  }

  // Check if connected
  isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }
}

// Export singleton instance
export const signalRService = new SignalRService();
