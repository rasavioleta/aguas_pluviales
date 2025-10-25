// Mapa interactivo de Zinacantepec
let mapa;

// Datos de zonas de Zinacantepec
const zonasZinacantepec = [
    {
        id: 1,
        nombre: "Zona Norte",
        coordenadas: [[19.3, -99.75], [19.32, -99.73], [19.31, -99.71], [19.29, -99.73]],
        precipitacion: 750,
        escasez: "Alta",
        poblacion: 15000,
        descripcion: "Zona con precipitación moderada y alta densidad poblacional. Ideal para sistemas de captación domésticos.",
        recomendacion: "Sistemas domésticos con cisternas de 2,000-5,000 litros"
    },
    {
        id: 2,
        nombre: "Zona Centro",
        coordenadas: [[19.28, -99.74], [19.29, -99.72], [19.27, -99.70], [19.26, -99.72]],
        precipitacion: 850,
        escasez: "Media",
        poblacion: 12000,
        descripcion: "Zona con buena precipitación y infraestructura mixta. Excelente para sistemas de captación de mediana escala.",
        recomendacion: "Sistemas domésticos o comunitarios con capacidad de 5,000-10,000 litros"
    },
    {
        id: 3,
        nombre: "Zona Sur",
        coordenadas: [[19.26, -99.74], [19.27, -99.72], [19.25, -99.70], [19.24, -99.72]],
        precipitacion: 950,
        escasez: "Baja",
        poblacion: 8000,
        descripcion: "Zona con alta precipitación y menor densidad poblacional. Perfecta para sistemas comunitarios de captación.",
        recomendacion: "Sistemas comunitarios con gran capacidad de almacenamiento (10,000+ litros)"
    }
];

// Función para inicializar el mapa
function inicializarMapa() {
    // Coordenadas centrales de Zinacantepec
    const centroZinacantepec = [19.28, -99.73];
    
    // Crear mapa
    mapa = L.map('mapid').setView(centroZinacantepec, 12);
    
    // Añadir capa de tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
    }).addTo(mapa);
    
    // Añadir zonas al mapa
    agregarZonasAlMapa();
    
    // Añadir marcador del centro de Zinacantepec
    L.marker(centroZinacantepec)
        .addTo(mapa)
        .bindPopup('<b>Zinacantepec</b><br>Municipio del Estado de México')
        .openPopup();
}

// Función para agregar zonas al mapa
function agregarZonasAlMapa() {
    zonasZinacantepec.forEach(zona => {
        // Determinar color según nivel de precipitación
        let color;
        if (zona.precipitacion < 800) {
            color = '#ff6b6b'; // Rojo para baja precipitación
        } else if (zona.precipitacion < 900) {
            color = '#ffe66d'; // Amarillo para media precipitación
        } else {
            color = '#4ecdc4'; // Verde para alta precipitación
        }
        
        // Crear polígono de la zona
        const poligono = L.polygon(zona.coordenadas, {
            color: color,
            fillOpacity: 0.3,
            weight: 2
        }).addTo(mapa);
        
        // Añadir popup informativo
        poligono.bindPopup(`
            <div class="map-popup">
                <h3>${zona.nombre}</h3>
                <div class="popup-stats">
                    <div class="stat">
                        <strong>Precipitación:</strong> ${zona.precipitacion} mm/anual
                    </div>
                    <div class="stat">
                        <strong>Escasez:</strong> ${zona.escasez}
                    </div>
                    <div class="stat">
                        <strong>Población:</strong> ${zona.poblacion.toLocaleString()} hab.
                    </div>
                </div>
                <p>${zona.descripcion}</p>
                <div class="recomendacion">
                    <strong>Recomendación:</strong> ${zona.recomendacion}
                </div>
            </div>
        `);
        
        // Añadir evento click para mostrar información detallada
        poligono.on('click', function() {
            mostrarInformacionZona(zona);
        });
        
        // Efecto hover
        poligono.on('mouseover', function() {
            this.setStyle({
                fillOpacity: 0.5,
                weight: 3
            });
        });
        
        poligono.on('mouseout', function() {
            this.setStyle({
                fillOpacity: 0.3,
                weight: 2
            });
        });
    });
}

// Función para mostrar información detallada de la zona
function mostrarInformacionZona(zona) {
    const infoPanel = document.getElementById('zone-info');
    
    if (infoPanel) {
        infoPanel.innerHTML = `
            <div class="zone-detail">
                <h3>${zona.nombre}</h3>
                <div class="zone-stats">
                    <div class="stat-item">
                        <span class="stat-label">Precipitación Anual:</span>
                        <span class="stat-value">${zona.precipitacion} mm</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Nivel de Escasez:</span>
                        <span class="stat-value ${zona.escasez.toLowerCase()}">${zona.escasez}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Población Aprox.:</span>
                        <span class="stat-value">${zona.poblacion.toLocaleString()} habitantes</span>
                    </div>
                </div>
                <div class="zone-description">
                    <p>${zona.descripcion}</p>
                </div>
                <div class="zone-recommendation">
                    <h4>Recomendación de Sistema:</h4>
                    <p>${zona.recomendacion}</p>
                </div>
                <div class="zone-potential">
                    <h4>Potencial de Captación:</h4>
                    <ul>
                        <li>Vivienda promedio (100m²): ${Math.round(zona.precipitacion * 100 * 0.8).toLocaleString()} litros/año</li>
                        <li>Escuela (500m²): ${Math.round(zona.precipitacion * 500 * 0.8).toLocaleString()} litros/año</li>
                        <li>Edificio público (1000m²): ${Math.round(zona.precipitacion * 1000 * 0.8).toLocaleString()} litros/año</li>
                    </ul>
                </div>
            </div>
        `;
    }
}

// Función para buscar zona por coordenadas
function buscarZonaPorCoordenadas(lat, lng) {
    return zonasZinacantepec.find(zona => {
        // Verificar si las coordenadas están dentro del polígono
        return puntoEnPoligono([lat, lng], zona.coordenadas);
    });
}

// Algoritmo para verificar si un punto está dentro de un polígono
function puntoEnPoligono(punto, poligono) {
    const x = punto[0], y = punto[1];
    let dentro = false;
    
    for (let i = 0, j = poligono.length - 1; i < poligono.length; j = i++) {
        const xi = poligono[i][0], yi = poligono[i][1];
        const xj = poligono[j][0], yj = poligono[j][1];
        
        const intersect = ((yi > y) !== (yj > y)) &&
            (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        
        if (intersect) dentro = !dentro;
    }
    
    return dentro;
}

// Función para exportar datos del mapa
function exportarDatosMapa() {
    return {
        zonas: zonasZinacantepec,
        fechaActualizacion: new Date().toISOString(),
        fuente: "Datos estimados basados en CONAGUA y censo poblacional"
    };
}

// Inicializar mapa cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('mapid')) {
        inicializarMapa();
        
        // Añadir controles adicionales al mapa
        L.control.scale().addTo(mapa);
        
        // Evento para geolocalización del usuario
        mapa.on('click', function(e) {
            const zona = buscarZonaPorCoordenadas(e.latlng.lat, e.latlng.lng);
            if (zona) {
                mostrarInformacionZona(zona);
                
                // Resaltar la zona clickeada
                mapa.eachLayer(function(layer) {
                    if (layer instanceof L.Polygon) {
                        layer.setStyle({
                            fillOpacity: 0.3,
                            weight: 2
                        });
                    }
                });
                
                // Encontrar y resaltar la zona correspondiente
                setTimeout(() => {
                    mapa.eachLayer(function(layer) {
                        if (layer instanceof L.Polygon && layer._popup) {
                            const popupContent = layer._popup.getContent();
                            if (popupContent.includes(zona.nombre)) {
                                layer.setStyle({
                                    fillOpacity: 0.6,
                                    weight: 3
                                });
                                layer.bringToFront();
                            }
                        }
                    });
                }, 100);
            }
        });
    }
});

// Manejo de errores del mapa
if (typeof mapa !== 'undefined') {
    mapa.on('error', function(e) {
        console.error('Error en el mapa:', e);
        const mapContainer = document.getElementById('mapid');
        if (mapContainer) {
            mapContainer.innerHTML = `
                <div style="padding: 20px; text-align: center; background: var(--agua-clara); border-radius: 8px;">
                    <h3>Error al cargar el mapa</h3>
                    <p>No se pudo cargar el mapa interactivo. Verifica tu conexión a internet.</p>
                    <button onclick="inicializarMapa()" class="cta-button">Reintentar</button>
                </div>
            `;
        }
    });
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        inicializarMapa,
        zonasZinacantepec,
        buscarZonaPorCoordenadas,
        exportarDatosMapa
    };
}