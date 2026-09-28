/* =========================
   PRODUCT SEARCH
========================= */

const productCards = Array.from(
  document.querySelectorAll(".product")
);

const searchInput =
  document.getElementById("searchInput");

const filters =
  document.getElementById("filters");

const emptyState =
  document.getElementById("emptyState");

let activeFilter = "all";


function renderProducts() {

  const query =
    searchInput.value
      .trim()
      .toLowerCase();

  let visible = 0;


  productCards.forEach((card) => {

    const matchesFilter =
      activeFilter === "all" ||
      card.dataset.category === activeFilter;


    const matchesSearch =
      card.dataset.name
        .toLowerCase()
        .includes(query) ||

      card.dataset.description
        .toLowerCase()
        .includes(query);


    const show =
      matchesFilter &&
      matchesSearch;


    card.style.display =
      show ? "" : "none";


    if (show) {
      visible++;
    }

  });


  emptyState.style.display =
    visible ? "none" : "block";
}


/* =========================
   CATEGORY FILTERS
========================= */

filters.addEventListener(
  "click",
  (event) => {

    const button =
      event.target.closest("[data-filter]");

    if (!button) return;


    activeFilter =
      button.dataset.filter;


    document
      .querySelectorAll(".filter")
      .forEach((item) => {

        item.classList.remove("active");

      });


    button.classList.add("active");


    renderProducts();

  }
);


/* =========================
   SEARCH
========================= */

searchInput.addEventListener(
  "input",
  renderProducts
);


/* =========================
   MODAL
========================= */

const modalWrap =
  document.getElementById("modalWrap");

const quantity =
  document.getElementById("quantity");

const modalTotal =
  document.getElementById("modalTotal");

let selectedProduct = null;


/* =========================
   UPDATE TOTAL
========================= */

function updateTotal() {

  if (!selectedProduct) return;


  const qty =
    Math.max(
      1,
      Math.min(
        99,
        Number(quantity.value) || 1
      )
    );


  quantity.value = qty;


  modalTotal.textContent =
    (
      Number(selectedProduct.price) *
      qty
    ).toLocaleString() + " AFN";
}


/* =========================
   OPEN MODAL
========================= */

function openModal(card) {

  selectedProduct =
    card.dataset;


  document.getElementById(
    "modalIcon"
  ).textContent =
    selectedProduct.icon;


  document.getElementById(
    "modalTitle"
  ).textContent =
    selectedProduct.name;


  document.getElementById(
    "modalDescription"
  ).textContent =
    selectedProduct.description;


  /* RESET FORM */

  quantity.value = 1;


  document.getElementById(
    "customerName"
  ).value = "";


  document.getElementById(
    "customerPhone"
  ).value = "";


  document.getElementById(
    "productSize"
  ).value = "";


  document.getElementById(
    "productColor"
  ).value = "";


  document.getElementById(
    "deliveryAddress"
  ).value = "";


  document.getElementById(
    "customerNote"
  ).value = "";


  updateTotal();


  modalWrap.classList.add("show");


  modalWrap.setAttribute(
    "aria-hidden",
    "false"
  );

}


/* =========================
   CLOSE MODAL
========================= */

function closeModal() {

  modalWrap.classList.remove(
    "show"
  );


  modalWrap.setAttribute(
    "aria-hidden",
    "true"
  );

}


/* =========================
   PRODUCT BUTTONS
========================= */

document
  .querySelectorAll(
    "[data-open-product]"
  )
  .forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        openModal(
          button.closest(".product")
        );

      }
    );

  });


/* =========================
   MINUS QUANTITY
========================= */

document
  .getElementById("minusQty")
  .addEventListener(
    "click",
    () => {

      quantity.value =
        Math.max(
          1,
          Number(quantity.value || 1) - 1
        );


      updateTotal();

    }
  );


/* =========================
   PLUS QUANTITY
========================= */

document
  .getElementById("plusQty")
  .addEventListener(
    "click",
    () => {

      quantity.value =
        Math.min(
          99,
          Number(quantity.value || 1) + 1
        );


      updateTotal();

    }
  );


/* =========================
   QUANTITY INPUT
========================= */

quantity.addEventListener(
  "input",
  updateTotal
);


/* =========================
   CLOSE BUTTON
========================= */

document
  .getElementById("closeModal")
  .addEventListener(
    "click",
    closeModal
  );


document
  .getElementById("cancelModal")
  .addEventListener(
    "click",
    closeModal
  );


/* =========================
   CLOSE OUTSIDE MODAL
========================= */

modalWrap.addEventListener(
  "click",
  (event) => {

    if (
      event.target === modalWrap
    ) {

      closeModal();

    }

  }
);


/* =========================
   ESCAPE KEY
========================= */

document.addEventListener(
  "keydown",
  (event) => {

    if (event.key === "Escape") {

      closeModal();

    }

  }
);


/* =========================
   SEND ORDER TO WHATSAPP
========================= */

document
  .getElementById("sendOrder")
  .addEventListener(
    "click",
    () => {

      if (!selectedProduct) {
        return;
      }


      /* NAME */

      const name =
        document
          .getElementById("customerName")
          .value
          .trim();


      /* PHONE */

      const phone =
        document
          .getElementById("customerPhone")
          .value
          .trim();


      /* REQUIRED */

      if (!name || !phone) {

        alert(
          "Please enter your name and phone number."
        );

        return;
      }


      /* SIZE */

      const size =
        document
          .getElementById("productSize")
          .value
          .trim() ||
        "Not specified";


      /* COLOR / DESIGN */

      const color =
        document
          .getElementById("productColor")
          .value
          .trim() ||
        "I will choose from the photos sent on WhatsApp";


      /* QUANTITY */

      const qty =
        Math.max(
          1,
          Math.min(
            99,
            Number(quantity.value) || 1
          )
        );


      /* ADDRESS */

      const address =
        document
          .getElementById("deliveryAddress")
          .value
          .trim() ||
        "Not specified";


      /* NOTES */

      const note =
        document
          .getElementById("customerNote")
          .value
          .trim();


      /* TOTAL */

      const total =
        Number(selectedProduct.price) *
        qty;


      /* =========================
         WHATSAPP ORDER MESSAGE
      ========================== */

      const orderText =
`Hello Yahya Online Mart!

🛍️ ORDER REQUEST

📦 Product:
${selectedProduct.name}

💰 Price:
${Number(
  selectedProduct.price
).toLocaleString()} AFN

🔢 Quantity:
${qty}

💵 Total:
${total.toLocaleString()} AFN

📏 Size:
${size}

🎨 Color / Design:
${color}

👤 Customer Name:
${name}

📱 Phone:
${phone}

📍 Delivery Address:
${address}

📝 Other Notes:
${note || "None"}

📸 I understand that the available product colors/designs will be sent to me on WhatsApp so I can choose the exact one.`;


      /* =========================
         WHATSAPP NUMBER
      ========================== */

      const whatsappNumber =
        "93705295884";


      /* =========================
         WHATSAPP URL
      ========================== */

      const whatsappLink =
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
          orderText
        )}`;


      /* =========================
         OPEN WHATSAPP
      ========================== */

      window.location.href =
        whatsappLink;


      closeModal();

    }
  );


/* =========================
   DARK MODE
========================= */

const themeBtn =
  document.getElementById("themeBtn");

let dark = false;


themeBtn.addEventListener(
  "click",
  () => {

    dark = !dark;


    document.documentElement.style
      .colorScheme =
      dark
        ? "dark"
        : "light";

  }
);


/* =========================
   INITIAL LOAD
========================= */

renderProducts();