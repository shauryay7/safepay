chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs || !tabs[0]) return;

    const url = tabs[0].url;

    // Ask background to check with Safe Browsing API
    chrome.runtime.sendMessage({ action: "checkSafeBrowsing", url }, (response) => {
        const statusEl = document.getElementById("status");
        const reasonsEl = document.getElementById("reasons");
        reasonsEl.innerHTML = "";

        if (!response) {
            statusEl.textContent = "Error: No response from background.";
            statusEl.className = "danger";
            return;
        }

        if (response.safe) {
            statusEl.textContent = `SAFE for transactions: ${url}`;
            statusEl.className = "safe";
            const li = document.createElement("li");
            li.textContent = "No threats detected by Google Safe Browsing.";
            reasonsEl.appendChild(li);
        } else {
            statusEl.textContent = `DANGEROUS: ${url}`;
            statusEl.className = "danger";
            response.threats.forEach(t => {
                const li = document.createElement("li");
                li.textContent = `Threat: ${t}`;
                reasonsEl.appendChild(li);
            });
        }
    });
});
