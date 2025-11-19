// === Google Apps Script 網址 ===
const API_URL = "https://script.google.com/macros/s/AKfycbxwUlBg5iizb5TG_b-dZeUzHeSpdFbUgeLCqGt2kfgVzkmLwXQD_2CPo-ZcnGamSOw8/exec";

// === 餐廳與品項 ===
const menus = {
  a: [
    { name: "當歸羊肉湯", price: 70 },
    { name: "當歸羊肉麵", price: 80 },
    { name: "當歸羊肉冬粉", price: 80 }
  ],
  b: [
  { name: "招牌鍋貼", price: 7 },
  { name: "韭菜鍋貼", price: 7 },
  { name: "韓式泡菜鍋貼", price: 7.5 }
],
  c: [
    { name: "牛肉麵", price: 120 },
    { name: "陽春麵", price: 60 },
    { name: "水餃湯", price: 65 }
  ]
};

function updateMenu() {
  const restaurant = document.getElementById("restaurantSelect").value;
  const menuSelect = document.getElementById("menuSelect");
  menuSelect.innerHTML = "";
  if (!restaurant || !menus[restaurant]) return;
  menus[restaurant].forEach(item => {
    const opt = document.createElement("option");
    opt.value = JSON.stringify(item);
    opt.textContent = `${item.name} - $${item.price}`;
    menuSelect.appendChild(opt);
  });
}

function addOrder() {
  const userName = document.getElementById("userName").value.trim();
  const restaurantCode = document.getElementById("restaurantSelect").value;
  const restaurantName = document.getElementById("restaurantSelect").selectedOptions[0].text;
  const itemData = JSON.parse(document.getElementById("menuSelect").value);
  const qty = parseInt(document.getElementById("menuQty").value, 10);

  if (!userName) {
    alert("請輸入姓名");
    return;
  }
  if (!restaurantCode) {
    alert("請選擇餐廳");
    return;
  }
  if (!itemData) {
    alert("請選擇餐點");
    return;
  }
  if (!qty || qty < 1) {
    alert("數量需大於0");
    return;
  }
  orderList.push({
    name: userName,
    restaurant: restaurantName,
    item: itemData.name,
    price: itemData.price * qty,
    unitPrice: itemData.price,
    qty: qty
  });
  displayOrders();
}
