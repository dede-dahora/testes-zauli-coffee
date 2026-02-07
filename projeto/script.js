// Produtos serão carregados da API
let produtos = [];

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
const checkoutButton = document.getElementById('checkoutButton');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const newsletterForm = document.getElementById('newsletterForm');
const productModal = document.getElementById('productModal');
const closeModal = document.getElementById('closeModal');
const productModalImg = document.getElementById('productModalImg');
const productModalTitle = document.getElementById('productModalTitle');
const productModalDesc = document.getElementById('productModalDesc');
const productModalPrice = document.getElementById('productModalPrice');
const productModalQty = document.getElementById('productModalQty');
const productModalAdd = document.getElementById('productModalAdd');

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
                    <button class="add-to-cart" data-id="${produto.id}" aria-label="Adicionar ${produto.nome} ao carrinho">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}



// Toast de notificação
function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
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
        cartItems.innerHTML = '<p class="empty-cart">Seu carrinho está vazio</p>';
    } else {
        cartItems.innerHTML = carrinho.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.imagem}" alt="${item.nome}" loading="lazy" decoding="async">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.nome}</div>
                    <div class="cart-item-price">R$ ${item.preco.toFixed(2)}</div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" data-id="${item.id}" data-action="decrease">−</button>
                        <span class="cart-item-quantity">${item.quantidade}</span>
                        <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
                        <button class="remove-item" data-id="${item.id}" data-action="remove" aria-label="Remover ${item.nome} do carrinho">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path d="M3 6h18M8 6v12a2 2 0 002 2h4a2 2 0 002-2V6M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
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

// Limpar/Resetar carrinho completamente
function resetCart() {
    carrinho = [];
    saveCart();
    updateCart();
}

// Animar ícone do carrinho
function animateCartIcon() {
    cartCount.classList.add('pulse');
    setTimeout(() => cartCount.classList.remove('pulse'), 600);
}

// Abrir/Fechar carrinho (prevent default on anchor)
if (cartButton) {
    cartButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (cartModal) cartModal.classList.add('active');
    });
}
if (closeCart) {
    closeCart.addEventListener('click', () => { if (cartModal) cartModal.classList.remove('active'); });
}

// Checkout button opens modal
if (checkoutButton) {
    checkoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (carrinho.length === 0) {
            showToast('Seu carrinho está vazio!');
            return;
        }
        openCheckoutModal();
    });
}


if (menuToggle) {
    menuToggle.addEventListener('click', () => { if (navMenu) navMenu.classList.toggle('active'); });
}

// Fechar menu ao clicar em link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => { if (navMenu) navMenu.classList.remove('active'); });
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
    if (!testimonials || testimonials.length === 0) return;
    testimonials.forEach(t => t.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    const idx = ((n % testimonials.length) + testimonials.length) % testimonials.length;
    testimonials[idx].classList.add('active');
    if (dots[idx]) dots[idx].classList.add('active');
}

const prevBtn = document.querySelector('.slider-btn.prev');
const nextBtn = document.querySelector('.slider-btn.next');
if (prevBtn && testimonials.length > 0) {
    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + testimonials.length) % testimonials.length;
        showSlide(currentSlide);
    });
}
if (nextBtn && testimonials.length > 0) {
    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % testimonials.length;
        showSlide(currentSlide);
    });
}

if (dots && dots.length === testimonials.length && dots.length > 0) {
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });
}

// Inicializar
// carregar produtos via API
async function fetchProducts() {
    try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Falha ao carregar produtos');
        produtos = await res.json();
        renderProducts();
        bindAddToCartButtons();
        // If modal exists, ensure click opens it
    } catch (err) {
        console.error(err);
        showToast('Erro ao carregar produtos');
    }
}

fetchProducts();
updateCart();



let currentModalProductId = null;
// Product modal helpers
function openProductModal(id) {
    const produto = produtos.find(p => p.id === id);
    if (!produto || !productModal) return;
    productModalImg.src = produto.imagem;
    productModalImg.alt = produto.nome;
    productModalTitle.textContent = produto.nome;
    productModalDesc.textContent = produto.descricao;
    productModalPrice.textContent = `R$ ${produto.preco.toFixed(2)}`;
    if (productModalQty) productModalQty.value = 1;
    currentModalProductId = id;
    productModal.setAttribute('aria-hidden', 'false');
    productModal.classList.add('open');
}

function closeProductModal() {
    if (!productModal) return;
    productModal.setAttribute('aria-hidden', 'true');
    productModal.classList.remove('open');
}

if (closeModal) closeModal.addEventListener('click', closeProductModal);
if (productModal) productModal.addEventListener('click', (e) => { if (e.target === productModal) closeProductModal(); });

// Open modal when clicking a product card/image
if (productsGrid) {
    productsGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.product-card');
        if (!card) return;
        const id = Number(card.dataset.id);
        if (Number.isInteger(id)) openProductModal(id);
    });
}

// Event delegation for cart controls (increase/decrease/remove)
if (cartItems) {
    cartItems.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn || !btn.dataset) return;
        const id = Number(btn.dataset.id);
        const action = btn.dataset.action;
        if (!id || !action) return;
        if (action === 'increase') {
            updateQuantity(id, 1);
        } else if (action === 'decrease') {
            updateQuantity(id, -1);
        } else if (action === 'remove') {
            removeFromCart(id);
        }
    });
}

function bindAddToCartButtons() {
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.removeEventListener('click', handleAddToCart);
        btn.addEventListener('click', handleAddToCart);
    });
}

function handleAddToCart(e) {
    e.preventDefault();
    const id = Number(this.dataset.id);
    const produto = produtos.find(p => p.id === id);
    if (produto) {
        addToCart(id, produto.nome, produto.preco, produto.imagem);
    }
}

// Add to cart from modal
if (productModalAdd) {
    productModalAdd.addEventListener('click', () => {
        const id = Number(currentModalProductId);
        const produto = produtos.find(p => p.id === id);
        if (!produto) return;
        const nome = produto.nome;
        const preco = produto.preco;
        const imagem = produto.imagem;
        const qty = Number(productModalQty.value) || 1;
        for (let i = 0; i < qty; i++) addToCart(id, nome, preco, imagem);
        closeProductModal();
    });
}

// Checkout modal handling
const checkoutModal = document.getElementById('checkoutModal');
const closeCheckout = document.getElementById('closeCheckout');
const checkoutForm = document.getElementById('checkoutForm');

function openCheckoutModal() {
    checkoutModal.style.display = 'flex';
    checkoutModal.setAttribute('aria-hidden', 'false');
}

function closeCheckoutModal() {
    checkoutModal.style.display = 'none';
    checkoutModal.setAttribute('aria-hidden', 'true');
}

if (closeCheckout) {
    closeCheckout.addEventListener('click', closeCheckoutModal);
}

if (checkoutModal) {
    checkoutModal.addEventListener('click', (e) => {
        if (e.target === checkoutModal) closeCheckoutModal();
    });
}

// When checkout form submitted, send cart to server
if (checkoutForm) {
    checkoutForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('checkoutName').value.trim();
        const phone = document.getElementById('checkoutPhone').value.trim();
        const address = document.getElementById('checkoutAddress').value.trim();

        if (carrinho.length === 0) {
            alert('Seu carrinho está vazio');
            return;
        }

        const payload = {
            customer: { name, phone, address },
            items: carrinho.map(i => ({ id: i.id, nome: i.nome, preco: i.preco, quantidade: i.quantidade })),
            total: carrinho.reduce((s, it) => s + it.preco * it.quantidade, 0),
            paymentMethod: 'whatsapp'
        };

        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data && data.orderId) {
                // Redirect to WhatsApp with order details
                const totalText = `R$ ${payload.total.toFixed(2)}`;
                const text = encodeURIComponent(`Pedido %23${data.orderId} - Total: ${totalText}\nCliente: ${name} - ${phone} - ${address}`);
                resetCart();
                closeCheckoutModal();
                if (cartModal) cartModal.classList.remove('active');
                window.location.href = `https://wa.me/${phone.replace(/[^0-9]/g,'')}?text=${text}`;
            } else {
                alert('Erro ao criar pedido. Tente novamente.');
            }
        } catch (err) {
            console.error(err);
            alert('Erro de rede. Tente novamente.');
        }
    });
}
