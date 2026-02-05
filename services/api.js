import axios from "axios";

export class Api {
    async getChuckJoke() {
        const response = await axios.get("https://api.chucknorris.io/jokes/random");
        console.log(response.data.value);
        return response.data.value
    }
}