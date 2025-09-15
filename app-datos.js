// ==== CONFIGURA TU SHEET ID ====
const SHEET_ID = '1Nn0zkOHfkzBEtQXrq6m-5wFMsyJ4ZkyGcUdlKVsNjLA'; // Pon aquí tu sheet id

const HOJA_NEGOCIO    = 'Negocio';
const HOJA_CATEGORIAS = 'Categorias';
const HOJA_PROMOCIONES= 'Promociones';
const HOJA_PRODUCTOS  = 'Productos';
const HOJA_OPCIONES   = 'Opciones';

async function getSheetData(sheetName) {
    const url = `https://opensheet.elk.sh/${SHEET_ID}/${sheetName}`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error("No se pudo consultar " + sheetName);
    return await resp.json();
}

// ========== Variables globales ==========
let carrito = [];
let total = 0;
let categoriaActual = 'todas';
let slideActual = 0;
let totalSlides = 0;
let productosOpciones = {};
let productosDatos = [];
let categoriasDatos = [];
let promocionesDatos = [];
let negocioDatos = {};
let whatsappBase = '';
let whatsappMensaje = '¡Hola! Me gustaría hacer un pedido';

// ========== Render dinámico y lógica ==========
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Negocio
        negocioDatos = (await getSheetData(HOJA_NEGOCIO))[0];
        document.getElementById('negocio-nombre').textContent = negocioDatos.nombre;
        document.title = negocioDatos.nombre;
        document.getElementById('negocio-logo').src = negocioDatos.logo_url;
        document.getElementById('negocio-slogan').textContent = negocioDatos.slogan;
        document.getElementById('negocio-copyright').textContent = `© ${new Date().getFullYear()} ${negocioDatos.nombre}. Todos los derechos reservados.`;
        document.getElementById('negocio-contacto').textContent = `📞 Teléfono: ${negocioDatos.telefono} | 📧 Email: ${negocioDatos.email}`;
        whatsappBase = `https://wa.me/${negocioDatos.telefono.replace(/[^0-9]/g, '')}?text=`;
        document.getElementById('whatsapp-btn').href = whatsappBase + encodeURIComponent(whatsappMensaje);

        // Footer redes sociales
        document.getElementById('redes-sociales').innerHTML = `
            <a href="${negocioDatos.facebook}" target="_blank" class="bg-blue-600 hover:bg-blue-700 p-3 rounded-full transition duration-300 transform hover:scale-110">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.513c-1.491 0-1.953.927-1.953 1.874v2.247h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.063 24 12.073z"/></svg>
            </a>
            <a href="${negocioDatos.instagram}" target="_blank" class="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 p-3 rounded-full transition duration-300 transform hover:scale-110">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.646.069-4.85.069-3.205 0-3.584-.012-4.85-.069-3.225-.149-4.77-1.694-4.919-4.919C2.175 15.436 2.163 15.056 2.163 12c0-3.204.012-3.584.069-4.85.149-3.225 1.694-4.77 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.012 7.052.07 2.916.216.218 2.915.07 7.052.012 8.332 0 8.741 0 12c0 3.259.012 3.668.07 4.948.147 4.137 2.846 6.835 6.982 6.982C8.332 23.988 8.741 24 12 24c3.259 0 3.668-.012 4.948-.07 4.137-.147 6.835-2.845 6.982-6.982.058-1.28.07-1.689.07-4.948 0-3.259-.012-3.668-.07-4.948C23.988 2.915 21.29.217 17.153.07 15.873.012 15.464 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z"/></svg>
            </a>
            <a href="${negocioDatos.tiktok}" target="_blank" class="bg-black hover:bg-gray-800 p-3 rounded-full transition duration-300 transform hover:scale-110">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.83-.01 8.75-.02 2.98-1.33 5.13-4.13 6.12-2.74.97-5.57-.12-7.13-2.59-1.53-2.44-1.31-5.82.52-8.03 1.54-2.08 4.22-2.89 6.54-2.04.05.02.1.04.16.06v3.84c-.06-.01-.11-.03-.16-.04-1.31-.35-2.63.12-3.32 1.24-.68 1.13-.42 2.63.57 3.54 1.02.95 2.47 1.09 3.73.33 1.24-.75 1.73-2.13 1.49-3.48-.03-.19-.04-.37-.04-.56V.02z"/></svg>
            </a>
        `;

        // Categorías
        categoriasDatos = await getSheetData(HOJA_CATEGORIAS);
        let catHtml = `<div class="flex flex-wrap gap-2">`;
        catHtml += `<button onclick="filtrarCategoria('todas')" class="categoria-btn bg-red-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-red-700 transition duration-300">Todas</button>`;
        categoriasDatos.forEach(cat => {
            catHtml += `<button onclick="filtrarCategoria('${cat.id}')" class="categoria-btn bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-semibold hover:bg-gray-300 transition duration-300">${cat.icono} ${cat.nombre}</button>`;
        });
        catHtml += `</div>`;
        document.getElementById('categorias-filtros').innerHTML = catHtml;

        // Promociones
        promocionesDatos = await getSheetData(HOJA_PROMOCIONES);
        totalSlides = promocionesDatos.length;
        let promHtml = `<h2 class="text-2xl font-bold text-gray-800 mb-4">🎉 Promociones Especiales</h2>
        <div class="relative overflow-hidden rounded-lg">
        <div id="carrusel-promociones" class="flex transition-transform duration-500 ease-in-out">`;
        promocionesDatos.forEach((prom, i) => {
            promHtml += `
            <div class="w-full flex-shrink-0 relative">
                <div class="bg-gradient-to-r from-${prom.color_ini} to-${prom.color_fin} text-white p-6 md:p-8 rounded-lg">
                    <div class="flex flex-col md:flex-row items-center">
                        <div class="md:w-1/3 mb-4 md:mb-0">
                            <img src="${prom.imagen_url}" class="mx-auto h-20"/>
                        </div>
                        <div class="md:w-2/3 md:pl-6 text-center md:text-left">
                            <h3 class="text-2xl md:text-3xl font-bold mb-2">${prom.titulo}</h3>
                            <p class="text-lg mb-4">${prom.detalle}</p>
                            <div class="bg-white text-red-600 px-4 py-2 rounded-full inline-block font-bold">${prom.ahorro}</div>
                        </div>
                    </div>
                </div>
            </div>`;
        });
        promHtml += `</div>
        <button onclick="cambiarSlide(-1)" class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition duration-300">&#8249;</button>
        <button onclick="cambiarSlide(1)" class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition duration-300">&#8250;</button>
        <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        ${promocionesDatos.map((_, i) =>
            `<button onclick="irASlide(${i})" class="w-3 h-3 rounded-full bg-white bg-opacity-50 hover:bg-opacity-100 transition duration-300" id="indicador-${i}"></button>`
        ).join('')}
        </div>
        </div>`;
        document.getElementById('promociones-carrusel').innerHTML = promHtml;
        actualizarCarrusel();
        setInterval(() => cambiarSlide(1), 5000);

        // Productos y opciones
        productosDatos = await getSheetData(HOJA_PRODUCTOS);
        const opciones = await getSheetData(HOJA_OPCIONES);
        productosOpciones = {};
        productosDatos.forEach(prod => {
            productosOpciones[prod.nombre] = {
                tamaños: opciones.filter(o => o.producto_id === prod.id && o.tipo === 'tamaño'),
                complementos: opciones.filter(o => o.producto_id === prod.id && o.tipo === 'complemento')
            };
        });
        let prodHtml = '';
        productosDatos.forEach((prod, idx) => {
            const cat = categoriasDatos.find(c => c.id === prod.categoria_id);
            prodHtml += `
            <div class="producto-card bg-white rounded-lg shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300" data-categoria="${cat.id}">
                <div class="relative h-48">
                    <div class="w-full h-full flex items-center justify-center">
                        <img src="${prod.imagen_url}" class="text-6xl mb-2 h-20 w-20 object-contain mx-auto" alt="${prod.nombre}" />
                        <div class="text-sm font-semibold text-gray-700">${prod.nombre}</div>
                    </div>
                </div>
                <div class="p-4 flex flex-col flex-grow">
                    <div>
                        <h2 class="text-xl font-bold text-gray-800 mb-2">${prod.nombre}</h2>
                        <p class="text-sm text-gray-600 mb-4 flex-grow">${prod.descripcion}</p>
                    </div>
                    <div class="mt-auto pt-4 border-t border-gray-200">
                        <div class="flex justify-between items-center mb-4">
                            <span class="text-lg font-semibold text-gray-900">Desde LPS. ${prod.precio_base}</span>
                        </div>
                        <div class="flex items-center flex-wrap gap-2">
                            <label for="quantity-${idx}" class="text-sm font-medium text-gray-700">CANTIDAD:</label>
                            <input type="number" id="quantity-${idx}" value="1" min="1" class="w-16 px-2 py-1 border border-gray-300 rounded-md text-center">
                            <button onclick="ordenarProducto('${prod.nombre}', ${prod.precio_base}, 'quantity-${idx}')" class="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition duration-300">Ordenar</button>
                        </div>
                    </div>
                </div>
            </div>
            `;
        });
        document.getElementById('productos-grid').innerHTML = prodHtml;
        filtrarCategoria('todas');

        // Carrito y acciones
        window.filtrarCategoria = filtrarCategoria;
        window.ordenarProducto = ordenarProducto;

    } catch(e) {
        console.error("Error cargando datos:", e);
        alert("Error cargando datos del menú. Verifica la configuración de tu Google Sheets.");
    }
});

// ========== Carrusel ==========
function actualizarCarrusel() {
    const carrusel = document.getElementById('carrusel-promociones');
    if (!carrusel) return;
    const desplazamiento = -slideActual * 100;
    carrusel.style.transform = `translateX(${desplazamiento}%)`;
    for (let i = 0; i < totalSlides; i++) {
        const indicador = document.getElementById(`indicador-${i}`);
        if (indicador) {
            if (i === slideActual) {
                indicador.classList.remove('bg-opacity-50');
                indicador.classList.add('bg-opacity-100');
            } else {
                indicador.classList.remove('bg-opacity-100');
                indicador.classList.add('bg-opacity-50');
            }
        }
    }
}
function cambiarSlide(direccion) {
    slideActual += direccion;
    if (slideActual >= totalSlides) slideActual = 0;
    if (slideActual < 0) slideActual = totalSlides - 1;
    actualizarCarrusel();
}
function irASlide(indice) {
    slideActual = indice;
    actualizarCarrusel();
}

// ========== Filtros ==========
function filtrarCategoria(catID) {
    categoriaActual = catID;
    document.querySelectorAll('.categoria-btn').forEach(btn => {
        btn.classList.remove('bg-red-600','text-white');
        btn.classList.add('bg-gray-200','text-gray-700');
        if (btn.textContent.includes('Todas') && catID === 'todas') {
            btn.classList.remove('bg-gray-200','text-gray-700');
            btn.classList.add('bg-red-600','text-white');
        }
        categoriasDatos.forEach(cat => {
            if (btn.textContent.includes(cat.nombre) && catID === cat.id) {
                btn.classList.remove('bg-gray-200','text-gray-700');
                btn.classList.add('bg-red-600','text-white');
            }
        });
    });
    document.querySelectorAll('.producto-card').forEach(card => {
        if(catID === 'todas' || card.dataset.categoria === catID) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

// ========== Modal de opciones ==========
function obtenerImagenProducto(nombre) {
    const prod = productosDatos.find(p => p.nombre === nombre);
    if (prod && prod.imagen_url) {
        return `<img src="${prod.imagen_url}" alt="${nombre}" class="h-16 w-16 object-contain mx-auto" />`;
    }
    return `<div class="h-16 w-16 flex items-center justify-center bg-gray-200"><span class="text-2xl">🍕</span></div>`;
}
function abrirModalOpciones(nombre, precioBase, cantidad, quantityId) {
    const opciones = productosOpciones[nombre];
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
    modal.id = 'modal-opciones';
    modal.dataset.nombre = nombre;
    modal.dataset.precioBase = precioBase;

    modal.innerHTML = `
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div class="bg-red-600 text-white p-4 flex justify-between items-center">
                <h3 class="text-lg font-bold">Personalizar ${nombre}</h3>
                <button onclick="cerrarModalOpciones()" class="text-white hover:text-gray-200 text-xl">×</button>
            </div>
            <div class="p-4">
                <div class="mb-4 flex items-center space-x-4">
                    <div class="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        ${obtenerImagenProducto(nombre)}
                    </div>
                    <div class="flex-1">
                        <div class="text-lg font-semibold">Precio base: LPS. ${precioBase.toFixed(2)}</div>
                        <div class="flex items-center space-x-2 mt-2">
                            <span class="text-sm text-gray-600">Cantidad:</span>
                            <button onclick="cambiarCantidadModal(-1)" class="bg-gray-300 hover:bg-gray-400 text-gray-700 w-6 h-6 rounded-full flex items-center justify-center text-sm">-</button>
                            <span id="cantidad-modal" class="text-sm font-medium min-w-[20px] text-center">${cantidad}</span>
                            <button onclick="cambiarCantidadModal(1)" class="bg-gray-300 hover:bg-gray-400 text-gray-700 w-6 h-6 rounded-full flex items-center justify-center text-sm">+</button>
                        </div>
                    </div>
                </div>
                ${opciones.tamaños && opciones.tamaños.length > 0 ? `
                <div class="mb-6">
                    <h4 class="font-semibold mb-3 text-gray-800">Tamaño:</h4>
                    <div class="space-y-2">
                        ${opciones.tamaños.map((tamaño, index) => `
                            <label class="flex items-center justify-between p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                <div class="flex items-center">
                                    <input type="radio" name="tamaño" value="${index}" ${index === 0 ? 'checked' : ''} class="mr-3">
                                    <span>${tamaño.nombre}</span>
                                </div>
                                <span class="font-medium ${tamaño.precio > 0 ? 'text-green-600' : tamaño.precio < 0 ? 'text-red-600' : 'text-gray-600'}">
                                    ${tamaño.precio > 0 ? '+' : tamaño.precio < 0 ? '-' : ''}${tamaño.precio === "0" ? 'Incluido' : 'LPS. ' + Number(tamaño.precio).toFixed(2)}
                                </span>
                            </label>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
                ${opciones.complementos && opciones.complementos.length > 0 ? `
                <div class="mb-6">
                    <h4 class="font-semibold mb-3 text-gray-800">Complementos:</h4>
                    <div class="space-y-2">
                        ${opciones.complementos.map((complemento, index) => `
                            <label class="flex items-center justify-between p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                <div class="flex items-center">
                                    <input type="checkbox" name="complemento" value="${index}" class="mr-3">
                                    <span>${complemento.nombre}</span>
                                </div>
                                <span class="font-medium text-green-600">
                                    ${complemento.precio === "0" ? 'Gratis' : '+LPS. ' + Number(complemento.precio).toFixed(2)}
                                </span>
                            </label>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
                <div class="border-t pt-4">
                    <div class="flex justify-between items-center mb-4">
                        <span class="text-lg font-bold">Total:</span>
                        <span id="precio-total-opciones" class="text-lg font-bold text-red-600">LPS. ${(precioBase * cantidad).toFixed(2)}</span>
                    </div>
                    <div class="flex space-x-3">
                        <button onclick="cerrarModalOpciones()" class="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-300">
                            Cancelar
                        </button>
                        <button onclick="confirmarOpcionesProducto('${nombre}', ${precioBase}, ${cantidad}, '${quantityId}')" class="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300">
                            Agregar al carrito
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    const inputs = modal.querySelectorAll('input[type="radio"], input[type="checkbox"]');
    inputs.forEach(input => {
        input.addEventListener('change', () => actualizarPrecioOpciones(nombre, precioBase));
    });
    actualizarPrecioOpciones(nombre, precioBase);
}
function cerrarModalOpciones() {
    const modal = document.getElementById('modal-opciones');
    if (modal) {
        document.body.removeChild(modal);
        document.body.style.overflow = '';
    }
}
function cambiarCantidadModal(cambio) {
    const cantidadElement = document.getElementById('cantidad-modal');
    if (!cantidadElement) return;
    let cantidadActual = parseInt(cantidadElement.textContent);
    cantidadActual += cambio;
    if (cantidadActual < 1) cantidadActual = 1;
    cantidadElement.textContent = cantidadActual;
    const modalElement = document.getElementById('modal-opciones');
    if (modalElement) {
        const nombre = modalElement.dataset.nombre;
        const precioBase = parseFloat(modalElement.dataset.precioBase);
        actualizarPrecioOpciones(nombre, precioBase);
    }
}
function actualizarPrecioOpciones(nombre, precioBase, cantidadParametro = null) {
    const cantidadElement = document.getElementById('cantidad-modal');
    const cantidad = cantidadElement ? parseInt(cantidadElement.textContent) : (cantidadParametro || 1);
    const opciones = productosOpciones[nombre];
    let precioUnitario = precioBase;
    const tamañoSeleccionado = document.querySelector('input[name="tamaño"]:checked');
    if (tamañoSeleccionado && opciones.tamaños) {
        const indiceTamaño = parseInt(tamañoSeleccionado.value);
        const incrementoTamaño = Number(opciones.tamaños[indiceTamaño].precio);
        precioUnitario = precioBase + incrementoTamaño;
    }
    const complementosSeleccionados = document.querySelectorAll('input[name="complemento"]:checked');
    let totalComplementos = 0;
    complementosSeleccionados.forEach(complemento => {
        const indiceComplemento = parseInt(complemento.value);
        if (opciones.complementos && opciones.complementos[indiceComplemento]) {
            totalComplementos += Number(opciones.complementos[indiceComplemento].precio);
        }
    });
    precioUnitario += totalComplementos;
    const precioTotal = precioUnitario * cantidad;
    const precioTotalElement = document.getElementById('precio-total-opciones');
    if (precioTotalElement) {
        precioTotalElement.textContent = `LPS. ${precioTotal.toFixed(2)}`;
    }
}
function confirmarOpcionesProducto(nombre, precioBase, cantidadOriginal, quantityId) {
    const cantidadElement = document.getElementById('cantidad-modal');
    const cantidad = cantidadElement ? parseInt(cantidadElement.textContent) : cantidadOriginal;
    const opciones = productosOpciones[nombre];
    let precioUnitario = precioBase;
    let nombreFinal = nombre;
    let detallesOpciones = [];
    const tamañoSeleccionado = document.querySelector('input[name="tamaño"]:checked');
    if (tamañoSeleccionado && opciones.tamaños) {
        const indiceTamaño = parseInt(tamañoSeleccionado.value);
        const tamaño = opciones.tamaños[indiceTamaño];
        precioUnitario = precioBase + Number(tamaño.precio);
        detallesOpciones.push(tamaño.nombre);
    }
    const complementosSeleccionados = document.querySelectorAll('input[name="complemento"]:checked');
    let totalComplementos = 0;
    complementosSeleccionados.forEach(complemento => {
        const indiceComplemento = parseInt(complemento.value);
        if (opciones.complementos && opciones.complementos[indiceComplemento]) {
            const comp = opciones.complementos[indiceComplemento];
            detallesOpciones.push(comp.nombre);
            totalComplementos += Number(comp.precio);
        }
    });
    precioUnitario += totalComplementos;
    cerrarModalOpciones();
    agregarAlCarritoDirecto(nombreFinal, precioUnitario, cantidad, quantityId, detallesOpciones);
}

// ========== Carrito ==========
function agregarAlCarritoDirecto(nombre, precio, cantidad, quantityId, detallesOpciones = []) {
    const item = { nombre, precio, cantidad, detalles: detallesOpciones };
    carrito.push(item);
    actualizarCarrito();
    mostrarBotonCarrito();
}
function mostrarBotonCarrito() {
    const btn = document.getElementById('carrito-flotante');
    if (btn) btn.classList.remove('hidden');
    actualizarContadorCarrito();
}
function actualizarContadorCarrito() {
    const contador = document.getElementById('contador-carrito');
    if (contador) contador.textContent = carrito.length;
}
function actualizarCarrito() {
    const itemsDiv = document.getElementById('items-carrito-modal');
    const totalDiv = document.getElementById('total-carrito-modal');
    const vacioDiv = document.getElementById('carrito-vacio');
    const footerDiv = document.getElementById('footer-carrito');
    if (carrito.length === 0) {
        itemsDiv.innerHTML = '';
        vacioDiv.style.display = '';
        footerDiv.style.display = 'none';
        total = 0;
        actualizarContadorCarrito();
        return;
    }
    vacioDiv.style.display = 'none';
    footerDiv.style.display = '';
    total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    totalDiv.textContent = `LPS. ${total.toFixed(2)}`;
    itemsDiv.innerHTML = carrito.map((item, idx) => `
        <div class="border rounded-lg p-3 flex justify-between items-center">
            <div>
                <div class="font-semibold">${item.nombre}</div>
                ${item.detalles && item.detalles.length > 0 ? `<div class="text-xs text-gray-600">${item.detalles.join(", ")}</div>` : ''}
                <div class="text-sm text-gray-700">Cantidad: ${item.cantidad}</div>
            </div>
            <div class="flex flex-col items-end">
                <div class="font-bold text-red-600">LPS. ${(item.precio * item.cantidad).toFixed(2)}</div>
                <button onclick="eliminarItemCarrito(${idx})" class="mt-2 px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200">Eliminar</button>
            </div>
        </div>
    `).join('');
    actualizarContadorCarrito();
}
function eliminarItemCarrito(idx) {
    carrito.splice(idx, 1);
    actualizarCarrito();
}
function abrirModal() {
    document.getElementById('modal-carrito').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    actualizarCarrito();
}
function cerrarModal() {
    document.getElementById('modal-carrito').classList.add('hidden');
    document.body.style.overflow = '';
}
function vaciarCarrito() {
    carrito = [];
    actualizarCarrito();
}
function actualizarCamposFormulario() {
    const tipo = document.getElementById('tipo-pedido').value;
    document.getElementById('campo-telefono').style.display = (tipo === 'domicilio' || tipo === 'llevar') ? '' : 'none';
    document.getElementById('campo-direccion').style.display = tipo === 'domicilio' ? '' : 'none';
    document.getElementById('campo-mesa').style.display = tipo === 'restaurante' ? '' : 'none';
}

// ========== WhatsApp ==========
function enviarPorWhatsApp() {
    if (carrito.length === 0) return;
    const tipo = document.getElementById('tipo-pedido').value;
    const nombre = document.getElementById('nombre-cliente').value.trim();
    const telefono = document.getElementById('telefono-cliente').value.trim();
    const direccion = document.getElementById('direccion-cliente').value.trim();
    const mesa = document.getElementById('mesa-cliente').value.trim();
    if (!nombre) { alert('Por favor ingresa tu nombre'); return; }
    if ((tipo === 'domicilio' || tipo === 'llevar') && !telefono) { alert('Por favor ingresa tu teléfono'); return; }
    if (tipo === 'domicilio' && !direccion) { alert('Por favor ingresa tu dirección'); return; }
    if (tipo === 'restaurante' && !mesa) { alert('Por favor ingresa tu número de mesa'); return; }

    let mensaje = `*Pedido desde menú digital*\n`;
    mensaje += `Nombre: ${nombre}\n`;
    if (telefono) mensaje += `Teléfono: ${telefono}\n`;
    if (tipo === 'domicilio') mensaje += `Dirección: ${direccion}\n`;
    if (tipo === 'restaurante') mensaje += `Mesa: ${mesa}\n`;
    mensaje += `Tipo de pedido: ${tipo}\n\n`;
    mensaje += carrito.map(item =>
        `• ${item.nombre} (${item.detalles ? item.detalles.join(", ") : ""}) x${item.cantidad} - LPS. ${(item.precio * item.cantidad).toFixed(2)}`
    ).join('\n');
    mensaje += `\n\nTotal: LPS. ${total.toFixed(2)}`;
    const url = whatsappBase + encodeURIComponent(mensaje);
    window.open(url, '_blank');
}

// ========== Producto: opciones y orden ==========
function ordenarProducto(nombre, precio, quantityId) {
    const cantidad = parseInt(document.getElementById(quantityId).value);
    if (productosOpciones[nombre] &&
        (productosOpciones[nombre].tamaños.length > 0 || productosOpciones[nombre].complementos.length > 0)) {
        abrirModalOpciones(nombre, precio, cantidad, quantityId);
    } else {
        agregarAlCarritoDirecto(nombre, precio, cantidad, quantityId);
    }
}
