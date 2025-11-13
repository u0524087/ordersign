// 這裡換成你自己的 Google Apps Script 網址
const API_URL = "https://script.google.com/macros/s/AKfycbzv16gZdrIgUWt-gO2nVFsNK_MMSjmN2JdnmCIZxM-PrXwXCSnm7SeOsCT0SK21c6wz/exec";

// 各餐廳品項與價格
const menus = {
  a: [
    { name: "排骨便當", price: 90 },
    { name: "雞腿便當", price: 100 },
    { name: "魚排便當", price: 95 }
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

// 更新餐點選單
function updateMenu() {
  const restaurant = document.getElementById("restaurantSelect").value;
  const menuSelect = document.getElementById("menuSelect");
  menuSelect.innerHTML = "";

  if (restaurant && menus[restaurant]) {
    menus[restaurant].forEach(item => {
      const option = document.createElement("option");
      option.value = JSON.stringify(item); // 帶入品項與價格
      option.textContent = `${item.name} - $${item.price}`;
      menuSelect.appendChild(option);
    });
  }
}

// 點餐資料
let orderList = [];
let totalPrice = 0;

// 加入餐點
function addOrder() {
  const userName = document.getElementById("userName").value.trim();
  const restaurantSelect = document.getElementById("restaurantSelect");
  const restaurantName = restaurantSelect.options[restaurantSelect.selectedIndex].text;
  const menuSelect = document.getElementById("menuSelect");
  const itemData = JSON.parse(menuSelect.value);

  if (!userName || !restaurantName || !itemData) {
    alert("請輸入姓名並選擇餐廳和餐點！");
    return;
  }

  
  // 自動抓取今日日期
  const today = new Date();
  const dateStr = today.toISOString().split("T")[0]; // 格式：YYYY-MM-DD

  const order = {
    date: dateStr,   // 加上日期
    name: userName,
    restaurant: restaurantName,
    item: itemData.name,
    price: itemData.price
  };

  orderList.push(order);
  totalPrice += order.price;

  displayOrders();
  sendOrderToGoogleSheet(order);
}

// 顯示目前的點餐紀錄
function displayOrders() {
  const ordersDiv = document.getElementById("orders");
  ordersDiv.innerHTML = "";

  orderList.forEach(o => {
    const div = document.createElement("div");
    div.className = "order-item";
    div.textContent = `${o.name} 點了 ${o.restaurant} 的 ${o.item} - $${o.price}`;
    ordersDiv.appendChild(div);
  });

  document.getElementById("total").textContent = totalPrice;
}

// 傳送資料到 Google Sheet
function sendOrderToGoogleSheet(order) {
  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(order)
  })
  .then(res => res.json())
  .then(data => {
    console.log("送出成功:", data);
  })
  .catch(err => {
    console.error("送出失敗:", err);
  });
}
