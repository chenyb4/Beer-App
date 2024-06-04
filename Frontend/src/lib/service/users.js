let env = import.meta.env;

export async function getUserByQRIdentifier(identifier) {
    try {
        const response = await fetch(
            "http://" +
                env.VITE_APIURL +
                ":" +
                env.VITE_APIPORT +
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
