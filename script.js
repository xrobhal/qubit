// v0.0.3
let state = math.matrix([[1], [0]]); // Initial state |0⟩ as a column vector

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
    // Extract state coefficients
    const alpha = state.get([0, 0]); // |0⟩ coefficient
    const beta = state.get([1, 0]); // |1⟩ coefficient

    const prob0 = math.abs(alpha) ** 2;
    const prob1 = math.abs(beta) ** 2;

    document.getElementById("state").textContent = `State: ${math.re(alpha).toFixed(2)} + ${math.im(alpha).toFixed(2)}i |0⟩ + ${math.re(beta).toFixed(2)} + ${math.im(beta).toFixed(2)}i |1⟩`;

    document.getElementById("probabilities").innerHTML = `
        <p>|0⟩: ${(prob0 * 100).toFixed(2)}%</p>
        <p>|1⟩: ${(prob1 * 100).toFixed(2)}%</p>
    `;

    renderBlochSphere(alpha, beta);
}

function renderBlochSphere(alpha, beta) {
    const theta = 2 * Math.acos(math.abs(alpha));
    const phi = math.arg(beta) - math.arg(alpha);

    const x = Math.sin(theta) * Math.cos(phi);
    const y = Math.sin(theta) * Math.sin(phi);
    const z = Math.cos(theta);

    const data = [
        {
            type: "scatter3d",
            mode: "lines+markers",
            x: [0, x],
            y: [0, y],
            z: [0, z],
            line: { width: 5, color: "red" },
            marker: { size: 5, color: "red" }
        }
    ];

    const layout = {
        scene: {
            xaxis: { range: [-1, 1], title: "X" },
            yaxis: { range: [-1, 1], title: "Y" },
            zaxis: { range: [-1, 1], title: "Z" }
        },
        margin: { t: 20 }
    };

    Plotly.newPlot("bloch-sphere", data, layout);
}

// Add event listeners to buttons
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
        const tooltip = document.getElementById("tooltip");
        tooltip.style.display = "none";
    });
});

// Initialize the UI
updateUI();
