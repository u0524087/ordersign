// 餐廳對應的品項（要修改菜單就在這裡改）
const menus = {
  a: ["排骨便當", "雞腿便當", "魚排便當"],
  b: ["鍋貼", "水餃", "酸辣湯"],
  c: ["牛肉麵", "陽春麵", "水餃湯"]
};

// 更新品項下拉選單
function updateMenu() {
  const restaurant = document.getElementById("restaurantSelect").value;
  const menuSelect = document.getElementById("menuSelect");

  // 先清空舊選項
  menuSelect.innerHTML = "";

  if (restaurant && menus[restaurant]) {
    menus[restaurant].forEach(item => {
      const option = document.createElement("option");
      option.value = item;
      option.textContent = item;
      menuSelect.appendChild(option);
    });
  }
}

// 加入餐點並顯示在清單
function addOrder() {
  const name = document.getElementById("userName").value.trim();
  const restaurant = document.getElementById("restaurantSelect");
  const restaurantName = restaurant.options[restaurant.selectedIndex]?.text || "";
  const item = document.getElementById("menuSelect").value;

  if (!name || !restaurantName || !item) {
    alert("請輸入姓名並選擇餐廳和品項！");
    return;
  }

  const orderList = document.getElementById("orderList");
  const li = document.createElement("li");
  li.textContent = `${name} 點了 ${restaurantName} 的 ${item}`;
  orderList.appendChild(li);
}
