// 預設八方雲集菜單 (示範品項，可自行增加)
const menu = [
  { name: "鍋貼(10顆)", price: 65 },
  { name: "水餃(10顆)", price: 60 },
  { name: "酸辣湯", price: 35 },
  { name: "玉米濃湯", price: 30 },
  { name: "紅茶(中)", price: 20 }
];

let orders = [];

window.onload = function() {
  const menuSelect = document.getElementById("menuSelect");
  menu.forEach(item => {
    const option = document.createElement("option");
    option.value = item.name;
    option.textContent = `${item.name} - $${item.price}`;
    menuSelect.appendChild(option);
  });
};

// 加入點餐
function addOrder() {
  const name = document.getElementById("userName").value.trim();
  const selected = document.getElementById("menuSelect").value;

  if (!name) {
    alert("請輸入姓名！");
    return;
  }

  const item = menu.find(i => i.name === selected);
  orders.push({ name: name, item: item.name, price: item.price });

  renderTable();
}

// 更新表格
function renderTable() {
  const tbody = document.querySelector("#orderTable tbody");
  tbody.innerHTML = "";

  let total = 0;
  orders.forEach(order => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${order.name}</td><td>${order.item}</td><td>${order.price}</td>`;
    tbody.appendChild(row);
    total += order.price;
  });

  document.getElementById("total").textContent = `總計：${total} 元`;
}

// 匯出 CSV
function exportCSV() {
  let csvContent = "姓名,品項,價格\n";
  orders.forEach(order => {
    csvContent += `${order.name},${order.item},${order.price}\n`;
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "八方雲集點餐.csv");
  link.click();
}
