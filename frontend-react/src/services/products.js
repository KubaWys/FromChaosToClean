const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

function getAuthHeaders() {
  const token = localStorage.getItem("authToken");
  return token ? { "Authorization": `Bearer ${token}` } : {};
}

export async function fetchProducts() {
  const res = await fetch(`${API_BASE}/products`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function createProduct(product) {
  const res = await fetch(`${API_BASE}/products`, {
    method: "POST",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(product)
  });
  if (!res.ok) throw new Error("Failed to create product");
  return res.json();
}
