import axios from "axios";
import WebSocket from "ws";
import { MoneriumClient } from "@monerium/sdk";
const client = new MoneriumClient();

const clientId = "YOUR_CLIENT_ID";
const clientSecret = "YOUR_CLIENT_SECRET";
const actionWebhookUrl = "YOUR_ACTION_WEBHOOK_URL";

const scope = "orders:read";
const tokenUrl = "https://api.monerium.dev/auth/token";
const webSocketUrl = "wss://api.monerium.dev/orders";

const getWebSocketOrdersUrl = (accessToken: string) => {
  return `${webSocketUrl}?access_token=${accessToken}`;
};

async function main() {
  await client.auth({
    client_id: clientId,
    client_secret: clientSecret,
  });

  try {
    const tokenResponse = await axios.post(tokenUrl, null, {
      auth: {
        username: clientId,
        password: clientSecret,
      },
      params: {
        grant_type: "client_credentials",
        scope,
      },
    });

    const openDoor = async () => {
      try {
        await axios.post(actionWebhookUrl);
        console.log("***** Door opened! *****");
      } catch (error) {
        console.error("Door webhook error: ", error);
      }
    };

    const accessToken = tokenResponse.data.access_token;

    const ws = new WebSocket(getWebSocketOrdersUrl(accessToken));

    ws.on("open", () => {
      console.log("WebSocket connection opened.");
    });

    ws.on("message", (data) => {
      const jsonString = data.toString();
      const order = JSON.parse(jsonString);

      // only open if amount is above threshold?
      // => amount > 50

      // only open if order is from a specific IBAN?
      // => counterpart.identifier.iban === "ISXXXXXXXXXXXXXXXXXXXXXXX"

      // only open if memo is not HODOR?
      // => order.memo !== "HODOR"

      if (order.meta.state === "processed" && order.kind === "issue") {
        openDoor();
      }
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });

    ws.on("close", (code, reason) => {
      console.log(
        `WebSocket connection closed. Code: ${code}, Reason: ${reason}`
      );
    });
  } catch (error) {
    console.error("Some awesome error!", error);
  }
}

main();
