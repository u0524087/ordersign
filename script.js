// === Google Apps Script 網址 ===
const API_URL = "https://script.google.com/macros/s/AKfycbzUiZkEzxLUfniJ9WkctR05o5OBP_MpcBH4usUZEMoTLjazb_Lvu2XA0kMbfENcSj4r/exec";

// === 餐廳與品項 ===
const menus = {
  a: [
    { name: "當歸羊肉湯", price: 70 },
    { name: "當歸羊肉麵", price: 80 },
    { name: "當歸羊肉冬粉", price: 80 },
    { name: "當歸羊肉米粉", price: 80 },
    { name: "當歸豬肉湯", price: 70 },
    { name: "當歸豬肉麵", price: 80 },
    { name: "當歸豬肉冬粉", price: 80 },
    { name: "當歸豬肉米粉", price: 80 },
    { name: "沙茶羊肉湯(乾)", price: 70 },
    { name: "沙茶羊肉飯", price: 80 },
    { name: "沙茶羊肉麵", price: 80 },
    { name: "沙茶羊肉冬粉", price: 80 },
    { name: "沙茶羊肉米粉", price: 80 },
    { name: "沙茶豬肉湯(乾)", price: 70 },
    { name: "沙茶豬肉飯", price: 80 },
    { name: "沙茶豬肉麵", price: 80 },
    { name: "沙茶豬肉冬粉", price: 80 },
    { name: "沙茶豬肉米粉", price: 80 },
    { name: "貢丸湯", price: 40 },
    { name: "貢丸麵", price: 55 },
    { name: "貢丸冬粉", price: 55 },
    { name: "貢丸米粉", price: 55 },
    { name: "魚丸湯", price: 40 },
    { name: "魚丸麵", price: 55 },
    { name: "魚丸冬粉", price: 55 },
    { name: "魚丸米粉", price: 55 },
    { name: "餛飩湯", price: 40 },
    { name: "餛飩麵", price: 55 },
    { name: "餛飩冬粉", price: 55 },
    { name: "餛飩米粉", price: 55 },
    { name: "滷肉飯(小)", price: 30 },
    { name: "滷肉飯(大)", price: 45 },
    { name: "白飯", price: 15 },
    { name: "滷肉乾麵(小)", price: 40 },
    { name: "滷肉乾麵(大)", price: 55 },
    { name: "古早味乾麵(小)", price: 40 },
    { name: "古早味乾麵(大)", price: 55 },
    { name: "沙茶羊肉(份)", price: 80 },
    { name: "沙茶豬肉(份)", price: 80 },
    { name: "嘴邊肉(份)", price: 50 },
    { name: "肝蓮(份)", price: 45 },
    { name: "皮蛋豆腐(份)", price: 45 },
    { name: "高麗菜(份)", price: 40 },
    { name: "大陸妹(份)", price: 40 },
    { name: "筍絲(份)", price: 40 },
    { name: "滷蛋(顆)", price: 15 },
    { name: "油豆腐(份)", price: 15 },
    { name: "豆干(份)", price: 15 },
    { name: "海帶(份)", price: 15 },
    { name: "小菜拼盤", price: 100 },
    { name: "小菜拼盤(大)", price: 150 },

  ],
  b: [
    { name: "鍋貼", price: 60 },
    { name: "水餃", price: 70 },
    { name: "酸辣湯", price: 40 }
  ],
  c: [
    { name: "牛肉麵", price: 120 },
    { name: "陽春麵", price: 60 },
    { name: "水餃湯", price: 65 }
  ]
};

// === 點餐資料 ===
let orderList = [];

// === 更新餐點選項 ===
function updateMenu() {
  const restaurant = document.getElementById("restaurantSelect").value;
  const menuSelect = document.getElementById("menuSelect");
  menuSelect.innerHTML = "";

  menus[restaurant].forEach(item => {
    const opt = document.createElement("option");
    opt.value = JSON.stringify(item);
    opt.textContent = `${item.name} - $${item.price}`;
    menuSelect.appendChild(opt);
  });
}

// === 加入餐點 ===
function addOrder() {
  const userName = document.getElementById("userName").value.trim();
  const restaurantCode = document.getElementById("restaurantSelect").value;
  const restaurantName = document.getElementById("restaurantSelect").selectedOptions[0].text;
  const itemData = JSON.parse(document.getElementById("menuSelect").value);

  if (!userName) {
    alert("請輸入姓名");
    return;
  }

  // 今日日期
  const today = new Date().toISOString().split("T")[0];

  const order = {
    date: today,
    name: userName,
    restaurant: restaurantName,
    item: itemData.name,
    price: itemData.price
  };

  orderList.push(order);
  displayOrders();
  sendOrderToGoogleSheet(order);
}

// === 顯示點餐清單 ===
function displayOrders() {
  const ordersDiv = document.getElementById("orders");
  ordersDiv.innerHTML = "";

  let total = 0;

  orderList.forEach((o, index) => {
    total += o.price;

    const div = document.createElement("div");
    div.textContent = `${o.name} 點了 ${o.restaurant} 的 ${o.item} - $${o.price}`;

    // 刪除按鈕
    const btn = document.createElement("button");
    btn.textContent = "刪除";
    btn.style.marginLeft = "10px";
    btn.onclick = () => deleteOrder(index);

    div.appendChild(btn);
    ordersDiv.appendChild(div);
  });

  document.getElementById("total").textContent = total;
}

// === 刪除 ===
function deleteOrder(index) {
  orderList.splice(index, 1);
  displayOrders();
}

// === 傳送到 Google Sheet ===
function sendOrderToGoogleSheet(order) {
  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(order)
  })
    .then(res => res.json())
    .then(data => console.log("成功", data))
    .catch(err => console.error("失敗", err));
}
