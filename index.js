const btnCart = document.querySelector('.container-cart-icon');
const containerCartProducts = document.querySelector(
	'.container-cart-products'
);

btnCart.addEventListener('click', () => {
	containerCartProducts.classList.toggle('hidden-cart');
});

/* ========================= */
const cartInfo = document.querySelector('.cart-product');
const rowProduct = document.querySelector('.row-product');

// Lista de todos los contenedores de productos
const productsList = document.querySelector('.container-items');

// Variable de arreglos de Productos
let allProducts = [];

const valorTotal = document.querySelector('.total-pagar');

const countProducts = document.querySelector('#contador-productos');

const cartEmpty = document.querySelector('.cart-empty');
const cartTotal = document.querySelector('.cart-total');

productsList.addEventListener('click', e => {
	if (e.target.classList.contains('btn-add-cart')) {
		const product = e.target.parentElement;

		const infoProduct = {
			quantity: 1,
			title: product.querySelector('h2').textContent,
			price: product.querySelector('p').textContent,
		};

		const exits = allProducts.some(
			product => product.title === infoProduct.title
		);

		if (exits) {
			const products = allProducts.map(product => {
				if (product.title === infoProduct.title) {
					product.quantity++;
					return product;
				} else {
					return product;
				}
			});
			allProducts = [...products];
		} else {
			allProducts = [...allProducts, infoProduct];
		}

		showHTML();
	}
});

rowProduct.addEventListener('click', e => {
	if (e.target.classList.contains('icon-close')) {
		const product = e.target.parentElement;
		const title = product.querySelector('p').textContent;

		allProducts = allProducts.filter(
			product => product.title !== title
		);

		console.log(allProducts);

		showHTML();
	}
});

// Funcion para mostrar  HTML
const showHTML = () => {
	if (!allProducts.length) {
		cartEmpty.classList.remove('hidden');
		rowProduct.classList.add('hidden');
		cartTotal.classList.add('hidden');
		btnPagar.classList.add('hidden'); // Oculta el botón de pagar cuando el carrito está vacío
	} else {
		cartEmpty.classList.add('hidden');
		rowProduct.classList.remove('hidden');
		cartTotal.classList.remove('hidden');
		btnPagar.classList.remove('hidden');
	}

	// Limpiar HTML
	rowProduct.innerHTML = '';

	let total = 0;
	let totalOfProducts = 0;

	allProducts.forEach(product => {
		const containerProduct = document.createElement('div');
		containerProduct.classList.add('cart-product');

		containerProduct.innerHTML = `
            <div class="info-cart-product">
                <span class="cantidad-producto-carrito">${product.quantity}</span>
                <p class="titulo-producto-carrito">${product.title}</p>
                <span class="precio-producto-carrito">${product.price}</span>
            </div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="icon-close"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                />
            </svg>
        `;

		rowProduct.append(containerProduct);

		total =
			total + (product.quantity * parseFloat(product.price.slice(1)));
		totalOfProducts = totalOfProducts + product.quantity;
	});

	valorTotal.innerText = `$${total}`;
	countProducts.innerText = totalOfProducts;
};

const btnPagar = document.getElementById('btnPagar');
btnPagar.classList.add('hidden'); // Al iniciar, oculta el botón de pagar

btnPagar.addEventListener('click', () => {
	if (allProducts.length > 0) {
		// Simula un proceso de pago exitoso
		alert("Pago exitoso");

		// Vacía el carrito
		allProducts = [];

		// Actualiza la vista del carrito
		showHTML();
	} else {
		alert("Carrito vacío. Añade productos al carrito antes de pagar.");
	}
});

/* -------------------------- Funciones para boton Intercambiar Producto -------------------------- */
// Función para convertir el precio a BTC (solo es una simulación, puedes adaptarla según tu necesidad)
function convertToBTC(priceInDollars) {
	// Supongamos que 1 BTC = 50000 dólares
	const btcExchangeRate = 50000;
	const priceInBTC = priceInDollars / btcExchangeRate;
	return priceInBTC.toFixed(6);  // Limitar a 8 decimales para simular la precisión de BTC
}


const btnSubmit = document.getElementById('btnSubmit');

btnSubmit.addEventListener('click', function () {
	const productName = document.getElementById('productName').value;
	const productImage = document.getElementById('productImage').files[0];
	const productPrice = parseFloat(document.getElementById('productPrice').value);

	// Validar que todos los campos estén completos
	if (!productName || !productImage || isNaN(productPrice)) {
		alert("Por favor, complete todos los campos.");
		return;
	}

	// Simulación de cálculo del precio a pagar en BTC
	const productPriceBTC = convertToBTC(productPrice);

	// Obtener el nombre del producto actual donde se hizo clic
	const clickedProductName = document.querySelector('.info-product h2').textContent;
	console.log(clickedProductName)

	// Agregar el producto al carrito con el precio calculado
	const infoProduct = {
		quantity: 1,
		title: clickedProductName, // Usar el nombre del producto actual
		price: `${productPriceBTC} BTC`, // Mostrar que el precio está en BTC
	};

	// Agregar el producto al arreglo de productos
	allProducts = [...allProducts, infoProduct];

	// Mostrar el carrito con el nuevo producto
	showHTML();

	// Cerrar el modal después de realizar las operaciones
	$('#exampleModalCenter').modal('hide');
});