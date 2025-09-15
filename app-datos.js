// IDs de hojas Google Sheets
const SHEET_ID = '1Nn0zkOHfkzBEtQXrq6m-5wFMsyJ4ZkyGcUdlKVsNjLA';
const HOJA_NEGOCIO = 'Negocio';
const HOJA_CATEGORIAS = 'Categorias';
const HOJA_PROMOCIONES = 'Promociones';
const HOJA_PRODUCTOS = 'Productos';
const HOJA_OPCIONES = 'Opciones';

// Helper: obtiene datos de hoja
async function getSheetData(sheetName) {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;
    const resp = await fetch(url);
    const text = await resp.text();
    return Papa.parse(text, {header:true}).data; // Usar PapaParse para CSV a objeto
}

// Carga todo al iniciar
document.addEventListener('DOMContentLoaded', async () => {
    // Cargar negocio
    const negocio = (await getSheetData(HOJA_NEGOCIO))[0];
    document.getElementById('negocio-nombre').textContent = negocio.nombre;
    document.getElementById('negocio-logo').src = negocio.logo_url;
    document.getElementById('negocio-slogan').textContent = negocio.slogan;
    document.getElementById('negocio-copyright').textContent = `© ${new Date().getFullYear()} ${negocio.nombre}. Todos los derechos reservados.`;
    document.getElementById('negocio-contacto').textContent = `📞 Teléfono: ${negocio.telefono} | 📧 Email: ${negocio.email}`;
    document.getElementById('redes-sociales').innerHTML = `
        <a href="${negocio.facebook}" ...>Facebook</a>
        <a href="${negocio.instagram}" ...>Instagram</a>
        <a href="${negocio.tiktok}" ...>TikTok</a>
    `;

    // Cargar categorías
    const categorias = await getSheetData(HOJA_CATEGORIAS);
    let catHtml = `<div class="flex flex-wrap gap-2">`;
    categorias.forEach(cat => {
        catHtml += `<button onclick="filtrarCategoria('${cat.id}')" class="categoria-btn ...">${cat.icono} ${cat.nombre}</button>`;
    });
    catHtml += `</div>`;
    document.getElementById('categorias-filtros').innerHTML = catHtml;

    // Cargar promociones
    const promociones = await getSheetData(HOJA_PROMOCIONES);
    let promHtml = `<h2 class="text-2xl font-bold text-gray-800 mb-4">🎉 Promociones Especiales</h2>
        <div class="relative overflow-hidden rounded-lg"><div id="carrusel-promociones" class="flex ...">`;
    promociones.forEach(prom => {
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
                        <div class="bg-white text-red-600 px-4 py-2 rounded-full inline-block font-bold">
                            ${prom.ahorro}
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    });
    promHtml += `</div></div>`;
    document.getElementById('promociones-carrusel').innerHTML = promHtml;

    // Cargar productos y opciones
    const productos = await getSheetData(HOJA_PRODUCTOS);
    const opciones = await getSheetData(HOJA_OPCIONES);

    let prodHtml = '';
    productos.forEach(prod => {
        const cat = categorias.find(c => c.id === prod.categoria_id);
        prodHtml += `
        <div class="producto-card bg-white rounded-lg shadow-md overflow-hidden flex flex-col ..." data-categoria="${cat.id}">
            <div class="relative h-48">
                <img src="${prod.imagen_url}" class="mx-auto h-20"/>
                <div class="text-sm font-semibold text-gray-700">${prod.nombre}</div>
            </div>
            <div class="p-4 flex flex-col flex-grow">
                <div>
                    <h2 class="text-xl font-bold text-gray-800 mb-2">${prod.nombre}</h2>
                    <p class="text-sm text-gray-600 mb-4 flex-grow">${prod.descripcion}</p>
                </div>
                <div class="mt-auto pt-4 border-t border-gray-200">
                    <span class="text-lg font-semibold text-gray-900">Desde LPS. ${prod.precio_base}</span>
                    <button onclick="ordenarProducto('${prod.id}')" class="px-4 py-2 bg-green-600 ...">Ordenar</button>
                </div>
            </div>
        </div>`;
    });
    document.getElementById('productos-grid').innerHTML = prodHtml;

    // Guardar opciones para uso en JS
    window.productosOpciones = {};
    productos.forEach(prod => {
        window.productosOpciones[prod.id] = {
            tamaños: opciones.filter(o => o.producto_id === prod.id && o.tipo === 'tamaño'),
            complementos: opciones.filter(o => o.producto_id === prod.id && o.tipo === 'complemento')
        };
    });
});

// Modifica ordenarProducto y otras funciones para usar el ID y window.productosOpciones
