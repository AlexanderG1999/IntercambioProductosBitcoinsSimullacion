// Obtener los usuarios almacenados en localStorage
let users = JSON.parse(localStorage.getItem('users')) || [];

function generateSalt() {
    // Generar un salt aleatorio
    return Math.random().toString(36).substring(2, 15);
}

function hashPassword(password, salt) {
    // Crear un hash utilizando SHA-256 y el salt
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);
    return crypto.subtle.digest('SHA-256', data).then(buffer => {
        const hashArray = Array.from(new Uint8Array(buffer));
        return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    });
}

async function register() {
    // Obtener los valores del formulario
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Validar que todos los campos estén completos
    if (!fullName || !email || !password) {
        alert('Por favor, complete todos los campos.');
        return;
    }

    // Generar un salt único para cada usuario
    const salt = generateSalt();

    // Crear un hash de la contraseña con el salt
    const hashedPassword = await hashPassword(password, salt);

    // Crear un objeto de usuario
    const user = {
        fullName,
        email,
        password: hashedPassword,
        salt
    };

    Swal.fire({
        icon: "success",
        title: "¡Registro exitoso!",
    }).then(() => {
        /// Agregar el usuario al array
        users.push(user);

        // Guardar los usuarios en localStorage
        localStorage.setItem('users', JSON.stringify(users));

        // Limpiar el formulario
        document.getElementById('registrationForm').reset();

        // Redirigir a la página de inicio de sesión
        window.location.href = 'inicio_sesion.html';
    });
}

async function login() {
    // Obtener los valores del formulario de inicio de sesión
    const loginEmail = document.getElementById('loginEmail').value;
    const loginPassword = document.getElementById('loginPassword').value;

    // Obtener los usuarios almacenados en localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Buscar el usuario en el array por email
    const user = users.find(u => u.email === loginEmail);

    // Verificar si se encontró un usuario
    if (user) {
        // Verificar la contraseña utilizando el salt y el hash
        const hashedPassword = await hashPassword(loginPassword, user.salt);

        if (hashedPassword === user.password) {
            // Contraseña válida, almacenar el usuario actual en localStorage
            localStorage.setItem('currentUser', JSON.stringify(user));

            Swal.fire({
                icon: "success",
                title: "¡Bienvenido!",
            }).then(() => {
                // Redirigir al index.html (o a la página que desees)
                window.location.href = 'index.html';
            });
            return;
        }
    }

    // Mostrar mensaje de error (puedes personalizar según tus necesidades)
    Swal.fire({
        icon: "error",
        title: "¡Error!",
        text: "El correo electrónico o la contraseña son incorrectos.",
    });
}
