
  /* PRODUCT SEARCH */

  const productCards =
    Array.from(
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


    productCards.forEach(card => {

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


  /* FILTER BUTTONS */

  filters.addEventListener(
    "click",
    event => {

      const button =
        event.target.closest("[data-filter]");

      if (!button) return;


      activeFilter =
        button.dataset.filter;


      document
        .querySelectorAll(".filter")
        .forEach(item =>
          item.classList.remove("active")
        );


      button.classList.add("active");


      renderProducts();

    }
  );


  searchInput.addEventListener(
    "input",
    renderProducts
  );


  /* MODAL */

  const modalWrap =
    document.getElementById("modalWrap");

  const quantity =
    document.getElementById("quantity");

  const modalTotal =
    document.getElementById("modalTotal");


  let selectedProduct = null;

  let selectedChannel = "whatsapp";


  /* UPDATE TOTAL */

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
      ).toLocaleString() +
      " AFN";

  }


  /* OPEN PRODUCT */

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


    selectedChannel =
      "whatsapp";


    document
      .querySelectorAll(
        "#socialChoice button"
      )
      .forEach(button => {

        button.classList.toggle(
          "active",
          button.dataset.channel ===
          selectedChannel
        );

      });


    updateTotal();


    modalWrap.classList.add("show");

    modalWrap.setAttribute(
      "aria-hidden",
      "false"
    );

  }


  /* CLOSE MODAL */

  function closeModal() {

    modalWrap.classList.remove("show");

    modalWrap.setAttribute(
      "aria-hidden",
      "true"
    );

  }


  /* PRODUCT BUTTON */

  document
    .querySelectorAll("[data-open-product]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () =>
          openModal(
            button.closest(".product")
          )
      );

    });


  /* QUANTITY */

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


  quantity.addEventListener(
    "input",
    updateTotal
  );


  /* CLOSE */

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


  modalWrap.addEventListener(
    "click",
    event => {

      if (
        event.target ===
        modalWrap
      ) {
        closeModal();
      }

    }
  );


  document.addEventListener(
    "keydown",
    event => {

      if (event.key === "Escape") {
        closeModal();
      }

    }
  );


  /* SOCIAL CHANNEL */

  document
    .querySelectorAll(
      "#socialChoice button"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          selectedChannel =
            button.dataset.channel;


          document
            .querySelectorAll(
              "#socialChoice button"
            )
            .forEach(item =>
              item.classList.toggle(
                "active",
                item === button
              )
            );

        }
      );

    });


  /* SEND ORDER */

  document
    .getElementById("sendOrder")
    .addEventListener(
      "click",
      () => {

        if (!selectedProduct) {
          return;
        }


        const name =
          document
            .getElementById("customerName")
            .value
            .trim();


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


        const size =
          document
            .getElementById("productSize")
            .value
            .trim() ||
          "Not specified";


        const color =
          document
            .getElementById("productColor")
            .value
            .trim() ||
          "Not specified";


        const qty =
          Math.max(
            1,
            Number(quantity.value) || 1
          );


        const address =
          document
            .getElementById("deliveryAddress")
            .value
            .trim() ||
          "Not specified";


        const note =
          document
            .getElementById("customerNote")
            .value
            .trim();


        const total =
          Number(selectedProduct.price) *
          qty;


        /* FULL ORDER MESSAGE */

        const orderText =
`Hello Yahya Shop!

ORDER REQUEST

Product: ${selectedProduct.name}

Price:
${Number(selectedProduct.price).toLocaleString()} AFN

Quantity:
${qty}

Total:
${total.toLocaleString()} AFN

Size:
${size}

Color:
${color}

Customer name:
${name}

Phone:
${phone}

Delivery address:
${address}

Other notes:
${note || "None"}`;


        const message =
          encodeURIComponent(orderText);


        /* CONTACT LINKS */

        const links = {

          whatsapp:
            `https://wa.me/93705295884?text=${message}`,

          email:
            `mailto:yahiaanawabi86@gmail.com?subject=${encodeURIComponent(
              "Order: " +
              selectedProduct.name
            )}&body=${message}`,

          /* Replace these with your real pages */

          facebook:
            "https://www.facebook.com/yahyanawabi45?mibextid=wwXlfr",

          tiktok:
            "https://www.tiktok.com/@yahyanawabi45?_r=1&_ZS-9A6pEhkwbz8"

        };


        /* WHATSAPP */

        if (
          selectedChannel ===
          "whatsapp"
        ) {

          window.location.href =
            links.whatsapp;

          closeModal();

          return;
        }


        /* EMAIL */

        if (
          selectedChannel ===
          "email"
        ) {

          window.location.href =
            links.email;

          closeModal();

          return;
        }


        /* FACEBOOK / TIKTOK */

        const label =
          selectedChannel === "facebook"
            ? "Facebook/Messenger"
            : "TikTok";


        window.open(
          links[selectedChannel],
          "_blank"
        );


        setTimeout(
          () => {

            alert(
              `Your full order is ready.

${label} opened.

Copy/paste this message into the chat:

${orderText}`
            );

          },
          300
        );


        closeModal();

      }
    );


  /* DARK MODE */

  const themeBtn =
    document.getElementById(
      "themeBtn"
    );


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


  /* INITIAL LOAD */

  renderProducts();