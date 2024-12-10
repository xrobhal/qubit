let state = math.complex([1, 0]); // Initial state |0⟩

const GATES = {
    X: math.matrix([[0, 1], [1, 0]]),
    Y: math.matrix([[0, math.complex(0, -1)], [math.complex(0, 1), 0]]),
    Z: math.matrix([[1, 0], [0, -1]]),
    H: math.matrix([[1 / Math.sqrt(2), 1 / Math.sqrt(2)], [1 / Math.sqrt(2), -1 / Math.sqrt(2)]])
};

const GATE_DESCRIPTIONS = {
    X: "Pauli-X (NOT) Gate: Flips the qubit between |0⟩ and |1⟩.",
    Y: "Pauli-Y Gate: Rotates the qubit around the Y-axis of the Bloch sphere.",
    Z: "Pauli-Z Gate: Applies a phase flip to the qubit.",
    H: "Hadamard Gate: Creates a superposition of states from |0⟩ or |1⟩."
};

function applyGate(gateName) {
    const gate = GATES[gateName];
    state = math.multiply(gate, state);
    updateUI();
}

function updateUI() {
    const prob0 = math.abs(state[0]) ** 2;
    const prob1 = math.abs(state[1]) ** 2;
    document.getElementById("state").textContent = `State: ${state[0].toFixed(2)}|0⟩ + ${state[1].toFixed(2)}|1⟩`;

    document.getElementById("probabilities").innerHTML = `
        <p>|0⟩: ${(prob0 * 100).toFixed(2)}%</p>
        <p>|1⟩: ${(prob1 * 100).toFixed(2)}%</p>
    `;

    renderBlochSphere();
}

function renderBlochSphere() {
    const alpha = state[0];
    const beta = state[1];

    const theta = 2 * Math.acos(math.abs(alpha));
    const phi = math.arg(beta) - math.arg(alpha);
    const x = Math.sin(theta) * Math.cos(phi);
    const y = Math.sin(theta) * Math.sin(phi);
    const z = Math.cos(theta);

    const data = [
        {
            type: "scatter3d",
            mode: "lines",
            x: [0, x],
            y: [0, y],
            z: [0, z],
            line: { width: 5, color: "red" }
        }
    ];

    const layout = {
        scene: {
            xaxis: { range: [-1, 1] },
            yaxis: { range: [-1, 1] },
            zaxis: { range: [-1, 1] }
        },
        margin: { t: 0 }
    };

    Plotly.newPlot("bloch-sphere", data, layout);
}

document.querySelectorAll(".gate-button").forEach(button => {
    const gateName = button.dataset.gate;
    button.addEventListener("click", () => applyGate(gateName));

    button.addEventListener("mouseover", event => {
        const tooltip = document.getElementById("tooltip");
        tooltip.style.display = "block";
        tooltip.style.left = `${event.pageX + 10}px`;
        tooltip.style.top = `${event.pageY + 10}px`;
        tooltip.textContent = GATE_DESCRIPTIONS[gateName];
    });

    button.addEventListener("mouseout", () => {
        document.getElementById("tooltip").style.display = "none";
    });
});

updateUI();
