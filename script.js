document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Homepage Interactivity (Search Bar Suggestions) ---
    const searchInput = document.getElementById('product-search');
    const suggestionsList = document.getElementById('suggestions');
    const featuredProducts = ["rice", "flour", "lentils", "cumin", "turmeric", "cinnamon", "combo pack"];

    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        suggestionsList.innerHTML = '';

        if (query.length > 0) {
            const matches = featuredProducts.filter(product => product.includes(query));
            if (matches.length > 0) {
                matches.forEach(match => {
                    const li = document.createElement('li');
                    li.textContent = match;
                    li.addEventListener('click', () => {
                        searchInput.value = match;
                        suggestionsList.innerHTML = '';
                    });
                    suggestionsList.appendChild(li);
                });
            } else {
                 const li = document.createElement('li');
                 li.textContent = 'No products found.';
                 suggestionsList.appendChild(li);
            }
        }
    });
    
    // Simple hide on blur
    searchInput.addEventListener('blur', () => {
        setTimeout(() => suggestionsList.innerHTML = '', 200);
    });

    // --- 2. Product Page Interactivity (Gallery & Price) ---
    const mainImage = document.querySelector('.product-gallery .main-image');
    const thumbnails = document.querySelectorAll('.product-gallery .thumbnail');
    const priceDisplay = document.querySelector('.price-display');
    const quantityOption = document.getElementById('quantity-option');
    const prices = {
        '100g': 199.00,
        '250g': 450.00,
        '500g': 800.00
    };

    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            // Change main image (uses placeholder text to simulate a change)
            mainImage.src = this.src.replace(/&text=.*$/, `&text=${this.alt}`);
            
            // Update active state
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    quantityOption.addEventListener('change', function() {
        const selectedWeight = this.value;
        priceDisplay.textContent = `₹${prices[selectedWeight].toFixed(2)}`;
    });

    // --- 4. Cart Logic ---
    let cart = [];

    function updateCartUI() {
        const cartList = document.getElementById('cart-items-list');
        const cartCount = document.getElementById('cart-count');
        const subtotalSpan = document.getElementById('subtotal');
        const totalPriceSpan = document.getElementById('total-price');

        cartList.innerHTML = '';
        let subtotal = 0;

        if (cart.length === 0) {
            cartList.innerHTML = '<p>Your cart is empty. Try adding the Premium Cumin Seeds!</p>';
        } else {
            cart.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;

                const cartItemHTML = `
                    <div class="cart-item" data-index="${index}">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="item-details">
                            <strong>${item.name}</strong>
                            <p>${item.weight} | ₹${item.price.toFixed(2)} each</p>
                        </div>
                        <div class="item-quantity-edit">
                            <input type="number" min="1" value="${item.quantity}" data-index="${index}" class="quantity-input">
                        </div>
                        <span class="item-price">₹${itemTotal.toFixed(2)}</span>
                        <button class="remove-item-btn" data-index="${index}"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                cartList.insertAdjacentHTML('beforeend', cartItemHTML);
            });
        }
        
        // Update summary
        const discount = 0; // Simple example, apply promo logic here
        const total = subtotal - discount;

        cartCount.textContent = cart.length;
        subtotalSpan.textContent = `₹${subtotal.toFixed(2)}`;
        totalPriceSpan.textContent = `₹${total.toFixed(2)}`;
        document.getElementById('final-total').textContent = total.toFixed(2);

        // Re-attach event listeners for dynamic elements
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', handleQuantityChange);
        });
        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', handleRemoveItem);
        });
    }

    function handleQuantityChange(event) {
        const index = event.target.dataset.index;
        const newQuantity = parseInt(event.target.value);
        if (newQuantity > 0) {
            cart[index].quantity = newQuantity;
            updateCartUI();
        } else {
            event.target.value = cart[index].quantity; // Revert if input is invalid
        }
    }

    function handleRemoveItem(event) {
        const index = event.currentTarget.dataset.index;
        cart.splice(index, 1);
        updateCartUI();
    }

    // Add to Cart Button Logic (for the example product)
    document.getElementById('add-to-cart-btn').addEventListener('click', () => {
        const weight = quantityOption.value;
        const price = prices[weight];

        const newItem = {
            id: 'cumin-001-' + weight,
            name: 'Premium Cumin Seeds',
            weight: weight,
            price: price,
            quantity: 1,
            image: 'https://via.placeholder.com/60x60?text=Cumin'
        };

        // Check if item of same weight is already in cart
        const existingItem = cart.find(item => item.weight === weight);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push(newItem);
        }

        updateCartUI();
        alert(`${weight} of Premium Cumin Seeds added to cart!`);
    });
    
    // Promo Code Logic
    document.getElementById('apply-promo-btn').addEventListener('click', () => {
        const promoInput = document.getElementById('promo-code-input').value.toUpperCase();
        const promoStatus = document.getElementById('promo-status');
        if (promoInput === 'SAVE10') {
            promoStatus.textContent = 'Coupon SAVE10 applied! You would save 10% in a real application.';
            promoStatus.classList.add('success');
        } else {
            promoStatus.textContent = 'Invalid promo code.';
            promoStatus.classList.remove('success');
        }
    });

    // --- Checkout Modal Logic ---
    const checkoutModal = document.getElementById('checkout-modal');
    const proceedToCheckoutBtn = document.getElementById('proceed-to-checkout-btn');
    const closeModalBtn = checkoutModal.querySelector('.close-btn');

    proceedToCheckoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
             alert("Your cart is empty. Please add items before checking out.");
             return;
        }
        checkoutModal.classList.add('active');
    });

    closeModalBtn.addEventListener('click', () => {
        checkoutModal.classList.remove('active');
    });

    // Close modal if user clicks outside
    window.addEventListener('click', (event) => {
        if (event.target === checkoutModal) {
            checkoutModal.classList.remove('active');
        }
    });
    
    // Guest/Registered Toggle
    const guestBtn = document.getElementById('guest-checkout-btn');
    const registeredBtn = document.getElementById('registered-checkout-btn');
    const loginForm = document.getElementById('login-form');

    guestBtn.addEventListener('click', () => {
        guestBtn.classList.add('active');
        registeredBtn.classList.remove('active');
        loginForm.classList.add('hidden');
    });

    registeredBtn.addEventListener('click', () => {
        registeredBtn.classList.add('active');
        guestBtn.classList.remove('active');
        loginForm.classList.remove('hidden');
    });

    // Place Order Button
    document.getElementById('place-order-btn').addEventListener('click', () => {
        const addressForm = document.getElementById('delivery-address-form');
        if (addressForm.checkValidity()) {
            // Simple mock-up of successful order
            alert(`Order Placed Successfully! Total: ₹${document.getElementById('final-total').textContent}`);
            cart = []; // Empty the cart
            checkoutModal.classList.remove('active');
            updateCartUI();
        } else {
            alert('Please fill out all delivery address details.');
            addressForm.reportValidity(); // Trigger native browser validation UI
        }
    });


    // --- 5. User Account Logic ---
    const loginSignupBtn = document.getElementById('login-signup-btn');
    const authSection = document.getElementById('auth-section');
    const profileSection = document.getElementById('profile-section');
    const accountLink = document.getElementById('account-link');

    // Simple state management for demonstration
    let isLoggedIn = false;

    // Toggle between login/profile view
    function toggleAccountView() {
        if (isLoggedIn) {
            authSection.classList.add('hidden');
            profileSection.classList.remove('hidden');
            accountLink.innerHTML = '<i class="fas fa-user"></i> Profile';
        } else {
            authSection.classList.remove('hidden');
            profileSection.classList.add('hidden');
            accountLink.innerHTML = '<i class="fas fa-user"></i> Account';
        }
    }

    loginSignupBtn.addEventListener('click', () => {
        // Mocking a successful login/signup
        isLoggedIn = true;
        toggleAccountView();
        alert('Login/Sign Up successful! Welcome to your profile.');
    });

    // Initial load call
    toggleAccountView();
    updateCartUI(); // Initial cart render
});

// --- Scroll Animation Trigger (to demonstrate 'slide-up' on view) ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideUp 0.8s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.animated-section').forEach(section => {
    observer.observe(section);
});