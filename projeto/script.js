// Dados dos produtos
const produtos = [
    {
        id: 1,
        nome: "Café Mineiro Torrado e Moído, 500g",
        descricao: "Café Mineiro Torrado e Moído, 500g - Sabor encorpado e aroma intenso.",
        preco: 45.00,
        imagem: "fotos/cafe.png"
    },
    {
        id: 2,
        nome: "Café Mineiro Torrado e Moído, 1kg",
        descricao: "Café Mineiro Torrado e Moído, 1kg - Sabor encorpado e aroma intenso.",
        preco: 90.00,
        imagem: "fotos/cafe.png"
    },
    {
        id: 3,
        nome: "Café Mineiro Torrado (em grãos), 500g",
        descricao: "Café Mineiro Torrado em grãos, 500g - Sabor encorpado e aroma intenso.",
        preco: 45.00,
        imagem: "fotos/cafe.png"
    },
    {
        id: 4,
        nome: "Café Mineiro Torrado (em grãos), 1kg",
        descricao: "Café Mineiro Torrado em grãos, 1kg - Sabor encorpado e aroma intenso.",
        preco: 90.00,
        imagem: "fotos/cafe.png"
    },
    {
        id: 5,
        nome: "Café Descafeinado 500g",
        descricao: "Processo Swiss Water, mantendo todo o sabor sem a cafeína.",
        preco: 55.00,
        imagem: "fotos/cafe.png"
    },
    {
        id: 6,
        nome: "Kit Premium Zauli's",
        descricao: "Kit com 3 variedades especiais + caneca personalizada.",
        preco: 149.90,
        imagem: "fotos/cafe.png"
    }
];

// Estado do carrinho
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

// Elementos DOM
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const productsGrid = document.getElementById('productsGrid');
const cartButton = document.getElementById('cartButton');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const emptyCartMessage = document.getElementById('emptyCartMessage');
const checkoutButton = document.getElementById('checkoutButton');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const newsletterForm = document.getElementById('newsletterForm');

// Função para renderizar produtos
function renderProducts() {
    productsGrid.innerHTML = produtos.map(produto => `
        <div class="product-card" data-id="${produto.id}">
            <div class="product-image">
                <img src="${produto.imagem}" alt="${produto.nome}" loading="lazy" decoding="async">
            </div>
            <div class="product-info">
                <h3 class="product-title">${produto.nome}</h3>
                <p class="product-description">${produto.descricao}</p>
                <div class="product-footer">
                    <span class="product-price">R$ ${produto.preco.toFixed(2)}</span>
                    <button class="add-to-cart" onclick="addToCart(${produto.id}, '${produto.nome}', ${produto.preco}, '${produto.imagem}')">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Função adicionar ao carrinho
function addToCart(id, nome, preco, imagem) {
    const item = carrinho.find(i => i.id === id);
    if (item) {
        item.quantidade++;
    } else {
        carrinho.push({ id, nome, preco, imagem, quantidade: 1 });
    }
    saveCart();
    updateCart();
    animateCartIcon();
    showToast(`${nome} adicionado ao carrinho!`);
}

// Salvar carrinho no localStorage
function saveCart() {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

// Atualizar carrinho
function updateCart() {
    cartCount.textContent = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
    const total = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    cartTotal.textContent = `R$ ${total.toFixed(2)}`;
    
    if (carrinho.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart" id="emptyCartMessage">Seu carrinho está vazio</p>';
    } else {
        cartItems.innerHTML = carrinho.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.imagem}" alt="${item.nome}" loading="lazy" decoding="async">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.nome}</div>
                    <div class="cart-item-price">R$ ${item.preco.toFixed(2)}</div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                        <span class="cart-item-quantity">${item.quantidade}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        <button class="remove-item" onclick="removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Atualizar quantidade
function updateQuantity(id, change) {
    const item = carrinho.find(i => i.id === id);
    if (item) {
        item.quantidade += change;
        if (item.quantidade <= 0) {
            removeFromCart(id);
        } else {
            saveCart();
            updateCart();
        }
    }
}

// Remover do carrinho
function removeFromCart(id) {
    carrinho = carrinho.filter(i => i.id !== id);
    saveCart();
    updateCart();
}

// Animar ícone do carrinho
function animateCartIcon() {
    cartCount.classList.add('pulse');
    setTimeout(() => cartCount.classList.remove('pulse'), 600);
}

// Toast de notificação
function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// Abrir/Fechar carrinho
cartButton.addEventListener('click', () => cartModal.classList.add('active'));
closeCart.addEventListener('click', () => cartModal.classList.remove('active'));

// Checkout
checkoutButton.addEventListener('click', () => {
    if (carrinho.length === 0) {
        showToast('Seu carrinho está vazio!');
        return;
    }
    const total = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    const message = `Olá! Gostaria de finalizar uma compra. Total: R$ ${total.toFixed(2)}`;
    window.location.href = `https://wa.me/5511911245236?text=${encodeURIComponent(message)}`;
});

// Menu móvel
menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Fechar menu ao clicar em link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => navMenu.classList.remove('active'));
});

// Newsletter
newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input[type="email"]').value;
    if (email) {
        showToast('Email cadastrado com sucesso!');
        newsletterForm.reset();
    }
});

// Slider de depoimentos
let currentSlide = 0;
const testimonials = document.querySelectorAll('.testimonial');
const dots = document.querySelectorAll('.dot');

function showSlide(n) {
    testimonials.forEach(t => t.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    testimonials[n].classList.add('active');
    dots[n].classList.add('active');
}

document.querySelector('.slider-btn.prev').addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + testimonials.length) % testimonials.length;
    showSlide(currentSlide);
});

document.querySelector('.slider-btn.next').addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % testimonials.length;
    showSlide(currentSlide);
});

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentSlide = index;
        showSlide(currentSlide);
    });
});

// Inicializar
renderProducts();
updateCart();