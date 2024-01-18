// Array de productos
const products = [
	{
		title: 'Zapatos Nike',
		price: '0.012 BTC',
		owner: 'Vendedor: Leonardo Andrade',
		image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
		status: 'Disponible'
	},
	{
		title: 'Audífonos',
		price: '0.004 BTC',
		owner: 'Vendedor: Leonardo Andrade',
		image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
		status: 'Disponible'
	},
	{
		title: 'Reloj',
		price: '0.02 BTC',
		owner: 'Vendedor: Leonardo Andrade',
		image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1099&q=80',
		status: 'Disponible'
	},
	{
		title: 'Smartwatch',
		price: '0.036 BTC',
		owner: 'Vendedor: Leonardo Andrade',
		image: 'https://media.wired.com/photos/6511aab1189c419c40374c92/16:9/w_2400,h_1350,c_limit/Apple-Watch-Ultra-2-Alt-Gear.jpg',
		status: 'Disponible'
	},
	{
		title: 'Perfume',
		price: '0.02 BTC',
		owner: 'Vendedor: Leonardo Andrade',
		image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
		status: 'Disponible'
	},
	// Puedes agregar más productos aquí según sea necesario
];

// Función para mostrar los productos del localStorage
function showProducts() {
	const productsList = document.getElementById('productContainer');

	if (localStorage.getItem("products") === null || localStorage.getItem("products") === undefined) {
		// Convertir el array a una cadena JSON
		const productsJSON = JSON.stringify(products);

		// Almacenar la cadena JSON en el localStorage
		localStorage.setItem("products", productsJSON);
	} else {
		// Obtener los productos almacenados en localStorage
		products.value = JSON.parse(localStorage.getItem("products"));
	}

	const storedProducts = JSON.parse(localStorage.getItem("products")) || [];

	// Mostrar los productos en la vista
	productsList.innerHTML = '';

	storedProducts.forEach(product => {
		const containerProduct = document.createElement('div');
		containerProduct.classList.add('item');

		containerProduct.innerHTML = `
        <figure>
          <img src="${product.image}" alt="${product.title}" />
        </figure>
        <div class="info-product">
          <h2>${product.title}</h2>
          <p class="price">${product.price}</p>
          <p class="owner">${product.owner}</p>
          <p class="status">${product.status}</p>
          ${shouldShowButtons(product.owner, product.status) ? `
            <button class="btn-add-cart">Añadir al carrito</button>
            <button class="btn-change-product" data-toggle="modal" data-target="#exampleModalCenter"
                data-product-title="${product.title}" data-product-price="${product.price}">
                Intercambiar Producto
            </button>` : ''}
        </div>
      `;

		productsList.appendChild(containerProduct);
	});
};

// Función para verificar si los botones deben mostrarse
function shouldShowButtons(vendorName, productStatus) {
	if (localStorage.getItem("currentUser")) {
		const currentUser = JSON.parse(localStorage.getItem("currentUser"));
		return 'Vendedor: ' + currentUser && 'Vendedor: ' + currentUser.fullName !== vendorName && productStatus === 'Disponible';
	} else {
		if (productStatus === 'Disponible') {
			return true;
		} else {
			return false;
		};
	}
}

// Llamar a la función para mostrar los productos
showProducts();


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

		// Colocar en status "Disponible" al producto eliminado
		const storedProducts = JSON.parse(localStorage.getItem("products")) || [];

		storedProducts.forEach(product => {
			if (product.title === title) {
				product.status = 'Disponible';
			}
		});

		// Almacenar los productos en localStorage
		localStorage.setItem("products", JSON.stringify(storedProducts));

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

		// Cambiar elementos que estan en el carrito a status "No disponible", comparar con el array del local storage
		const storedProducts = JSON.parse(localStorage.getItem("products")) || [];

		// Verificar si hay un usuario actualmente logueado
		if (localStorage.getItem("currentUser")) {
			storedProducts.forEach(product => {
				if (product.title === containerProduct.querySelector('p').textContent) {
					product.status = 'No disponible';
				}
			});
		}

		// Almacenar los productos en localStorage
		localStorage.setItem("products", JSON.stringify(storedProducts));

		rowProduct.append(containerProduct);

		total =
			total + (product.quantity * parseFloat(product.price.slice(1)));
		totalOfProducts = totalOfProducts + product.quantity;
	});

	valorTotal.innerText = `${total} BTC`;
	countProducts.innerText = totalOfProducts;
};

const btnPagar = document.getElementById('btnPagar');
btnPagar.classList.add('hidden'); // Al iniciar, oculta el botón de pagar

btnPagar.addEventListener('click', () => {
	if (allProducts.length > 0) {
		// Simula un proceso de pago exitoso con SwalAlert y recarga la página
		Swal.fire({
			title: 'Pago exitoso',
			text: '¡Gracias por tu compra!',
			icon: 'success',
			confirmButtonText: 'Aceptar'
		}).then((result) => {
			if (result.isConfirmed) {
				location.reload();
			}
		});


		// Vacía el carrito
		allProducts = [];

		// Actualiza la vista del carrito
		showHTML();
	} else {
		Swal.fire({
			title: 'Error',
			text: 'No hay productos en el carrito',
			icon: 'error',
			confirmButtonText: 'Aceptar'
		});
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
	const clickedProductName = localStorage.getItem("currentProductNameToChange");

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

// Obtener el botón "Agregar" dentro del modal de vender producto
const btnSellProduct = document.getElementById('btnSellProduct');

// Agregar un evento de clic al botón "Agregar" dentro del modal
btnSellProduct.addEventListener('click', () => {
	// Obtener los valores del formulario
	const sellProductName = document.getElementById('sellProductName').value;
	const sellProductPriceDollars = parseFloat(document.getElementById('sellProductPrice').value);
	const sellProductImage = document.getElementById('sellProductImage').files[0];

	// Validar que todos los campos estén completos
	if (!sellProductName || isNaN(sellProductPriceDollars) || !sellProductImage) {
		alert("Por favor, complete todos los campos.");
		return;
	}

	// Convertir el precio de dólares a BTC
	const sellProductPriceBTC = convertToBTC(sellProductPriceDollars);

	// Crear un nuevo objeto de producto
	const newProduct = {
		title: sellProductName,
		price: `${sellProductPriceBTC} BTC`,
		owner: 'Vendedor: ' + currentUser.fullName, // Asignar el nombre del usuario actual como propietario
		image: URL.createObjectURL(sellProductImage), // Obtener la URL de la imagen
		status: 'Disponible'
	};

	// Agregar el nuevo producto al array de productos
	products.value.push(newProduct);

	// Almacenar los productos en localStorage
	localStorage.setItem("products", JSON.stringify(products.value));

	// Mostrar los productos actualizados
	showProducts();

	// Cerrar el modal después de agregar el producto
	$('#sellProductModal').modal('hide');
});