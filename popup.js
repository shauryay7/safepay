function checkSite(url) {
    let riskLevel = "safe";
    let reasons = [];

    try {
        const u = new URL(url);

        // Rule 1: HTTPS check
        if (u.protocol !== "https:") {
            riskLevel = "danger";
            reasons.push("Site is not using HTTPS.");
        }

        // Rule 2: Suspicious domain
        if (u.hostname.includes("-") || u.hostname.length > 40) {
            if (riskLevel !== "danger") riskLevel = "suspicious";
            reasons.push("Domain looks suspicious.");
        }
    } catch (e) {
        riskLevel = "danger";
        reasons.push("Invalid URL.");
    }

    return { riskLevel, reasons };
}

// ✅ FIX: properly fetch current tab URL
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs || !tabs[0]) return;

    const url = tabs[0].url || "Unknown";
    const { riskLevel, reasons } = checkSite(url);

    const statusEl = document.getElementById("status");
    statusEl.textContent = `Status: ${riskLevel.toUpperCase()} for ${url}`;
    statusEl.className = riskLevel;

    const reasonsEl = document.getElementById("reasons");
    reasons.forEach(r => {
        const li = document.createElement("li");
        li.textContent = r;
        reasonsEl.appendChild(li);
    });

    if (reasons.length === 0) {
        const li = document.createElement("li");
        li.textContent = "No obvious risks detected.";
        reasonsEl.appendChild(li);
    }
});
