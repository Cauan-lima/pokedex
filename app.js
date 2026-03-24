const pokeContainer = document.querySelector("#pokeContainer");
const pokemonCount = 150;

const colors = {
    fire: '#FDDFDF',
    grass: '#DEFDE0',
    electric: '#FCF7DE',
    water: '#DEF3FD',
    ground: '#f4e7da',
    rock: '#d5d5d4',
    fairy: '#fceaff',
    poison: '#98d7a5',
    bug: '#f8d5a3',
    dragon: '#97b3e6',
    psychic: '#eaeda1',
    flying: '#F5F5F5',
    fighting: '#E6E0D4',
    normal: '#F5F5F5'
};

const mainTypes = Object.keys(colors);


// LOAD

const showLoading = () => {
    pokeContainer.innerHTML = `<p class="loading">Carregando Pokémons...</p>`;
};


//ERRO

const showError = () => {
    pokeContainer.innerHTML = `<p class="error">Erro ao carregar Pokémons 😢</p>`;
};

const showEmpty = () => {
    pokeContainer.innerHTML = `<p class="empty">Nenhum Pokémon encontrado</p>`;
};


const fetchPokemons = async () => {
    try {
        showLoading();

        //(lista)
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${pokemonCount}`);
        const data = await response.json();

        pokeContainer.innerHTML = "";

        //map
        const pokemonPromises = data.results.map(pokemon => fetch(pokemon.url));

        const responses = await Promise.all(pokemonPromises);

        //map
        const dataPromises = responses.map(res => res.json());

        const pokemons = await Promise.all(dataPromises);

        if (pokemons.length === 0) {
            showEmpty();
            return;
        }

        //forEach
        pokemons.forEach(pokemon => createPokemonCard(pokemon));

        // filter
        const onlyFire = pokemons.filter(poke =>
            poke.types.some(t => t.type.name === "fire")
        );

        //reduce
        const totalExperience = pokemons.reduce((acc, poke) => acc + poke.base_experience, 0);

        console.log("Pokémons de fogo:", onlyFire.length);
        console.log("Experiência total:", totalExperience);

    } catch (error) {
        console.error(error);
        showError();
    }
};


// CRIAR CARD

const createPokemonCard = (poke) => {
    const card = document.createElement('div');
    card.classList.add("pokemon");

    const name = poke.name[0].toUpperCase() + poke.name.slice(1);
    const id = poke.id.toString().padStart(3, '0');

    card.addEventListener("click", () => {
    window.location.href = `details.html?id=${poke.id}`;
});

    // map
    const pokeTypes = poke.types.map(type => type.type.name);

    // find
    const type = mainTypes.find(t => pokeTypes.includes(t));

    const color = colors[type];

    card.style.backgroundColor = color;

    const pokemonInnerHTML = `
    <div class="imgContainer">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.id}.png" alt="${name}">
    </div>

    <div class="infos">
        <span class="number">#${id}</span>
        <h3 class="name">${name}</h3>
        <small class="type">Type: <span>${type}</span></small>
    </div>
    `;

    card.innerHTML = pokemonInnerHTML;
    pokeContainer.appendChild(card);
};

const search = document.getElementById("search");

search.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase().trim();

    const cards = document.querySelectorAll(".pokemon");

    cards.forEach(card => {
    
        const name = card.querySelector(".name").textContent.toLowerCase();


        if (name.includes(value)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
});

fetchPokemons();