console.log("hello");

const getUsername = document.querySelector("#user") as HTMLInputElement;
const formSubmit = document.querySelector(".form") as HTMLFormElement;
const card_container = document.querySelector(".card-container") as HTMLElement;

interface UserData {
    id: number;
    login: string;
    avatar_url: string;
    location: string;
    url: string;
}

async function myCustomFetcher<T>(api: string, options?: RequestInit): Promise<T> {
    const result = await fetch(api, options);
    if (!result.ok) {
        throw new Error(`Network Issue ${result.status}`);
    }
    const data = await result.json();
    return data;
}

const showResultUI = (singleUser: UserData) => {
    card_container.insertAdjacentHTML("beforeend",
        `<div class='card'>
            <img src="${singleUser.avatar_url}" alt="${singleUser.login}" class="img" />
            <hr />
            <div class="footer">
                <img src="${singleUser.avatar_url}" alt="${singleUser.login}" class="link-img" />
                <a href="${singleUser.url}">Github</a>
            </div>
        </div>`
    );
}

async function fetchUserData(api: string) {
    try {
        const userInfo = await myCustomFetcher<UserData[]>(api, {});
        userInfo.forEach(singleUser => showResultUI(singleUser));
    } catch (e) {
        console.error(e);
    }
}

// Default function call when page loads
fetchUserData("https://api.github.com/users");

formSubmit.addEventListener("submit", async (e) => {
    e.preventDefault();

    const searchTerm = getUsername.value.toLowerCase();
    try {
        const url = "https://api.github.com/users";
        const allUserData = await myCustomFetcher<UserData[]>(url, {});
        const matchingUsers = allUserData.filter((user) => user.login.toLowerCase().includes(searchTerm));

        card_container.innerHTML = "";
        if (matchingUsers.length === 0) {
            card_container.insertAdjacentHTML(
                "beforeend",
                `<p>No matching user found...</p>`
            );
        } else {
            matchingUsers.forEach(singleUser => showResultUI(singleUser));
        }
    } catch (e) {
        console.error(e);
    }
});
