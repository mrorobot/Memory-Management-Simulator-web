document.addEventListener('DOMContentLoaded', () => {
    const startSimulationButton = document.getElementById('start-simulation');
    const memorySizeInput = document.getElementById('memory-size');
    const numProgramsInput = document.getElementById('num-programs');
    const memoryVisualization = document.getElementById('memory-visualization');
    const fragmentationInfo = document.getElementById('fragmentation-info');

    startSimulationButton.addEventListener('click', () => {
        const memorySize = parseInt(memorySizeInput.value);
        const numPrograms = parseInt(numProgramsInput.value);

        if (isNaN(memorySize) || isNaN(numPrograms) || memorySize <= 0 || numPrograms <= 0) {
            alert('Please enter valid numbers for memory size and number of programs.');
            return;
        }

        // TODO: Implement memory management simulation
        console.log(`Starting simulation with memory size: ${memorySize} and ${numPrograms} programs`);
    });
});