// Constantes para cálculos de captación de agua
const COEFICIENTES_MATERIAL = {
    'lamina': 0.9,
    'teja': 0.8,
    'concreto': 0.7,
    'madera': 0.6
};

const PRECIPITACION_ZINACANTEPEC = 850; // mm anuales
const COSTO_AGUA_M3 = 25; // $MXN por m³

// Función principal de cálculo
function calcularAguaCaptable(areaTecho, precipitacion, coeficienteMaterial) {
    // Fórmula: Volumen (litros) = Área (m²) × Precipitación (mm) × Coeficiente × 0.9
    // El factor 0.9 es para considerar pérdidas por evaporación y otros factores
    const volumenLitros = areaTecho * precipitacion * coeficienteMaterial * 0.9;
    const volumenM3 = volumenLitros / 1000;
    
    return {
        volumenLitros: Math.round(volumenLitros),
        volumenM3: parseFloat(volumenM3.toFixed(2))
    };
}

// Función para calcular equivalencias prácticas
function calcularEquivalencias(volumenLitros) {
    const duchas = Math.floor(volumenLitros / 50); // 50L por ducha
    const riegosJardin = Math.floor(volumenLitros / 500); // 500L por riego
    const lavadasAuto = Math.floor(volumenLitros / 200); // 200L por lavada
    const tinacos = parseFloat((volumenLitros / 1100).toFixed(1)); // Tinaco de 1100L
    
    return {
        duchas,
        riegosJardin,
        lavadasAuto,
        tinacos
    };
}

// Función para calcular ahorro económico
function calcularAhorro(volumenM3) {
    const ahorroAnual = volumenM3 * COSTO_AGUA_M3;
    const ahorroMensual = ahorroAnual / 12;
    
    return {
        anual: parseFloat(ahorroAnual.toFixed(2)),
        mensual: parseFloat(ahorroMensual.toFixed(2))
    };
}

// Función para mostrar resultados
function mostrarResultados(resultados) {
    const resultadoDiv = document.getElementById('result');
    const volumenLitros = resultados.volumenLitros;
    const volumenM3 = resultados.volumenM3;
    
    // Calcular equivalencias
    const equivalencias = calcularEquivalencias(volumenLitros);
    const ahorro = calcularAhorro(volumenM3);
    
    // Actualizar elementos del DOM
    document.getElementById('waterVolume').textContent = `Volumen anual captable: ${volumenM3} m³ (${volumenLitros.toLocaleString()} litros)`;
    document.getElementById('waterVolumeHighlight').textContent = `${volumenLitros.toLocaleString()} L`;
    
    const usoText = `Equivale a: ${equivalencias.duchas} duchas, ${equivalencias.riegosJardin} riegos de jardín o ${equivalencias.lavadasAuto} lavadas de auto al año`;
    document.getElementById('waterUsage').textContent = usoText;
    
    const ahorroText = `Ahorro potencial: $${ahorro.anual.toLocaleString()} MXN anuales ($${ahorro.mensual.toLocaleString()} mensuales) - ${equivalencias.tinacos} tinacos de 1100L`;
    document.getElementById('savings').textContent = ahorroText;
    
    // Mostrar sección de resultados
    resultadoDiv.classList.add('active');
    
    // Guardar en localStorage
    guardarEnLocalStorage({
        areaTecho: document.getElementById('roofArea').value,
        precipitacion: document.getElementById('rainfall').value,
        material: document.getElementById('roofMaterial').value,
        resultados: resultados,
        fecha: new Date().toISOString()
    });
}

// Función para guardar en localStorage
function guardarEnLocalStorage(datos) {
    try {
        const historial = JSON.parse(localStorage.getItem('calculosAgua') || '[]');
        historial.unshift(datos);
        
        // Mantener solo los últimos 10 cálculos
        if (historial.length > 10) {
            historial.pop();
        }
        
        localStorage.setItem('calculosAgua', JSON.stringify(historial));
    } catch (error) {
        console.error('Error al guardar en localStorage:', error);
    }
}

// Función para validar formulario
function validarFormulario() {
    const areaTecho = document.getElementById('roofArea').value;
    const precipitacion = document.getElementById('rainfall').value;
    
    let esValido = true;
    
    // Validar área del techo
    if (!areaTecho || areaTecho <= 0) {
        mostrarError('roofArea', 'Por favor ingresa un área válida mayor a 0');
        esValido = false;
    } else {
        limpiarError('roofArea');
    }
    
    // Validar precipitación
    if (!precipitacion || precipitacion <= 0) {
        mostrarError('rainfall', 'Por favor ingresa una precipitación válida mayor a 0');
        esValido = false;
    } else {
        limpiarError('rainfall');
    }
    
    return esValido;
}

// Funciones auxiliares para manejo de errores
function mostrarError(campoId, mensaje) {
    const campo = document.getElementById(campoId);
    campo.style.borderColor = 'var(--error)';
    
    // Crear o actualizar mensaje de error
    let errorDiv = document.getElementById(`error-${campoId}`);
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = `error-${campoId}`;
        errorDiv.className = 'error-message';
        campo.parentNode.appendChild(errorDiv);
    }
    
    errorDiv.textContent = mensaje;
    errorDiv.style.display = 'block';
}

function limpiarError(campoId) {
    const campo = document.getElementById(campoId);
    campo.style.borderColor = '';
    
    const errorDiv = document.getElementById(`error-${campoId}`);
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}

// Función para cargar historial desde localStorage
function cargarHistorial() {
    try {
        const historial = JSON.parse(localStorage.getItem('calculosAgua') || '[]');
        return historial;
    } catch (error) {
        console.error('Error al cargar historial:', error);
        return [];
    }
}

// Event listener para el formulario
document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById('waterCalculator');
    
    if (formulario) {
        formulario.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validar formulario
            if (!validarFormulario()) {
                return;
            }
            
            // Obtener valores del formulario
            const areaTecho = parseFloat(document.getElementById('roofArea').value);
            const precipitacion = parseFloat(document.getElementById('rainfall').value);
            const material = parseFloat(document.getElementById('roofMaterial').value);
            
            // Calcular resultados
            const resultados = calcularAguaCaptable(areaTecho, precipitacion, material);
            
            // Mostrar resultados
            mostrarResultados(resultados);
            
            // Scroll a resultados
            document.getElementById('result').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        });
        
        // Cargar último cálculo si existe
        const historial = cargarHistorial();
        if (historial.length > 0) {
            const ultimoCalculo = historial[0];
            document.getElementById('roofArea').value = ultimoCalculo.areaTecho;
            document.getElementById('rainfall').value = ultimoCalculo.precipitacion;
            document.getElementById('roofMaterial').value = ultimoCalculo.material;
        }
        
        // Debounce para cálculos en tiempo real (opcional)
        let timeout;
        document.getElementById('roofArea').addEventListener('input', function() {
            clearTimeout(timeout);
            timeout = setTimeout(validarFormulario, 500);
        });
        
        document.getElementById('rainfall').addEventListener('input', function() {
            clearTimeout(timeout);
            timeout = setTimeout(validarFormulario, 500);
        });
    }
});

// Exportar funciones para pruebas (si es necesario)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calcularAguaCaptable,
        calcularEquivalencias,
        calcularAhorro,
        validarFormulario
    };
}
// Agregar esta función al archivo calculadora.js
function mostrarResultadosConTinaco(resultados) {
    const resultadoDiv = document.getElementById('result');
    const volumenLitros = resultados.volumenLitros;
    const volumenM3 = resultados.volumenM3;
    
    // Calcular equivalencias
    const equivalencias = calcularEquivalencias(volumenLitros);
    const ahorro = calcularAhorro(volumenM3);
    
    // Actualizar elementos del DOM
    document.getElementById('waterVolume').textContent = `Volumen anual captable: ${volumenM3} m³ (${volumenLitros.toLocaleString()} litros)`;
    document.getElementById('waterVolumeHighlight').textContent = `${volumenLitros.toLocaleString()} L`;
    
    const usoText = `Equivale a: ${equivalencias.duchas} duchas, ${equivalencias.riegosJardin} riegos de jardín o ${equivalencias.lavadasAuto} lavadas de auto al año`;
    document.getElementById('waterUsage').textContent = usoText;
    
    const ahorroText = `Ahorro potencial: $${ahorro.anual.toLocaleString()} MXN anuales ($${ahorro.mensual.toLocaleString()} mensuales) - ${equivalencias.tinacos} tinacos de 1100L`;
    document.getElementById('savings').textContent = ahorroText;
    
    // Mostrar sección de resultados
    resultadoDiv.classList.add('active');
    
    // Guardar en localStorage
    guardarEnLocalStorage({
        areaTecho: document.getElementById('roofArea').value,
        precipitacion: document.getElementById('rainfall').value,
        material: document.getElementById('roofMaterial').value,
        resultados: resultados,
        fecha: new Date().toISOString()
    });
    
    // Retornar el volumen para el tinaco
    return volumenLitros;
}