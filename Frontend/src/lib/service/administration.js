export async function createUser(username, email, date_of_birth) {
    let env = import.meta.env;
    try {
        const response = await fetch("http://" + env.VITE_APIURL + ":" + env.VITE_APIPORT + "/users", {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({username, email, date_of_birth})
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch user data:", error);
    }
}
export async function getUsers(page = 1, pageSize = 10) {
    let env = import.meta.env;
    try {
        const response = await fetch("http://" + env.VITE_APIURL + ":" + env.VITE_APIPORT + "/users?pageSize=" + pageSize + "&page=" + page, {
            headers: {
                "Content-Type": "application/json"
            },
            method: "GET",
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch user data:", error);
    }
}

export async function getRoles(){
    let env = import.meta.env;
    try {
        const response = await fetch("http://" + env.VITE_APIURL + ":" + env.VITE_APIPORT + "/roles", {
            headers: {
                "Content-Type": "application/json"
            },
            method: "GET",
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch user data:", error);
    }
}

export async function deleteUser(user) {
    let env = import.meta.env;
    try {
        const response = await fetch("http://" + env.VITE_APIURL + ":" + env.VITE_APIPORT + "/users?id=" + user.id, {
            headers: {
                "Content-Type": "application/json"
            },
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch user data:", error);
    }
}

export async function updateUser(user, username = user.username, date_of_birth = user.date_of_birth, language = user.language, roleId = user.roleId) {
    let env = import.meta.env;
    try {
        const response = await fetch("http://" + env.VITE_APIURL + ":" + env.VITE_APIPORT + "/users/?id=" + user.id, {
            headers: {
                "Content-Type": "application/json"
            },
            method: "PUT",
            body: JSON.stringify({username, date_of_birth, language, roleId})
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch user data:", error);
    }
}
