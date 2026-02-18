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
const clearCartButton = document.getElementById('clearCartButton');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const productModal = document.getElementById('productModal');
const closeModal = document.getElementById('closeModal');
const productModalImg = document.getElementById('productModalImg');
const productModalTitle = document.getElementById('productModalTitle');
const productModalDesc = document.getElementById('productModalDesc');
const productModalPrice = document.getElementById('productModalPrice');
const productModalQty = document.getElementById('productModalQty');
const productModalAdd = document.getElementById('productModalAdd');
const checkoutModal = document.getElementById('checkoutModal');
const closeCheckout = document.getElementById('closeCheckout');
const checkoutForm = document.getElementById('checkoutForm');
const themeToggle = document.getElementById('themeToggle');

// Dados de produtos mock (substituir pela API real)
const produtosMock = [
    {
        id: 1,
        nome: "Café Torrado (em grãos) - 500g",
        descricao: "Café torrado em grãos, perfeito para moer na hora e preservar o sabor fresco",
        preco: 45.00,
        imagem: "fotos/cafe.png"
    },
    {
        id: 2,
        nome: "Café Torrado (em grãos) - 1kg",
        descricao: "Café torrado em grãos, perfeito para moer na hora e preservar o sabor fresco",
        preco: 90.00,
        imagem: "fotos/cafe.png"
    },
    {
        id: 3,
        nome: "Café Torrado (Moído) - 500g",
        descricao: "Café torrado e moído, perfeito para sua xícara diária",
        preco: 45.00,
        imagem: "fotos/cafe.png"
    },
    {
        id: 4,
        nome: "Café Torrado (Moído) - 1kg",
        descricao: "Café torrado e moído, perfeito para sua xícara diária",
        preco: 90.00,
        imagem: "fotos/cafe.png"
    },
    {
        id: 5,
        nome: "Cápsulas para Máquinas de cápsulas - 8 unidades",
        descricao: "Capsulas compatíveis com máquinas de café expresso, para uma preparação rápida e prática",
        preco: 40.00,
        imagem: "fotos/capsulas.png"
    },
   {
        id: 6,
        nome: "Kit Café Torrado Moído e em grãos - 1kg cada",
        descricao: "Kit com 1kg de café torrado em grãos e 1kg de café torrado moído, para você escolher como prefere preparar",
        preco: 165.00,
        precoOriginal: 200.00,
        imagem: "fotos/cafes.png"
    }
];

// Função para renderizar produtos
function renderProducts() {
    if (!productsGrid) return;
    
    productsGrid.innerHTML = produtos.map(produto => `
        <div class="product-card" data-id="${produto.id}">
            <div class="product-image">
                <img src="${produto.imagem}" alt="${produto.nome}" loading="lazy" decoding="async">
            </div>
            <div class="product-info">
                <h3 class="product-title">${produto.nome}</h3>
                <p class="product-description">${produto.descricao}</p>
                <div class="product-footer">
                    ${produto.precoOriginal ? `
                        <span class="price-original">R$ ${produto.precoOriginal.toFixed(2)}</span>
                        <span class="product-price price-sale">R$ ${produto.preco.toFixed(2)}</span>
                    ` : `
                        <span class="product-price">R$ ${produto.preco.toFixed(2)}</span>
                    `}
                    <button class="add-to-cart" data-id="${produto.id}" aria-label="Adicionar ${produto.nome} ao carrinho">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    bindAddToCartButtons();
}

// Toast de notificação
function showToast(message) {
    if (!toast || !toastMessage) return;
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
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
    if (!cartCount || !cartTotal || !cartItems) return;
    
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
    showToast('Item removido do carrinho');
}

// Limpar/Resetar carrinho completamente
function resetCart() {
    carrinho = [];
    saveCart();
    updateCart();
}

// Animar ícone do carrinho
function animateCartIcon() {
    if (!cartCount) return;
    
    cartCount.classList.add('pulse');
    setTimeout(() => {
        cartCount.classList.remove('pulse');
    }, 600);
}

// Abrir/Fechar carrinho
if (cartButton) {
    cartButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (cartModal) cartModal.classList.add('active');
    });
}

if (closeCart) {
    closeCart.addEventListener('click', () => {
        if (cartModal) cartModal.classList.remove('active');
    });
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

// Limpar carrinho
if (clearCartButton) {
    clearCartButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (carrinho.length === 0) {
            showToast('Seu carrinho já está vazio!');
            return;
        }
        if (confirm('Tem certeza que deseja limpar o carrinho?')) {
            resetCart();
            showToast('Carrinho limpo com sucesso!');
        }
    });
}

// Menu toggle
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        if (navMenu) navMenu.classList.toggle('active');
    });
}

// Fechar menu ao clicar em link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu) navMenu.classList.remove('active');
    });
});

// Slider de depoimentos
function initTestimonials() {
    let currentSlide = 0;
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');

    if (testimonials.length === 0) return;

    function showSlide(n) {
        testimonials.forEach(t => t.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        const idx = ((n % testimonials.length) + testimonials.length) % testimonials.length;
        testimonials[idx].classList.add('active');
        if (dots[idx]) dots[idx].classList.add('active');
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + testimonials.length) % testimonials.length;
            showSlide(currentSlide);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % testimonials.length;
            showSlide(currentSlide);
        });
    }

    if (dots.length === testimonials.length) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
            });
        });
    }
}

let currentModalProductId = null;

// Product modal helpers
function openProductModal(id) {
    const produto = produtos.find(p => p.id === id);
    if (!produto || !productModal) return;
    
    productModalImg.src = produto.imagem;
    productModalImg.alt = produto.nome;
    productModalTitle.textContent = produto.nome;
    productModalDesc.textContent = produto.descricao;
    if (produto.precoOriginal) {
        productModalPrice.innerHTML = `
            <span class="price-original">R$ ${produto.precoOriginal.toFixed(2)}</span>
            <span class="product-price price-sale">R$ ${produto.preco.toFixed(2)}</span>
        `;
    } else {
        productModalPrice.textContent = `R$ ${produto.preco.toFixed(2)}`;
    }
    
    if (productModalQty) productModalQty.value = 1;
    currentModalProductId = id;
    
    productModal.setAttribute('aria-hidden', 'false');
}

function closeProductModal() {
    if (!productModal) return;
    productModal.setAttribute('aria-hidden', 'true');
}

if (closeModal) {
    closeModal.addEventListener('click', closeProductModal);
}

if (productModal) {
    productModal.addEventListener('click', (e) => {
        if (e.target === productModal) closeProductModal();
    });
}

// Open modal when clicking a product card/image
if (productsGrid) {
    productsGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.product-card');
        if (!card) return;
        const id = parseInt(card.dataset.id);
        if (!isNaN(id)) openProductModal(id);
    });
}

// Event delegation for cart controls (increase/decrease/remove)
if (cartItems) {
    cartItems.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn || !btn.dataset) return;
        const id = parseInt(btn.dataset.id);
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
        // Remove event listeners existentes para evitar duplicação
        btn.replaceWith(btn.cloneNode(true));
    });
    
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const id = parseInt(this.dataset.id);
            const produto = produtos.find(p => p.id === id);
            if (produto) {
                addToCart(id, produto.nome, produto.preco, produto.imagem);
            }
        });
    });
}

// Add to cart from modal
if (productModalAdd) {
    productModalAdd.addEventListener('click', () => {
        if (!currentModalProductId) return;
        
        const id = parseInt(currentModalProductId);
        const produto = produtos.find(p => p.id === id);
        if (!produto) return;
        
        const qty = parseInt(productModalQty.value) || 1;
        for (let i = 0; i < qty; i++) {
            addToCart(id, produto.nome, produto.preco, produto.imagem);
        }
        closeProductModal();
    });
}

// Checkout modal handling
function openCheckoutModal() {
    if (!checkoutModal) return;
    checkoutModal.style.display = 'flex';
    checkoutModal.setAttribute('aria-hidden', 'false');
}

function closeCheckoutModal() {
    if (!checkoutModal) return;
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
        const reference = document.getElementById('checkoutReference') ? document.getElementById('checkoutReference').value.trim() : '';

        if (carrinho.length === 0) {
            alert('Seu carrinho está vazio');
            return;
        }

        if (!name || !phone || !address) {
            alert('Por favor, preencha todos os campos');
            return;
        }

        // Criar mensagem para WhatsApp
        const total = carrinho.reduce((s, it) => s + it.preco * it.quantidade, 0);
        const itemsText = carrinho.map(item => 
            `• ${item.nome} - ${item.quantidade}x R$ ${item.preco.toFixed(2)}`
        ).join('%0A');
        const referenceText = reference ? `*Complemento/Referência:* ${reference}%0A` : '';

        const message = `*NOVO PEDIDO - Zauli's Coffee*%0A%0A` +
                       `*Cliente:* ${name}%0A` +
                       `*Telefone:* ${phone}%0A` +
                       `*Endereço:* ${address}%0A` +
                       `${referenceText}%0A` +
                       `*Itens do Pedido:*%0A${itemsText}%0A%0A` +
                       `*Total: R$ ${total.toFixed(2)}*%0A%0A` +
                       `Obrigado pela preferência!`;
        
        // Limpar carrinho e redirecionar para WhatsApp
        resetCart();
        closeCheckoutModal();
        if (cartModal) cartModal.classList.remove('active');
        
        // Limpar formulário
        checkoutForm.reset();
        
        // Redirecionar para WhatsApp
        const whatsappNumber = '5511911245236';
        window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
        
        showToast('Pedido enviado com sucesso!');
    });
}

// TEMA - Sistema de alternância claro/escuro CORRIGIDO
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    
    // Se não há tema salvo, usar modo CLARO como padrão
    if (!savedTheme) {
        // Modo claro por padrão
        document.body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
        updateThemeIcon();
        return;
    }
    
    // Se há tema salvo, aplicar
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
    
    updateThemeIcon();
}

// Atualizar ícone do botão
function updateThemeIcon() {
    if (!themeToggle) return;
    const isDark = document.body.classList.contains('dark-theme');
    
    // Ícone: Lua para modo claro, Sol para modo escuro
    if (isDark) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        themeToggle.setAttribute('aria-label', 'Ativar modo claro');
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.setAttribute('aria-label', 'Ativar modo escuro');
    }
}

// Alternar entre temas
function toggleTheme() {
    const isDark = document.body.classList.contains('dark-theme');
    
    if (isDark) {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
        showToast('Modo claro ativado!');
    } else {
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
        showToast('Modo escuro ativado!');
    }
    
    updateThemeIcon();
}

// Adicionar evento de clique no botão de tema
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

// Detectar mudança na preferência do sistema (apenas se não houver escolha salva)
if (window.matchMedia) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Apenas aplicar se não houver preferência salva
    prefersDark.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.body.classList.add('dark-theme');
                updateThemeIcon();
            } else {
                document.body.classList.remove('dark-theme');
                updateThemeIcon();
            }
        }
    });
}

// Inicializar
async function init() {
    // Inicializar tema PRIMEIRO
    initTheme();
    
    // Carregar produtos (mock por enquanto)
    produtos = produtosMock;
    
    // Renderizar produtos
    renderProducts();
    
    // Atualizar carrinho
    updateCart();
    
    // Inicializar slider de depoimentos
    initTestimonials();
    
    // Carregar produtos da API (se necessário)
    /*
    try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Falha ao carregar produtos');
        produtos = await res.json();
        renderProducts();
    } catch (err) {
        console.error(err);
        showToast('Erro ao carregar produtos');
    }
    */
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', init);