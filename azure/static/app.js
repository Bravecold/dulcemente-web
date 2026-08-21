const products = { pastelitos: { name: "Pastelitos", base: 12000 }, mini: { name: "Mini cakes", base: 45000 }, ponque: { name: "Ponqués", base: 95000 } };
const form = document.querySelector("#order-form");
const product = document.querySelector("#product");
const delivery = document.querySelector("#delivery");
const statusBox = document.querySelector("#form-status");
const format = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
function updateTotal() {
  const total = products[product.value].base + (delivery.value === "domicilio" ? 8000 : 0);
  document.querySelector("#total").textContent = format.format(total);
  document.querySelector("#deposit").textContent = format.format(total / 2);
  return total;
}
product.addEventListener("change", updateTotal); delivery.addEventListener("change", updateTotal); updateTotal();
form.addEventListener("submit", async (event) => {
  event.preventDefault(); statusBox.textContent = "Guardando tu pedido…";
  const total = updateTotal(); const body = Object.fromEntries(new FormData(form));
  body.estimatedTotal = total; body.estimatedDeposit = total / 2;
  try {
    const response = await fetch(`${window.DULCEMENTE_API_URL}/api/orders`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    const result = await response.json(); if (!response.ok) throw new Error(result.error);
    statusBox.textContent = `¡Pedido recibido! Tu número es ${result.orderId}. Te contactaremos para confirmar y enviarte el enlace de abono.`;
    form.reset(); updateTotal();
  } catch (error) { statusBox.textContent = error.message || "No pudimos enviar el pedido. Intenta de nuevo."; }
});
