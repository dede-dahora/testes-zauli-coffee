// Dados dos produtos
const produtos = [
    {
        id: 1,
        nome: "Café Mineiro Torrado e Moído, 500g",
        descricao: "Café Mineiro Torrado e Moído, 500g - Sabor encorpado e aroma intenso.",
        preco: 45.00,
        imagem: "https://images.unsplash.com/photo-1587734195507-6f5e8a2543c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 2,
        nome: "Café Mineiro Torrado e Moído, 1kg",
        descricao: "Café Mineiro Torrado e Moído, 1kg - Sabor encorpado e aroma intenso.",
        preco: 90.00,
        imagem: "https://images.unsplash.com/photo-1587734195507-6f5e8a2543c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 3,
        nome: "Café Mineiro Torrado (em grãos), 500g",
        descricao: "Café Mineiro Torrado em grãos, 500g - Sabor encorpado e aroma intenso.",
        preco: 45.00,
        imagem: "https://images.unsplash.com/photo-1587734195503-6f5e8a2543c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 4,
        nome: "Café Mineiro Torrado (em grãos), 1kg",
        descricao: "Café Mineiro Torrado em grãos, 1kg - Sabor encorpado e aroma intenso.",
        preco: 90.00,
        imagem: "https://images.unsplash.com/photo-1587734195503-6f5e8a2543c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 5,
        nome: "Café Descafeinado 500g",
        descricao: "Processo Swiss Water, mantendo todo o sabor sem a cafeína.",
        preco: 55.00,
        imagem: "https://images.unsplash.com/photo-1587734195507-6f5e8a2543c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 6,
        nome: "Kit Premium Zauli's",
        descricao: "Kit com 3 variedades especiais + caneca personalizada.",
        preco: 149.90,
        imagem: "https://images.unsplash.com/photo-1587734195507-6f5e8a2543c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
];

// Estado do carrinho
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

// Elementos DOM
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const productsGrid = document.getElementById('productsGrid');
const cartButton = document.getElementById('cartButton');
const cartModal = document.getElementById('cartModal')