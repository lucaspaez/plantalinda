// ====================
// 1. BASE DE DATOS (Simulada)
// ====================
const DIAGNOSTIC_RULES = [
    {
        fase: "Vegetativo",
        sintoma: "Hojas amarillas en la base (hojas viejas)",
        causa: "Deficiencia de Nitrógeno (N) o Bloqueo por pH bajo.",
        accion: "Verificar pH y EC. Si el pH es bajo, subirlo a 5.8–6.2. Aumentar nutrientes NPK en 20%."
    },
    {
        fase: "Floración",
        sintoma: "Puntas de hojas quemadas o en forma de garra (Claw)",
        causa: "Exceso de nutrientes (Nutrient Burn).",
        accion: "Lavar raíces con agua pH balanceada. Bajar EC un 25% en el siguiente riego."
    },
    {
        fase: "Floración",
        sintoma: "Manchas marrones secas en hojas medias/altas",
        causa: "Deficiencia de Calcio/Magnesio posible por VPD alto.",
        accion: "Verificar VPD. Aplicar suplemento CalMag al 50% de la dosis recomendada."
    },
    {
        fase: "Vegetativo",
        sintoma: "Hojas caídas y sustrato húmedo constantemente",
        causa: "Exceso de riego.",
        accion: "Dejar secar el sustrato hasta 70%. Aumentar oxigenación y drenaje."
    },
    {
        fase: "Floración",
        sintoma: "Hojas superiores blanqueadas",
        causa: "Estrés lumínico por exceso de intensidad.",
        accion: "Elevar la lámpara 20–30 cm o bajar intensidad al 75%."
    }
];

const PARAM_RANGES = {
    Vegetativo: {
        Temperatura: "22–26°C",
        Humedad: "55–70%",
        VPD: "0.8–1.2 kPa",
        pH: "5.8–6.2"
    },
    Floración: {
        Temperatura: "20–26°C",
        Humedad: "40–55%",
        VPD: "1.0–1.5 kPa",
        pH: "5.8–6.2"
    }
};

// ====================
// 2. Inicializar selects
// ====================
const faseSelect = document.getElementById("faseSelect");
const sintomaSelect = document.getElementById("sintomaSelect");

function initSelects() {
    // Fases
    const fases = [...new Set(DIAGNOSTIC_RULES.map(r => r.fase))];
    fases.forEach(fase => {
        let opt = document.createElement("option");
        opt.value = fase;
        opt.textContent = fase;
        faseSelect.appendChild(opt);
    });

    // Síntomas
    DIAGNOSTIC_RULES.forEach(rule => {
        let opt = document.createElement("option");
        opt.value = rule.sintoma;
        opt.textContent = rule.sintoma;
        sintomaSelect.appendChild(opt);
    });
}

initSelects();

// ====================
// 3. Función de Diagnóstico
// ====================
document.getElementById("btnDiagnosticar").addEventListener("click", () => {
    const fase = faseSelect.value;
    const sintoma = sintomaSelect.value;

    const regla = DIAGNOSTIC_RULES.find(r => r.fase === fase && r.sintoma === sintoma);

    const out = document.getElementById("diagnosticoOutput");

    if (!regla) {
        out.textContent = "No se encontró una coincidencia exacta.";
        return;
    }

    out.innerHTML =
        `<strong>Causa probable:</strong> ${regla.causa}<br><br>
         <strong>Acción Correctiva Única:</strong> ${regla.accion}`;
});

// ====================
// 4. Calculadora VPD
// ====================
function calcularVPD(tempC, rh) {
    // Fórmula simplificada MVP
    const es = 0.6108 * Math.exp((17.27 * tempC) / (tempC + 237.3)); // presión de vapor saturado
    const ea = es * (rh / 100); // presión real
    const vpd = es - ea;
    return vpd;
}

document.getElementById("btnCalcularVPD").addEventListener("click", () => {
    const t = parseFloat(document.getElementById("tempInput").value);
    const rh = parseFloat(document.getElementById("rhInput").value);

    const vpd = calcularVPD(t, rh);
    const vpdFixed = vpd.toFixed(2);

    let msg = `VPD: ${vpdFixed} kPa — `;

    if (vpd >= 0.8 && vpd <= 1.5) {
        msg += "VPD Óptimo para Floración.";
    } else if (vpd < 0.8) {
        msg += "VPD bajo: riesgo de moho. Aumenta ventilación.";
    } else {
        msg += "VPD alto: riesgo de deshidratación. Aumenta humedad.";
    }

    document.getElementById("vpdOutput").textContent = msg;
});

// ====================
// 5. Tabla de Parámetros
// ====================
function renderParamTable() {
    const table = document.getElementById("paramTable");
    table.innerHTML = `
        <tr>
            <th>Fase</th>
            <th>Temperatura</th>
            <th>Humedad</th>
            <th>VPD</th>
            <th>pH</th>
        </tr>
    `;

    for (let fase in PARAM_RANGES) {
        const p = PARAM_RANGES[fase];
        table.innerHTML += `
            <tr>
                <td>${fase}</td>
                <td>${p.Temperatura}</td>
                <td>${p.Humedad}</td>
                <td>${p.VPD}</td>
                <td>${p.pH}</td>
            </tr>
        `;
    }
}

renderParamTable();
