let orderId = Date.now();

const drinks = {
  Whiskey: [
    { name: 'Jack Daniels', price: 8 },
    { name: 'Jameson', price: 7 }
  ],
  Wine: [
    { name: 'Red Wine', price: 6 },
    { name: 'White Wine', price: 6 }
  ],
  'Top Shelf': [
    { name: 'Johnnie Walker Blue', price: 12 },
    { name: 'Don Julio 1942', price: 15 }
  ],
  Cocktails: [
    { name: 'Mojito', price: 5 },
    { name: 'Martini', price: 6 },
    { name: 'Martini', price: 6 },
    { name: 'Martini', price: 6 },
    { name: 'Rum & Coke', price: 5 }
  ],
  Beer: [
    { name: 'Budweiser', price: 4 },
    { name: 'Heineken', price: 5 }
  ]
};

const selectedDrinks = new Set();

const drinkOptionsContainer = document.getElementById('drinkOptions');
const tabsContainer = document.getElementById('tabs');

let categories = Object.keys(drinks);

categories.forEach((category, index) => {
  const tab = document.createElement('div');
  tab.className = 'tab' + (index === 0 ? ' active' : '');
  tab.innerText = category;
  tab.onclick = () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.drink-category').forEach(dc => dc.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(`cat-${category}`).classList.add('active');
  };
  tabsContainer.appendChild(tab);

  const categoryDiv = document.createElement('div');
  categoryDiv.className = 'drink-category' + (index === 0 ? ' active' : '');
  categoryDiv.id = `cat-${category}`;

  drinks[category].forEach(drink => {
    const div = document.createElement('div');
    div.className = 'drink-option';
    div.innerHTML = `<strong>${drink.name}</strong><br>Price: $${drink.price}`;
    div.onclick = () => {
      if (selectedDrinks.has(drink)) {
        selectedDrinks.delete(drink);
        div.classList.remove('selected');
        if(selectedDrinks.size === 0)
        {
            document.getElementById('emptyCartMessage').innerText = 'Your cart is empty';
        }
      } else {
        selectedDrinks.add(drink);
        div.classList.add('selected');
        document.getElementById('emptyCartMessage').innerHTML = '';
      }

      yourOrders.innerHTML = '';

      let num = 0;
      selectedDrinks.forEach((d)=>
    {

        const orderDiv = document.createElement('div');
        orderDiv.className = 'order';
        orderDiv.innerHTML = `
          <strong>${d.name}</strong>  $${d.price}
        `;
        yourOrders.appendChild(orderDiv);
        //blab//
        num += d.price;
    });

    document.getElementById('cartTotal').innerText = `$${num}`;
    };
    categoryDiv.appendChild(div);
  });
  drinkOptionsContainer.appendChild(categoryDiv);
});

function placeOrder() {
  const table = document.getElementById('table').value;
  if (!table) return alert('Enter your table number.');
  if (selectedDrinks.size === 0) return alert('Select at least one drink.');

  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');

  selectedDrinks.forEach(drink => {
    const order = {
      id: orderId++,
      table,
      drink: drink.name,
      price: drink.price,
      time: new Date().toLocaleTimeString(),
      status: 'Queued',
      waitTime: Math.floor(Math.random() * 10 + 1) + ' mins'
    };
    orders.push(order);
    orderHistory.push(order);
  });

  localStorage.setItem('orders', JSON.stringify(orders));
  localStorage.setItem('orderHistory', JSON.stringify(orderHistory));

  selectedDrinks.clear();
  document.querySelectorAll('.drink-option').forEach(el => el.classList.remove('selected'));
  document.getElementById('yourOrders').innerHTML = '';
  renderOrders(table);
}

function renderOrders(currentTable = null) {
  const orderHistoryEl = document.getElementById('orderHistory');
  const barOrders = document.getElementById('barOrders');
  barOrders.innerHTML = '';

  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const history = JSON.parse(localStorage.getItem('orderHistory') || '[]');

  orders.forEach(order => {
    if (order.table === currentTable) {
      const orderDiv = document.createElement('div');
      orderDiv.className = 'order';
      orderDiv.innerHTML = `
        <strong>Drink:</strong> ${order.drink} ($${order.price})<br>
        <strong>Table:</strong> ${order.table}<br>
        <strong>Status:</strong> <span class="progress">${order.status}</span><br>
        <strong>Estimated Wait:</strong> ${order.waitTime}
      `;
      orderHistoryEl.appendChild(orderDiv);
    }
  });

  history.forEach(order => {
    if (order.table === currentTable) {
      const histDiv = document.createElement('div');
      histDiv.className = 'order';
      histDiv.innerHTML = `
        <strong>Drink:</strong> ${order.drink} ($${order.price})<br>
        <strong>Status:</strong> ${order.status} @ ${order.time}
      `;
      orderHistoryEl.appendChild(histDiv);
    }
  });

  if (localStorage.getItem('isBartender') === 'true') {
    orders.forEach(order => {
      const barDiv = document.createElement('div');
      barDiv.className = 'bar-order';
      barDiv.innerHTML = `
        <strong>Order ID:</strong> ${order.id}<br>
        <strong>Drink:</strong> ${order.drink} ($${order.price})<br>
        <strong>Table:</strong> ${order.table}<br>
        <strong>Status:</strong> ${order.status}<br>
        <button onclick="updateStatus(${order.id})" class="btn-mark-done">Mark as Done</button>
      `;
      barOrders.appendChild(barDiv);
    });
  }
}

function updateStatus(id) {
  let orders = JSON.parse(localStorage.getItem('orders') || '[]');
  orders = orders.map(o => {
    if (o.id === id) o.status = 'Completed';
    return o;
  });
  localStorage.setItem('orders', JSON.stringify(orders));
  renderOrders();
}

function bartenderLogin() {
  localStorage.setItem('isBartender', 'true');
  document.getElementById('barSection').style.display = 'block';
  renderOrders();
}

function orderHistoryOpen() {
    document.getElementById('orderSection').style.display = 'block';
    renderOrders();
  }
  

function closeBartab()
{
    localStorage.setItem('isBartender', 'false');
  document.getElementById('barSection').style.display = 'none';
}
function closeOrdertab()
{
  document.getElementById('orderSection').style.display = 'none';
}

// if (localStorage.getItem('isBartender') === 'true') {
//   document.getElementById('barSection').style.display = 'block';
// }

//  document.addEventListener('DOMContentLoaded', openOrder);

function openOrder()
{
    const table = document.getElementById('table').value;
    if (!table) return alert('Enter your table number.');



    document.getElementById('currentTableDisplay').innerHTML = table;
    document.getElementById('form-bottom').style.display = 'block';
    document.getElementById('card').style.display = 'none';

    document.getElementById('bodyGen').classList.remove('login-type');
}
