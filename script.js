// === Google Apps Script 網址 ===
const API_URL = "https://script.google.com/macros/s/AKfycbxqZg4TBgnxolQuSPP4tWB9auTqC64v1nX0vm5_GHMsp4yGWQtmimOHUetI4PWEEXb2Xw/exec";

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

let orderList = [];

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
  const note = document.getElementById("note").value.trim();
  
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
  // 建立 order 物件（這是要送到 Google Sheet 的）
  const order = {
    date: new Date().toISOString().split("T")[0],
    name: userName,
    restaurant: restaurantName,
    item: itemData.name,
    unitPrice: itemData.price,
    qty: qty,
    price: itemData.price * qty,
    note: note
  };

  // 加入本地清單
  orderList.push(order);

  // 更新畫面
  displayOrders();

  // 送到 Google Sheet
  sendOrderToGoogleSheet(order);
}

// === 顯示畫面 ===
function displayOrders() {
  const ordersDiv = document.getElementById("orders");
  ordersDiv.innerHTML = "";

  let total = 0;

  orderList.forEach((o, index) => {
    total += o.price;

    const div = document.createElement("div");
    div.textContent = `${o.name} 點了 ${o.restaurant} 的 ${o.item} (${o.unitPrice} 元/份) × ${o.qty} = $${o.price}`;
    ordersDiv.appendChild(div);
  });

  document.getElementById("total").textContent = total;
}

// === 傳送資料到 Google Sheets ===
  // 送到 Google Apps Script
 function sendOrderToGoogleSheet(order) {
  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(order)   // ← 不要加 headers，因為 Apps Script 才不會 CORS
  })
  .then(res => res.json())
  .then(data => console.log("成功送出：", data))
  .catch(err => console.error("送出失敗：", err));
}
