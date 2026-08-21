const { app } = require("@azure/functions");
const { TableClient } = require("@azure/data-tables");
const crypto = require("node:crypto");

app.http("orders", {
  methods: ["POST", "OPTIONS"],
  authLevel: "anonymous",
  route: "orders",
  handler: async (request, context) => {
    if (request.method === "OPTIONS") return { status: 204 };
    try {
      const body = await request.json();
      const required = ["name", "phone", "email", "date", "time", "product", "details"];
      if (required.some((field) => !String(body[field] || "").trim())) {
        return { status: 400, jsonBody: { error: "Faltan datos obligatorios." } };
      }
      const orderId = crypto.randomUUID();
      const client = TableClient.fromConnectionString(process.env.AzureWebJobsStorage, "orders");
      await client.createTable();
      await client.createEntity({
        partitionKey: String(body.date), rowKey: orderId,
        createdAt: new Date().toISOString(), status: "new",
        name: String(body.name).slice(0, 120), phone: String(body.phone).slice(0, 40),
        email: String(body.email).slice(0, 180), address: String(body.address || "").slice(0, 500),
        deliveryDate: String(body.date), deliveryTime: String(body.time), delivery: String(body.delivery || "domicilio"),
        product: String(body.product), details: String(body.details).slice(0, 2000),
        estimatedTotal: Number(body.estimatedTotal || 0), estimatedDeposit: Number(body.estimatedDeposit || 0)
      });
      return { status: 201, jsonBody: { orderId, message: "Pedido recibido." } };
    } catch (error) {
      context.error(error);
      return { status: 500, jsonBody: { error: "No pudimos guardar el pedido." } };
    }
  }
});
