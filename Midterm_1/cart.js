const cart = {};

// เพิ่มสินค้าลงในตะกร้า
function addToCart(productId, price, quantity) {
  if (!cart[productId]) {
    cart[productId] = { quantity: quantity, price: price };
  } else {
    cart[productId].quantity += quantity;
  }
  updateCartDisplay();
}

// ลบสินค้าออกจากตะกร้า
function removeFromCart(productId) {
  if (cart[productId]) {
    cart[productId].quantity--;
    if (cart[productId].quantity === 0) {
      delete cart[productId];
    }
  }
  updateCartDisplay();
}

// เพิ่ม Event Listener สำหรับปุ่ม Add to Cart และปุ่ม Remove from Cart
// เพิ่ม Event Listener สำหรับปุ่ม Add to Cart
document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", () => {
    const productId = button.getAttribute("data-product-id");
    const price = parseFloat(button.getAttribute("data-price"));
    const productName = button.parentElement
      .querySelector("p")
      .getAttribute("data-product-name"); // ดึงชื่อสินค้าจาก attribute data-product-name
    if (!cart[productId]) {
      cart[productId] = { quantity: 1, price: price, name: productName };
    } else {
      cart[productId].quantity++;
    }
    updateCartDisplay();
  });
});


document.querySelectorAll(".remove-from-cart").forEach((button) => {
  button.addEventListener("click", () => {
    const productId = button.getAttribute("data-product-id");
    removeFromCart(productId);
  });
});

// อัพเดทการแสดงผลตะกร้า
function updateCartDisplay() {
  const cartElement = document.getElementById("cart");
  cartElement.innerHTML = "";

  let totalPrice = 0;
  let hasItems = false; // เพิ่มตัวแปรเพื่อตรวจสอบว่ามีสินค้าในตะกร้าหรือไม่

  for (const productId in cart) {
    const item = cart[productId];
    const itemTotalPrice = item.quantity * item.price;
    totalPrice += itemTotalPrice;
    const productElement = document.createElement("p");

    productElement.textContent = `${item.name}: ${item.quantity} x $${item.price} = $${itemTotalPrice} `;
    cartElement.appendChild(productElement);

    const addButton = document.createElement("button");
    addButton.textContent = " + ";
    addButton.addEventListener("click", () => {
      addToCart(productId, item.price, 1, item.name);
    });
    const removeButton = document.createElement("button");
    removeButton.textContent = " - ";
    removeButton.addEventListener("click", () => {
      removeFromCart(productId);
    });
    productElement.appendChild(addButton);
    productElement.appendChild(removeButton);
    cartElement.appendChild(productElement);
    hasItems = true; // มีสินค้าในตะกร้า
  }

  if (Object.keys(cart).length === 0) {
    const cartIcon = document.createElement("i");
    cartIcon.classList.add("fas", "fa-shopping-cart");
    cartElement.appendChild(cartIcon);
    cartElement.innerHTML += "<p>No items in cart.</p>";
  } else {
    const totalPriceElement = document.createElement("p");
    totalPriceElement.textContent = `Total Price: $${totalPrice}`;
    cartElement.appendChild(totalPriceElement);
  }

  // เพิ่มปุ่ม "Print Receipt" เมื่อมีสินค้าในตะกร้า
  if (Object.keys(cart).length > 0) {
    const printButton = document.createElement("button");
    printButton.textContent = "Print Receipt";
    printButton.addEventListener("click", () => {
      printReceipt();
    });
    cartElement.appendChild(printButton);
  }
}

// ฟังก์ชันสำหรับพิมพ์ใบเสร็จ
function printReceipt() {
  // สร้างฟอร์มรับข้อมูลชื่อและเบอร์โทร
  const name = prompt("Please enter your name:");
  const phoneNumber = prompt("Please enter your phone number:");

  const printWindow = window.open("", "_blank");
  printWindow.document.write("<html><head><title>Receipt</title></head><body>");

  // เพิ่มข้อมูลชื่อและเบอร์โทรลงในใบเสร็จ
  printWindow.document.write(`<h2>Receipt for ${name}</h2>`);
  printWindow.document.write(`<p>Phone Number Customer: ${phoneNumber}</p>`);
  printWindow.document.write(`<p>Phone Number Restaurant : 099-5895103</p>`);

  // สร้างตารางสำหรับแสดงรายการสินค้า
  printWindow.document.write("<table style='border-collapse: collapse;'>");
  printWindow.document.write(
    "<tr><th style='border: 1px solid black;'>Product</th><th style='border: 1px solid black;'> Quantity </th><th style='border: 1px solid black;'> Price </th><th style='border: 1px solid black;'> Total </th></tr>"
  );

  let totalPrice = 0;
  for (const productId in cart) {
    const item = cart[productId];
    const itemTotalPrice = item.quantity * item.price;
    totalPrice += itemTotalPrice;

    // เพิ่มแต่ละแถวของรายการสินค้าในตาราง
    printWindow.document.write(
      `<tr><td style='border: 1px solid black;'>${item.name}</td><td style='border: 1px solid black;'>${item.quantity}</td><td style='border: 1px solid black;'>$${item.price}</td><td style='border: 1px solid black;'>$${itemTotalPrice}</td></tr>`
    );
  }

  printWindow.document.write("</table>");

  // เพิ่มราคารวมลงในใบเสร็จ
  printWindow.document.write(`<p>Total Price: $${totalPrice}</p>`);

  printWindow.document.write("</body></html>");
  printWindow.document.close();
  printWindow.print();
}


