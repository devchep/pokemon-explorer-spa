async function getAbilityInfo(abilityUrl) {
    let response = await fetch(abilityUrl);
    if (!response.ok) {
        console.log('ERROR: Request returned with error');
        return null;
    }
    const EFFECT_DATA = await response.json();
    return EFFECT_DATA.effect_entries[1].effect;
}

function normalizeName(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export default async function getPokemon(pokemonName) {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);

    if (!response.ok) {
        return `<div class="error-page">
                <img class="error-img" alt="" src="/img/404.jpg">
                <p>404: Not found.<br>
                Jiggly isn't here, so where is he?</p>
            </div>`;
    }

    const POKEMON_DATA = await response.json();
    
    let pokeInfo = `<div class="jiggly-page">
                    <img class="jiggly-img" alt="" src="${POKEMON_DATA.sprites.front_shiny}">
                    <div class="jiggly-info">
                    <p>${normalizeName(pokemonName)}</p>
                    <ul class="abilities">`;

    for (let i = 0; i < POKEMON_DATA.abilities.length; i++) {
        let ability = POKEMON_DATA.abilities[i].ability;
        let abilityUrl = ability.url;
        let abilityPromise = getAbilityInfo(abilityUrl);
        let abilityName = normalizeName(ability.name);
        pokeInfo += `<li><span>${abilityName}</span><br>: ${await abilityPromise}<br><br></li>`;
    }

    return pokeInfo + `</ul></div>`;
}