let state = [1, 0]; // Qubit in |0⟩ state

const GATES = {
    X: [[0, 1], [1, 0]],
    Y: [[0, -1j], [1j, 0]],
    Z: [[1, 0], [0, -1]],
    H: [[1 / Math.sqrt(2), 1 / Math.sqrt(2)], [1 / Math.sqrt(2), -1 / Math.sqrt(2)]],
};

function applyGate(gateName) {
    const gate = math.matrix(GATES[gateName]);
    state = math.multiply(gate, state)._data;
    updateUI();
}

function updateUI() {
    const prob0 = Math.pow(math.abs(state[0]), 2);
    const prob1 = Math.pow(math.abs(state[1]), 2);
    document.getElementById("state").textContent = `State: ${state[0].toFixed(2)}|0⟩ + ${state[1].toFixed(2)}|1⟩`;

    // Update probabilities
    document.getElementById("probabilities").innerHTML = `
        <p>|0⟩: ${(prob0 * 100).toFixed(2)}%</p>
        <p>|1⟩: ${(prob1 * 100).toFixed(2)}%</p>
    `;

    // Update Bloch sphere (placeholder for now)
    Plotly.newPlot("bloch-sphere", [{ type: "scatter3d", mode: "markers", x: [0], y: [0], z: [1] }]);
}

updateUI();
