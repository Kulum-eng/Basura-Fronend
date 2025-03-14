document.addEventListener('DOMContentLoaded', function() {
   
    const activateBtn = document.getElementById('activate-btn');
    const objectSlider = document.getElementById('object-distance');
    const distanceValue = document.getElementById('distance-value');
    const distanceDisplay = document.getElementById('distance');
    const addObjectBtn = document.getElementById('add-object');
    const removeObjectBtn = document.getElementById('remove-object');
    const object = document.getElementById('object');
    const logEntries = document.getElementById('log-entries');
    const waves = document.querySelectorAll('.wave');
    const sensorEyes = document.querySelectorAll('.sensor-eye');
    const trashLid = document.querySelector('.trash-lid');
    const trashContent = document.querySelector('.trash-content');
    
    let sensorActive = false;
    let hasObject = false;
    let sensorInterval;
    let currentDistance = parseInt(objectSlider.value);

    updateDistanceValue();
    
    activateBtn.addEventListener('click', toggleSensor);
    objectSlider.addEventListener('input', updateDistanceValue);
    objectSlider.addEventListener('change', updateObjectPosition);
    addObjectBtn.addEventListener('click', addObject);
    removeObjectBtn.addEventListener('click', removeObject);
    
    // aqui para el objecto eh 
    function toggleSensor() {
        sensorActive = !sensorActive;
        
        if (sensorActive) {
            activateBtn.textContent = 'Desactivar Sensor';
            activateBtn.classList.add('active');
            startSensor();
            openLid();
        } else {
            activateBtn.textContent = 'Activar Sensor';
            activateBtn.classList.remove('active');
            stopSensor();
            closeLid();
        }
    }
    
    function startSensor() {
        waves.forEach(wave => wave.classList.add('active'));
        sensorEyes.forEach(eye => eye.classList.add('active'));
        
        sensorInterval = setInterval(() => {
            if (hasObject) {
                const noise = Math.random() * 2 - 1; 
                const measuredDistance = Math.round(currentDistance + noise);
                
                updateDistance(measuredDistance);
                addLogEntry(`Objeto detectado a ${measuredDistance} cm`);
                
                if (currentDistance < 50) {
                    fillTrash();
                } else {
                    emptyTrash();
                }
            } else {
                updateDistance('---');
                addLogEntry('No hay objeto en rango');
            }
        }, 1000);
    }
    
    function stopSensor() {
        clearInterval(sensorInterval);
        waves.forEach(wave => wave.classList.remove('active'));
        sensorEyes.forEach(eye => eye.classList.remove('active'));
        updateDistance('0');
    }
    
    function updateDistanceValue() {
        currentDistance = parseInt(objectSlider.value);
        distanceValue.textContent = `${currentDistance} cm`;
        
        if (hasObject) {
            updateObjectPosition();
        }
    }
    
    function updateObjectPosition() {
        object.style.setProperty('--distance', (400 - currentDistance) / 2);
    }
    
    function addObject() {
        if (!hasObject) {
            hasObject = true;
            object.style.display = 'block';
            updateObjectPosition();
            addLogEntry('Objeto añadido');
        }
    }
    
    function removeObject() {
        if (hasObject) {
            hasObject = false;
            object.style.display = 'none';
            addLogEntry('Objeto eliminado');
            emptyTrash();
        }
    }
    
    function updateDistance(value) {
        distanceDisplay.textContent = value;
    }
    
    function addLogEntry(message) {
        const entry = document.createElement('div');
        entry.classList.add('log-entry');
        
        const time = new Date().toLocaleTimeString();
        entry.textContent = `[${time}] ${message}`;
        
        logEntries.insertBefore(entry, logEntries.firstChild);
        
        if (logEntries.children.length > 10) {
            logEntries.removeChild(logEntries.lastChild);
        }
    }
    
    function openLid() {
        trashLid.classList.add('open');
    }
    
    function closeLid() {
        trashLid.classList.remove('open');
    }
    
    function fillTrash() {
        trashContent.classList.add('filled');
    }
    
    function emptyTrash() {
        trashContent.classList.remove('filled');
    }
    
    function pulseEffect() {
        const pulse = document.createElement('div');
        pulse.classList.add('pulse-effect');
        document.querySelector('.sensor-container').appendChild(pulse);
        
        setTimeout(() => {
            if (pulse.parentNode) {
                pulse.parentNode.removeChild(pulse);
            }
        }, 1000);
    }
    
    document.querySelector('.trash-body').addEventListener('click', () => {
        if (sensorActive) {
            if (Math.random() > 0.5) {
                addLogEntry('¡Detección de movimiento dentro del contenedor!');
                pulseEffect();
            }
        }
    });
    
    let clickCount = 0;
    document.querySelector('.trash-container').addEventListener('click', () => {
        clickCount++;
        if (clickCount >= 5) {
            addLogEntry('🔥 ¡Modo de diagnóstico activado! 🔥');
            document.querySelector('.trash-container').style.boxShadow = '0 0 15px #e74c3c';
            setTimeout(() => {
                document.querySelector('.trash-container').style.boxShadow = 'none';
                clickCount = 0;
                addLogEntry('Modo de diagnóstico desactivado');
            }, 3000);
        }
    });
});