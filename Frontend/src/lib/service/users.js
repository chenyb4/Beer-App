
export async function getUserByQRIdentifier(identifier) {
    try {
        const response = await fetch(
            "http://" +
            import.meta.env.VITE_APIURL +
            ":" +
            import.meta.env.VITE_APIPORT +
            "/users?qr_identifier=" +
            identifier,
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch user data:", error);
        throw error;
    }
}

export async function getUserById(userId) {
    try {
        const response = await fetch(
            `http://${env.VITE_APIURL}:${env.VITE_APIPORT}/users/${userId}`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch user data:", error);
        throw error;
    }
}
