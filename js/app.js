document.addEventListener('DOMContentLoaded', () => {
  const productsContainer = document.getElementById('products');
  const categoryFilter = document.getElementById('category-filter');
  const priceFilter = document.getElementById('price-filter');
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  const cartCount = document.getElementById('cart-count');

  const cartModal = document.getElementById('cart-modal');
  const cartItemsList = document.getElementById('cart-items');
  const closeModal = document.getElementById('close-modal');
  const cartIcon = document.querySelector('.cart');
  const checkoutBtn = document.getElementById('checkout-btn');

  let allProducts = [];
  let cart = [];

  // Função para criar o card de produto
  function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';

    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}" class="product-image">
      <div class="product-details">
        <h3 class="product-title">${product.title}</h3>
        <p class="product-price">R$ ${product.price.toFixed(2)}</p>
        <button class="add-to-cart" data-id="${product.id}">Adicionar ao carrinho</button>
      </div>
    `;

    productsContainer.appendChild(card);
  }

  // Mostrar produtos na tela
  function showProducts(products) {
    productsContainer.innerHTML = '';
    products.forEach(createProductCard);
  }

  // Buscar produtos da API
  async function fetchProducts() {
    try {
      const response = await fetch('https://fakestoreapi.com/products');
      const data = await response.json();

      allProducts = data.filter(product =>
        product.category === "men's clothing" || product.category === "women's clothing"
      );

      showProducts(allProducts);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  }

  // Filtrar e ordenar produtos
  function filterAndSortProducts() {
    let filteredProducts = allProducts;

    const selectedCategory = categoryFilter.value;
    const selectedPrice = priceFilter.value;

    if (selectedCategory) {
      filteredProducts = filteredProducts.filter(product => product.category === selectedCategory);
    }

    if (selectedPrice === 'asc') {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (selectedPrice === 'desc') {
      filteredProducts.sort((a, b) => b.price - a.price);
    }

    showProducts(filteredProducts);
  }

  // Adicionar produto ao carrinho
  function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (product) {
      cart.push(product);
      updateCartCount();
      showAlert('Produto adicionado!');
    }
  }

  // Atualizar contador do carrinho
  function updateCartCount() {
    cartCount.textContent = cart.length;
  }

  // Mostrar itens do carrinho no modal
  function showCartItems() {
    cartItemsList.innerHTML = '';

    if (cart.length === 0) {
      cartItemsList.innerHTML = '<li>Seu carrinho está vazio.</li>';
      document.getElementById('cart-total').textContent = 'Total: R$ 0,00';
      return;
    }

    let total = 0;

    cart.forEach((item, index) => {
      const li = document.createElement('li');
      li.style.marginBottom = '10px';
      li.innerHTML = `
        ${item.title} - R$ ${item.price.toFixed(2)}
        <button class="remove-item" data-index="${index}" style="margin-left:10px; padding:2px 6px; cursor:pointer;">Remover</button>
      `;
      cartItemsList.appendChild(li);
      total += item.price;
    });

    document.getElementById('cart-total').textContent = `Total: R$ ${total.toFixed(2)}`;
  }

  // Função para mostrar alerta de produto adicionado
  function showAlert(message) {
    const alert = document.createElement('div');
    alert.className = 'alert';
    alert.textContent = message;
    document.body.appendChild(alert);

    setTimeout(() => {
      alert.remove();
    }, 2000);
  }

  // Eventos

  // Abrir modal ao clicar no ícone do carrinho
  cartIcon.addEventListener('click', () => {
    showCartItems();
    cartModal.classList.remove('hidden');
  });

  // Fechar modal ao clicar no "X"
  closeModal.addEventListener('click', () => {
    console.log('Fechar modal clicado');
    cartModal.classList.add('hidden');
  });

  // Fechar modal ao clicar fora da área branca (no fundo escuro)
  cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) {
      console.log('Clique fora da modal, fechando');
      cartModal.classList.add('hidden');
    }
  });

  // Remover item do carrinho
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-item')) {
      const index = parseInt(e.target.getAttribute('data-index'));
      cart.splice(index, 1);
      updateCartCount();
      showCartItems();
    }
  });

  // Finalizar compra
  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Seu carrinho está vazio.');
    } else {
      alert('Compra finalizada com sucesso!');
      cart = [];
      updateCartCount();
      showCartItems();
      cartModal.classList.add('hidden');
    }
  });

  // Eventos filtros
  categoryFilter.addEventListener('change', filterAndSortProducts);
  priceFilter.addEventListener('change', filterAndSortProducts);

  // Evento adicionar ao carrinho (botões)
  document.addEventListener('click', function (e) {
    if (e.target && e.target.classList.contains('add-to-cart')) {
      const productId = parseInt(e.target.getAttribute('data-id'));
      addToCart(productId);
    }
  });

  // Toggle modo escuro
  darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
  });

  // Iniciar app
  fetchProducts();
  updateCartCount();
});
