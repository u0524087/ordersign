// 餐廳對應的品項與價格（要修改就在這裡改）
const menus = {
  a: [
    { name: "排骨便當", price: 90 },
    { name: "雞腿便當", price: 100 },
    { name: "魚排便當", price: 95 }
  ],
  b: [
    { name: "鍋貼", price: 6 }, // 假設單顆 6 元
    { name: "水餃", price: 6 },
    { name: "酸辣湯", price: 40 }
  ],
  c: [
    { name: "牛肉麵", price: 120 },
    { name: "陽春麵", price: 50 },
    { name: "水餃湯", price: 60 }
  ]
};

// 存放所有人的點餐紀錄
const orders = {};

// 更新品項下拉選單
function updateMenu() {
  const restaurant = document.getElementById("restaurantSelect").value;
  const menuSelect = document.getElementById("menuSelect");

  menuSelect.innerHTML = "";

  if (restaurant && menus[restaurant]) {
    menus[restaurant].forEach(item => {
      const option = document.createElement("option");
      option.value = JSON.stringify(item); // 儲存品項與價格
      option.textContent = `${item.name} - $${item.price}`;
      menuSelect.appendChild(option);
    });
  }
}

// 加入餐點
function addOrder() {
  const name = document.getElementById("userName").value.trim();
  const restaurant = document.getElementById("restaurantSelect");
  const restaurantName = restaurant.options[restaurant.selectedIndex]?.text || "";
  const itemData = document.getElementById("menuSelect").value;

  if (!name || !restaurantName || !itemData) {
    alert("請輸入姓名並選擇餐廳和品項！");
    return;
  }

  const item = JSON.parse(itemData);

  // 如果該人不存在，就建立他的紀錄
  if (!orders[name]) {
    orders[name] = {
      items: [],
      total: 0
    };
  }

  // 檢查是否已經點過相同品項 → 數量 +1
  const existingItem = orders[name].items.find(i => i.name === item.name);
  if (existingItem) {
    existingItem.qty += 1;
    existingItem.subtotal = existingItem.qty * existingItem.price;
  } else {
    orders[name].items.push({
      name: item.name,
      price: item.price,
      qty: 1,
      subtotal: item.price
    });
  }

  // 更新總金額
  orders[name].total = orders[name].items.reduce((sum, i) => sum + i.subtotal, 0);

  renderOrders();
}

// 刪除餐點
function deleteOrder(userName, itemName) {
  const user = orders[userName];
  if (!user) return;
  
// 顯示所有人的點餐紀錄
function renderOrders() {
  const ordersDiv = document.getElementById("orders");
  ordersDiv.innerHTML = "";

  for (const [name, data] of Object.entries(orders)) {
    const personDiv = document.createElement("div");
    personDiv.innerHTML = `<h4>${name} 的點餐 (總金額：$${data.total})</h4>`;
    
    const ul = document.createElement("ul");
    data.items.forEach(i => {
      const li = document.createElement("li");
      li.textContent = `${i.name} x ${i.qty} = $${i.subtotal}`;
      ul.appendChild(li);
    });

    personDiv.appendChild(ul);
    ordersDiv.appendChild(personDiv);
  }
}

const API_URL = "https://script.google.com/macros/s/你的_API_網址/exec";

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
