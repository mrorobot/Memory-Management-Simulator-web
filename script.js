class MemoryManager {
    constructor(size) {
        this.memory = new Array(size).fill(0);
    }

    allocate(size) {
        for (let i = 0; i < this.memory.length; i++) {
            let blockSize = 0;
            while (i + blockSize < this.memory.length && this.memory[i + blockSize] === 0 && blockSize < size) {
                blockSize++;
            }

            if (blockSize >= size) {
                for (let j = i; j < i + size; j++) {
                    this.memory[j] = 1;
                }
                return i;
            }
        }
        return -1;
    }

    deallocate(start, size) {
        for (let i = start; i < start + size; i++) {
            this.memory[i] = 0;
        }
    }

    compactMemory() {
        let shift = 0;
        for (let i = 0; i < this.memory.length; i++) {
            if (this.memory[i] === 0) {
                shift++;
            } else if (shift > 0) {
                this.memory[i - shift] = this.memory[i];
                this.memory[i] = 0;
            }
        }
    }

    calculateFragmentation() {
        let fragmentation = 0;
        let contiguousFree = 0;
        for (let i = 0; i < this.memory.length; i++) {
            if (this.memory[i] === 0) {
                contiguousFree++;
            } else {
                if (contiguousFree > 0) {
                    fragmentation += contiguousFree;
                    contiguousFree = 0;
                }
            }
        }
        if (contiguousFree > 0) {
            fragmentation += contiguousFree;
        }
        return fragmentation;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const memorySizeInput = document.getElementById('memory-size');
    const numProgramsInput = document.getElementById('num-programs');
    const programSizesDiv = document.getElementById('program-sizes');
    const generateProgramsButton = document.getElementById('generate-programs');
    const startSimulationButton = document.getElementById('start-simulation');
    const stepSimulationButton = document.getElementById('step-simulation');
    const autoSimulationButton = document.getElementById('auto-simulation');
    const resetSimulationButton = document.getElementById('reset-simulation');
    const memoryVisualization = document.getElementById('memory-visualization');
    const allocationInfo = document.getElementById('allocation-info');
    const fragmentationInfo = document.getElementById('fragmentation-info');

    let memoryManager;
    let programSizes = [];
    let currentStep = 0;
    let allocatedBlocks = [];

    function visualizeMemory(memoryManager) {
        memoryVisualization.innerHTML = '';
        memoryManager.memory.forEach((block, index) => {
            const blockElement = document.createElement('div');
            blockElement.className = 'memory-block';
            blockElement.style.backgroundColor = block === 0 ? 'var(--free-color)' : (index < 20 ? 'var(--os-color)' : 'var(--allocated-color)');
            memoryVisualization.appendChild(blockElement);
        });
    }

    function updateAllocationInfo() {
        allocationInfo.innerHTML = '<h3>Allocation Information:</h3>';
        allocatedBlocks.forEach((block, index) => {
            allocationInfo.innerHTML += `<p>Program ${index + 1}: ${block.size}KB at position ${block.start}</p>`;
        });
    }

    function updateFragmentationInfo() {
        const fragmentation = memoryManager.calculateFragmentation();
        fragmentationInfo.innerHTML = `<p>Current memory fragmentation: ${fragmentation}KB</p>`;
    }

    function generateProgramSizeInputs() {
        programSizesDiv.innerHTML = '';
        const numPrograms = parseInt(numProgramsInput.value);
        for (let i = 0; i < numPrograms; i++) {
            const inputGroup = document.createElement('div');
            inputGroup.className = 'program-size-input';
            inputGroup.innerHTML = `
                <label for="program-size-${i}">Program ${i + 1} Size (KB):</label>
                <input type="number" id="program-size-${i}" min="1" value="${Math.floor(Math.random() * 20) + 1}">
            `;
            programSizesDiv.appendChild(inputGroup);
        }
    }

    generateProgramsButton.addEventListener('click', generateProgramSizeInputs);

    function resetSimulation() {
        currentStep = 0;
        programSizes = [];
        allocatedBlocks = [];
        memoryManager = null;
        memoryVisualization.innerHTML = '';
        allocationInfo.innerHTML = '';
        fragmentationInfo.innerHTML = '';
        stepSimulationButton.disabled = true;
        autoSimulationButton.disabled = true;
        startSimulationButton.disabled = false;
    }

    resetSimulationButton.addEventListener('click', resetSimulation);

    function startSimulation() {
        const memorySize = parseInt(memorySizeInput.value);
        programSizes = Array.from(programSizesDiv.querySelectorAll('input')).map(input => parseInt(input.value));

        if (isNaN(memorySize) || memorySize <= 0 || programSizes.some(isNaN)) {
            alert('Please enter valid numbers for memory size and program sizes.');
            return;
        }

        memoryManager = new MemoryManager(memorySize);
        memoryManager.allocate(20); // Allocate 20 KB for OS

        visualizeMemory(memoryManager);
        updateFragmentationInfo();

        stepSimulationButton.disabled = false;
        autoSimulationButton.disabled = false;
        startSimulationButton.disabled = true;
    }

    startSimulationButton.addEventListener('click', startSimulation);

    function stepSimulation() {
        if (currentStep < programSizes.length) {
            const programSize = programSizes[currentStep];
            const block = memoryManager.allocate(programSize);
            if (block !== -1) {
                console.log(`Program ${currentStep + 1} (${programSize}KB) allocated at position ${block}`);
                allocatedBlocks.push({start: block, size: programSize});
            } else {
                console.log(`Allocation for program ${currentStep + 1} (${programSize}KB) failed`);
            }

            visualizeMemory(memoryManager);
            updateAllocationInfo();
            updateFragmentationInfo();

            currentStep++;
        }

        if (currentStep === programSizes.length) {
            stepSimulationButton.disabled = true;
            autoSimulationButton.disabled = true;
            memoryManager.compactMemory();
            visualizeMemory(memoryManager);
            updateFragmentationInfo();
            fragmentationInfo.innerHTML += `<p>Memory compacted. New fragmentation: ${memoryManager.calculateFragmentation()}KB</p>`;
        }
    }

    stepSimulationButton.addEventListener('click', stepSimulation);

    function autoSimulation() {
        autoSimulationButton.disabled = true;
        stepSimulationButton.disabled = true;

        function runStep() {
            if (currentStep < programSizes.length) {
                stepSimulation();
                setTimeout(runStep, 1000);  // Run next step after 1 second
            } else {
                memoryManager.compactMemory();
                visualizeMemory(memoryManager);
                updateFragmentationInfo();
                fragmentationInfo.innerHTML += `<p>Memory compacted. New fragmentation: ${memoryManager.calculateFragmentation()}KB</p>`;
            }
        }

        runStep();
    }

    autoSimulationButton.addEventListener('click', autoSimulation);
});