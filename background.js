const API_KEY = "AIzaSyAxYKg2N3HabFaFd1EYKbutzGgC17TCeGs"; // 🔑 replace with your key
const API_URL = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${API_KEY}`;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "checkSafeBrowsing") {
        const body = {
            client: {
                clientId: "safepay-checker",
                clientVersion: "1.0"
            },
            threatInfo: {
                threatTypes: [
                    "MALWARE",
                    "SOCIAL_ENGINEERING",
                    "UNWANTED_SOFTWARE",
                    "POTENTIALLY_HARMFUL_APPLICATION"
                ],
                platformTypes: ["ANY_PLATFORM"],
                threatEntryTypes: ["URL"],
                threatEntries: [{ url: message.url }]
            }
        };

        fetch(API_URL, {
            method: "POST",
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" }
        })
            .then(res => res.json())
            .then(data => {
                if (data && data.matches) {
                    sendResponse({
                        safe: false,
                        threats: data.matches.map(m => m.threatType)
                    });
                } else {
                    sendResponse({ safe: true });
                }
            })
            .catch(err => {
                console.error("Safe Browsing API error:", err);
                sendResponse(null);
            });

        return true; // ✅ keep channel open for async response
    }
});
