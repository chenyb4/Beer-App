export async function getQRandSendMail(userID) {
    try {
        const response = await fetch("http://" + import.meta.env.VITE_APIURL + ":" + import.meta.env.VITE_APIPORT + "/mail?id=" + userID, {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch user data:", error);
    }
}