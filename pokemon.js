const container = document.getElementById("pokemonDetails");

//pegar ID da URL
const params = new URLSearchParams(window.location.search);
const pokemonId = params.get("id");

const showLoading = () => {
    container.innerHTML = "<p>Carregando...</p>";
};

const showError = () => {
    container.innerHTML = "<p>Erro ao carregar Pokémon</p>";
};


const fetchPokemon = async () => {
    try {
        showLoading();

        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        const data = await response.json();

        showPokemon(data);

    } catch (error) {
        showError();
    }
};

 //MOSTRAR DADOS

const showPokemon = (poke) => {

    const types = poke.types.map(t => t.type.name).join(", ");

    const html = `
        <div class="pokemon">
            <h1>${poke.name}</h1>
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.id}.png">

            <p><strong>ID:</strong> ${poke.id}</p>
            <p><strong>Tipo:</strong> ${types}</p>
            <p><strong>Altura:</strong> ${poke.height}</p>
            <p><strong>Peso:</strong> ${poke.weight}</p>

            <button onclick="voltar()">Voltar</button>
        </div>
    `;

    container.innerHTML = html;
};


const voltar = () => {
    window.location.href = "index.html";
};

fetchPokemon();