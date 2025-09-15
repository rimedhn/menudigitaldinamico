// Pon aquí el ID de tu Google Sheet
const SHEET_ID = '1Nn0zkOHfkzBEtQXrq6m-5wFMsyJ4ZkyGcUdlKVsNjLA'; // <-- Cámbialo por tu ID real

const HOJA_NEGOCIO    = 'Negocio';
const HOJA_CATEGORIAS = 'Categorias';
const HOJA_PROMOCIONES= 'Promociones';
const HOJA_PRODUCTOS  = 'Productos';
const HOJA_OPCIONES   = 'Opciones';

// Helper para consultar OpenSheet
async function getSheetData(sheetName) {
    const url = `https://opensheet.elk.sh/${SHEET_ID}/${sheetName}`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error("No se pudo consultar " + sheetName);
    return await resp.json();
}

function crearRedSocial(icon, url, colorClass, svg) {
    return `<a href="${url}" target="_blank" class="${colorClass} p-3 rounded-full transition duration-300 transform hover:scale-110">${svg}</a>`;
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 1. Negocio
        const negocio = (await getSheetData(HOJA_NEGOCIO))[0];
        document.getElementById('negocio-nombre').textContent = negocio.nombre;
        document.title = negocio.nombre;
        document.getElementById('negocio-logo').src = negocio.logo_url;
        document.getElementById('negocio-slogan').textContent = negocio.slogan;
        document.getElementById('negocio-copyright').textContent = `© ${new Date().getFullYear()} ${negocio.nombre}. Todos los derechos reservados.`;
        document.getElementById('negocio-contacto').textContent = `📞 Teléfono: ${negocio.telefono} | 📧 Email: ${negocio.email}`;

        // 2. Redes sociales
        const redesHtml = 
            crearRedSocial('facebook', negocio.facebook, 'bg-blue-600 hover:bg-blue-700', `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.513c-1.491 0-1.953.927-1.953 1.874v2.247h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.063 24 12.073z"/></svg>`) +
            crearRedSocial('instagram', negocio.instagram, 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600', `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.646.069-4.85.069-3.205 0-3.584-.012-4.85-.069-3.225-.149-4.77-1.694-4.919-4.919C2.175 15.436 2.163 15.056 2.163 12c0-3.204.012-3.584.069-4.85.149-3.225 1.694-4.77 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.012 7.052.07 2.916.216.218 2.915.07 7.052.012 8.332 0 8.741 0 12c0 3.259.012 3.668.07 4.948.147 4.137 2.846 6.835 6.982 6.982C8.332 23.988 8.741 24 12 24c3.259 0 3.668-.012 4.948-.07 4.137-.147 6.835-2.845 6.982-6.982.058-1.28.07-1.689.07-4.948 0-3.259-.012-3.668-.07-4.948C23.988 2.915 21.29.217 17.153.07 15.873.012 15.464 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z"/></svg>`) +
            crearRedSocial('tiktok', negocio.tiktok, 'bg-black hover:bg-gray-800', `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.83-.01 8.75-.02 2.98-1.33 5.13-4.13 6.12-2.74.97-5.57-.12-7.13-2.59-1.53-2.44-1.31-5.82.52-8.03 1.54-2.08 4.22-2.89 6.54-2.04.05.02.1.04.16.06v3.84c-.06-.01-.11-.03-.16-.04-1.31-.35-2.63.12-3.32 1.24-.68 1.13-.42 2.63.57 3.54 1.02.95 2.47 1.09 3.73.33 1.24-.75 1.73-2.13 1.49-3.48-.03-.19-.04-.37-.04-.56V.02z"/></svg>`);
        document.getElementById('redes-sociales').innerHTML = redesHtml;

        // 3. Categorías
        const categorias = await getSheetData(HOJA_CATEGORIAS);
        let catHtml = `<div class="flex flex-wrap gap-2">`;
        catHtml += `<button onclick="filtrarCategoria('todas')" class="categoria-btn bg-red-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-red-700 transition duration-300">Todas</button>`;
        categorias.forEach(cat => {
            catHtml += `<button onclick="filtrarCategoria('${cat.id}')" class="categoria-btn bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-semibold hover:bg-gray-300 transition duration-300">${cat.icono} ${cat.nombre}</button>`;
        });
        catHtml += `</div>`;
        document.getElementById('categorias-filtros').innerHTML = catHtml;

        // 4. Promociones
        const promociones = await getSheetData(HOJA_PROMOCIONES);
        let promHtml = `<h2 class="text-2xl font-bold text-gray-800 mb-4">🎉 Promociones Especiales</h2>
        <div class="relative overflow-hidden rounded-lg"><div id="carrusel-promociones" class="flex transition-transform duration-500 ease-in-out">`;
        promociones.forEach((prom, i) => {
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
        promHtml += `</div></div>`;
        document.getElementById('promociones-carrusel').innerHTML = promHtml;

        // 5. Productos y opciones
        const productos = await getSheetData(HOJA_PRODUCTOS);
        const opciones = await getSheetData(HOJA_OPCIONES);

        // Opciones indexadas por producto_id
        const opcionesPorProducto = {};
        opciones.forEach(option => {
            if (!opcionesPorProducto[option.producto_id]) opcionesPorProducto[option.producto_id] = { tamaños: [], complementos: [] };
            if (option.tipo === 'tamaño') opcionesPorProducto[option.producto_id].tamaños.push(option);
            if (option.tipo === 'complemento') opcionesPorProducto[option.producto_id].complementos.push(option);
        });

        let prodHtml = '';
        productos.forEach(prod => {
            const cat = categorias.find(c => c.id === prod.categoria_id);
            prodHtml += `
            <div class="producto-card bg-white rounded-lg shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300" data-categoria="${cat.id}">
                <div class="relative h-48 flex items-center justify-center">
                    <img src="${prod.imagen_url}" class="mx-auto h-20" alt="${prod.nombre}" />
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
                        <button onclick="ordenarProducto('${prod.id}')" class="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition duration-300">Ordenar</button>
                    </div>
                </div>
            </div>`;
        });
        document.getElementById('productos-grid').innerHTML = prodHtml;

        // Guardar opciones en global
        window.productosOpciones = opcionesPorProducto;
        window.productosDatos = productos;
        window.categoriasDatos = categorias;

        // Filtrado inicial
        window.filtrarCategoria = function(id) {
            const cards = document.querySelectorAll('.producto-card');
            cards.forEach(card => {
                if (id === 'todas' || card.dataset.categoria === id) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        };
        window.filtrarCategoria('todas');

        // Función de ordenarProducto (ejemplo simple)
        window.ordenarProducto = function(productoId) {
            const producto = window.productosDatos.find(p => p.id === productoId);
            const opciones = window.productosOpciones[productoId] || { tamaños: [], complementos: [] };
            alert(`Producto: ${producto.nombre}\nPrecio base: ${producto.precio_base}\nOpciones disponibles: ${opciones.tamaños.length + opciones.complementos.length}`);
            // Aquí puedes abrir un modal como en el original, usando los datos dinámicamente
        };

    } catch(e) {
        console.error("Error cargando datos:", e);
        alert("Error cargando datos del menú. Verifica la configuración de tu Google Sheets.");
    }
});
