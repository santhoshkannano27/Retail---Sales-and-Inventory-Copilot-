// In-memory mock data for the Retail Sales & Inventory Copilot.
// Swap this module for a real database layer (Postgres, etc.) when ready —
// every route only talks to the functions exported at the bottom of this file.

const CATEGORIES = ["Apparel", "Footwear", "Accessories", "Home Goods", "Electronics"];

const PRODUCT_SEED = [
  { name: "Classic Crew Tee", category: "Apparel", price: 24.0, cost: 8.5 },
  { name: "Relaxed Denim Jacket", category: "Apparel", price: 89.0, cost: 34.0 },
  { name: "Everyday Hoodie", category: "Apparel", price: 58.0, cost: 21.0 },
  { name: "Trail Runner Sneaker", category: "Footwear", price: 110.0, cost: 46.0 },
  { name: "Canvas Slip-On", category: "Footwear", price: 65.0, cost: 24.0 },
  { name: "Leather Ankle Boot", category: "Footwear", price: 145.0, cost: 58.0 },
  { name: "Woven Belt", category: "Accessories", price: 32.0, cost: 11.0 },
  { name: "Wool Beanie", category: "Accessories", price: 22.0, cost: 7.0 },
  { name: "Canvas Tote Bag", category: "Accessories", price: 38.0, cost: 13.0 },
  { name: "Ceramic Mug Set", category: "Home Goods", price: 29.0, cost: 9.5 },
  { name: "Linen Throw Pillow", category: "Home Goods", price: 34.0, cost: 12.0 },
  { name: "Scented Soy Candle", category: "Home Goods", price: 26.0, cost: 8.0 },
  { name: "Wireless Earbuds", category: "Electronics", price: 79.0, cost: 32.0 },
  { name: "Portable Speaker", category: "Electronics", price: 59.0, cost: 22.0 },
  { name: "Phone Charging Stand", category: "Electronics", price: 21.0, cost: 6.5 },
  { name: "Fleece Beanie", category: "Accessories", price: 19.0, cost: 6.0 },
  { name: "Performance Joggers", category: "Apparel", price: 68.0, cost: 26.0 },
  { name: "Suede Chelsea Boot", category: "Footwear", price: 132.0, cost: 52.0 },
  { name: "Bluetooth Keyboard", category: "Electronics", price: 45.0, cost: 17.0 },
  { name: "Woven Storage Basket", category: "Home Goods", price: 42.0, cost: 15.0 },
];

const SUPPLIERS = ["Meridian Textiles", "Northbound Supply Co.", "Harbor & Finch", "Atlas Goods Group"];

function seededRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function next() {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const rand = seededRandom(42);

function buildProducts() {
  return PRODUCT_SEED.map((seed, index) => {
    const stockQty = Math.floor(rand() * 140) + 5;
    const reorderPoint = 20 + Math.floor(rand() * 15);
    return {
      id: `P${String(index + 1).padStart(3, "0")}`,
      sku: `SKU-${1000 + index}`,
      name: seed.name,
      category: seed.category,
      price: seed.price,
      cost: seed.cost,
      stockQty,
      reorderPoint,
      supplier: SUPPLIERS[index % SUPPLIERS.length],
      status:
        stockQty === 0
          ? "out_of_stock"
          : stockQty <= reorderPoint
          ? "low_stock"
          : "in_stock",
    };
  });
}

function buildSalesHistory(products, days = 60) {
  const history = [];
  const today = new Date();
  for (let d = days - 1; d >= 0; d--) {
    const date = new Date(today);
    date.setDate(date.getDate() - d);
    const dateStr = date.toISOString().slice(0, 10);

    // weekday multiplier: weekends sell more
    const weekday = date.getDay();
    const weekendBoost = weekday === 0 || weekday === 6 ? 1.4 : 1.0;

    products.forEach((product) => {
      // Not every product sells every day
      if (rand() < 0.35) return;
      const baseUnits = 1 + Math.floor(rand() * 6);
      const unitsSold = Math.max(0, Math.round(baseUnits * weekendBoost));
      if (unitsSold === 0) return;
      history.push({
        date: dateStr,
        productId: product.id,
        productName: product.name,
        category: product.category,
        unitsSold,
        revenue: Number((unitsSold * product.price).toFixed(2)),
        profit: Number((unitsSold * (product.price - product.cost)).toFixed(2)),
      });
    });
  }
  return history;
}

export const PRODUCTS = buildProducts();
export const SALES_HISTORY = buildSalesHistory(PRODUCTS, 60);
export const CATEGORY_LIST = CATEGORIES;
