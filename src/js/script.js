/* 
 * Display pokemon details after adding pokemon name to search box.
* fetch pokemon details from pokeAPI
 */

(() => {
    //'https://pokeapi.co/api/v2/pokemon?limit=151'
    var url = "https://pokeapi.co/api/v2/pokemon/";
    document.querySelector("#submit").addEventListener("click",()=>{
        let getPokemon  = document.querySelector("#pokemonName").value;
        let murl = url.concat(getPokemon);
        console.log("murl = "+ murl);
        var pokeData = getPokemonData(getPokemon,murl);
        /*var pokeArray = pokeJson[]
        pokeJson.forEach((poke,index) => {
            console.log(poke);
        });*/

         //displayPokemon(getPokemon,url);

    });

    async function getPokemonData(getPokemon,murl){
        let pokemonDetails = await fetch(murl);
        let pokeJson = await pokemonDetails.json();
        console.log("name = "+pokeJson['name']);
        console.log("weight = "+pokeJson['weight']);
        console.log("id = "+pokeJson['id']);
        console.log("height = "+pokeJson['height']);
        console.log("types = "+pokeJson['types']);

        return pokeJson;
    }

    /*async function displayPokemon(getPokemon,url){
        const pokeApiResponse = await getPokemonData(url);
        
    } */
})();