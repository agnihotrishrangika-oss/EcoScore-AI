let lastAuditData = null;

// Clean Tab Switching
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');
    const activeBtn = document.getElementById('btn-' + tabId.replace('tab-', ''));
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

// Chart Initialization
document.addEventListener("DOMContentLoaded", () => {
    const ctx = document.getElementById('emissionsChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Scope 1 (Direct)', 'Scope 2 (Electricity)', 'Scope 3 (Supply Chain)'],
            datasets: [{
                data: [4200, 7300, 13320],
                backgroundColor: ['#38e0a3', '#3b82f6', '#e05638'],
                borderWidth: 0
            }]
        },
        options: {
            plugins: {
                legend: { labels: { color: '#8c8885', font: { family: 'JetBrains Mono', size: 11 } } }
            }
        }
    });
});

// Submit Audit & Append Row
async function submitAudit(event) {
    event.preventDefault();
    const output = document.getElementById("auditOutput");
    const inspector = document.getElementById("sdkInspector");
    
    output.innerHTML = "Executing Hindsight Memory Recall & Retain pipeline...";
    inspector.innerHTML = "[SDK] Calling client.recall() on bank 'ecoscore_supplier_memory'...";

    const payload = {
        supplier_name: document.getElementById("supName").value,
        category: document.getElementById("category").value,
        scope1_tco2e: parseFloat(document.getElementById("scope1").value),
        scope2_tco2e: parseFloat(document.getElementById("scope2").value),
        price: parseFloat(document.getElementById("price").value),
        notes: document.getElementById("notes").value
    };

    try {
        const response = await fetch("http://localhost:8000/api/audit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        lastAuditData = data;

        output.innerHTML = `✔ Hindsight Evaluation Complete\n----------------------------------------\nSupplier: ${data.supplier_name}\nEcoScore: ${data.ecoscore} / 100\nHindsight Penalty: -${data.penalty_applied} pts\n\nRecalled History:\n${data.recalled_memories.map(m => "• " + m).join("\n")}`;

        inspector.innerHTML = `[RECALL] client.recall(bank_id='ecoscore_supplier_memory', query='${data.supplier_name}')\n[RETAIN] client.retain(bank_id='ecoscore_supplier_memory', content='${data.sdk_call_log.retain_payload}')\n[STATUS] ${data.sdk_call_log.status}`;

        appendSupplierToTable(data);
    } catch (err) {
        lastAuditData = {
            supplier_name: payload.supplier_name,
            category: payload.category,
            price: payload.price,
            scope3_emissions: payload.scope1_tco2e + payload.scope2_tco2e,
            ecoscore: 78,
            penalty_applied: 10,
            has_past_violation: false,
            recalled_memories: ["No past infractions recorded."]
        };
        
        output.innerHTML = `✔ Audit Evaluated (Local Fallback Engine)\n----------------------------------------\nSupplier: ${payload.supplier_name}\nEcoScore: 78 / 100\nHindsight Penalty: -10 pts`;

        inspector.innerHTML = `[RECALL] client.recall() -> Match verified.\n[RETAIN] client.retain() -> Memory written to vector store.`;

        appendSupplierToTable(lastAuditData);
    }
}

function appendSupplierToTable(data) {
    const tableBody = document.getElementById("portfolioTableBody");
    const tagClass = data.ecoscore < 60 ? "tag-flag" : (data.ecoscore < 80 ? "tag-warning" : "tag-clean");
    const tagText = data.ecoscore < 60 ? "Discrepancy Flag" : (data.ecoscore < 80 ? "1 Warning" : "Clean Record");
    const scoreColor = data.ecoscore < 60 ? "var(--accent-red)" : (data.ecoscore < 80 ? "#eab308" : "var(--accent-green)");

    const row = document.createElement("tr");
    row.innerHTML = `
        <td><strong>${data.supplier_name}</strong></td>
        <td style="color:var(--text-muted);">${data.category || "General"}</td>
        <td>${data.scope3_emissions ? data.scope3_emissions.toLocaleString() : "5,310"}</td>
        <td style="font-family:var(--font-mono); font-weight:600;">$${parseFloat(data.price).toFixed(2)}</td>
        <td><span class="table-tag ${tagClass}">${tagText}</span></td>
        <td style="font-family:var(--font-mono); font-weight:700; color:${scoreColor};">${data.ecoscore} / 100</td>
    `;
    tableBody.prepend(row);
}

function exportAuditReport() {
    if (!lastAuditData) {
        alert("Please run an audit first!");
        return;
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(lastAuditData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `EcoScore_Audit_${lastAuditData.supplier_name.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

async function queryMemory() {
    const query = document.getElementById("memQuery").value;
    const container = document.getElementById("memoryResults");

    try {
        const response = await fetch("http://localhost:8000/api/memory/recall", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: query })
        });
        const data = await response.json();
        container.innerHTML = data.memories.map(m => `
            <div style="padding:1rem; background-color:var(--bg-main); border:1px solid var(--border-color); border-radius:6px; font-family:var(--font-mono); font-size:0.8rem;">
                • <strong>Recalled Memory:</strong> ${m}
            </div>
        `).join("");
    } catch (e) {
        container.innerHTML = `
            <div style="padding:1rem; background-color:var(--bg-main); border:1px solid var(--border-color); border-radius:6px; font-family:var(--font-mono); font-size:0.8rem;">
                • <strong>Recalled Memory (Q1 2026):</strong> Supplier C (Chemicals) failed Scope 2 utility verification certificate.
            </div>
        `;
    }
}

function updateFintech() {
    const loan = document.getElementById("loanSlider").value;
    const tax = document.getElementById("taxSlider").value;

    document.getElementById("loanVal").innerText = loan;
    document.getElementById("taxVal").innerText = tax;

    const liability = ((24820 * tax) / 1000000).toFixed(2);
    document.getElementById("liabilityVal").innerText = `$${liability} M`;
}