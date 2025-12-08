// ==============================================================================
// Planta Linda - Load Test con k6
// Simula 100 usuarios concurrentes
// Instalar: https://k6.io/docs/get-started/installation/
// Ejecutar: k6 run tests/load/k6-script.js
// ==============================================================================

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
    stages: [
        { duration: '30s', target: 20 },   // Ramp up a 20 usuarios
        { duration: '1m', target: 50 },    // Ramp up a 50 usuarios
        { duration: '2m', target: 100 },   // Mantener 100 usuarios
        { duration: '30s', target: 0 },    // Ramp down
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'],  // 95% de requests < 500ms
        errors: ['rate<0.1'],               // Menos de 10% errores
    },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8081';

// Datos de prueba
const testUser = {
    email: `loadtest_${Date.now()}@test.com`,
    password: 'loadtest123',
    firstname: 'Load',
    lastname: 'Test',
};

let authToken = null;

// Setup: Registrar usuario de prueba
export function setup() {
    const registerRes = http.post(
        `${BASE_URL}/api/auth/register`,
        JSON.stringify(testUser),
        { headers: { 'Content-Type': 'application/json' } }
    );

    const loginRes = http.post(
        `${BASE_URL}/api/auth/login`,
        JSON.stringify({ email: testUser.email, password: testUser.password }),
        { headers: { 'Content-Type': 'application/json' } }
    );

    if (loginRes.status === 200) {
        const body = JSON.parse(loginRes.body);
        return { token: body.token };
    }
    return { token: null };
}

export default function (data) {
    const headers = {
        'Content-Type': 'application/json',
    };

    if (data.token) {
        headers['Authorization'] = `Bearer ${data.token}`;
    }

    // ==============================================================================
    // Escenario 1: Health Check (sin auth)
    // ==============================================================================
    const healthRes = http.get(`${BASE_URL}/actuator/health`);
    check(healthRes, {
        'health check status 200': (r) => r.status === 200,
    });
    errorRate.add(healthRes.status !== 200);

    sleep(1);

    // ==============================================================================
    // Escenario 2: Obtener lotes (con auth)
    // ==============================================================================
    if (data.token) {
        const batchesRes = http.get(`${BASE_URL}/api/batches`, { headers });
        check(batchesRes, {
            'batches status 200': (r) => r.status === 200,
        });
        errorRate.add(batchesRes.status !== 200);
    }

    sleep(1);

    // ==============================================================================
    // Escenario 3: Obtener inventario (con auth)
    // ==============================================================================
    if (data.token) {
        const inventoryRes = http.get(`${BASE_URL}/api/inventory`, { headers });
        check(inventoryRes, {
            'inventory status 200': (r) => r.status === 200,
        });
        errorRate.add(inventoryRes.status !== 200);
    }

    sleep(1);

    // ==============================================================================
    // Escenario 4: Obtener notificaciones (con auth)
    // ==============================================================================
    if (data.token) {
        const notifRes = http.get(`${BASE_URL}/api/notifications`, { headers });
        check(notifRes, {
            'notifications status 200': (r) => r.status === 200,
        });
        errorRate.add(notifRes.status !== 200);
    }

    sleep(Math.random() * 3);
}

export function handleSummary(data) {
    return {
        'stdout': textSummary(data, { indent: '  ', enableColors: true }),
        'tests/load/results.json': JSON.stringify(data),
    };
}

function textSummary(data, opts) {
    const metrics = data.metrics;
    return `
========================================
  Planta Linda - Resultados Load Test
========================================

  Duración total: ${data.state.testRunDurationMs}ms
  
  Requests:
    Total: ${metrics.http_reqs.values.count}
    Rate: ${metrics.http_reqs.values.rate.toFixed(2)}/s
  
  Response Time:
    Avg: ${metrics.http_req_duration.values.avg.toFixed(2)}ms
    p95: ${metrics.http_req_duration.values['p(95)'].toFixed(2)}ms
    Max: ${metrics.http_req_duration.values.max.toFixed(2)}ms
  
  Errores: ${(metrics.errors.values.rate * 100).toFixed(2)}%
  
========================================
`;
}
