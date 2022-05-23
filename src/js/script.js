/* 
 * Display pokemon details after adding pokemon name to search box.
* fetch pokemon details from pokeAPI
 */

(() => {
    //'https://pokeapi.co/api/v2/pokemon?limit=151'
    var url = "https://pokeapi.co/api/v2/pokemon/";
    
    document.querySelector("#submit").addEventListener("click",()=>{
        console.log("onclick");
        var formSearchName = document.getElementById("pokemonName");
        if(!validate(formSearchName)){
            let getPokemon  = document.querySelector("#pokemonName").value;
            let murl = url.concat(getPokemon);   
            displayPokemon(getPokemon,murl);
        }else{
            alert("Search Again");
        }
    });

   

    /**/async function displayPokemon(getPokemon,murl){

        var pokeName = document.getElementById("pokeName");
        var pokeHeight = document.getElementById("pokeHeight");
        var pokeWeight = document.getElementById("pokeWeight");
        var pokeAbilitiesLabel = document.getElementById("pokeAbilities");
        var pokeTypesLabel = document.getElementById("pokeTypes");
        var pokeMovesLabel = document.getElementById("pokeMoves");

        const pokeApiResponse = await getPokemonData(murl);

        var abilities = pokeApiResponse['abilities'];
        var pokeAbilities = '';
        let types = pokeApiResponse['types'];
        var pokeTypes='';
        var pokeImage = document.getElementById("pokeImage");
        var image = pokeApiResponse['sprites']['other']['home']['front_default'];
            pokeImage.src = image;
        var pokeMovesArr = pokeApiResponse['moves'];
        var assignMoves ='';
       // console.log("pokeMoves = "+pokeMoves);
        /**
         * get moves of pokemon
         */
        pokeMovesArr.forEach((move,index) => {
           //console.log("move = "+move['move']['name']+ "index = "+index);
          if(index > 0 && index < 6){
            assignMoves += move['move']['name'] + ', ';
          }
        });

        /**
         * get abilities array
         */
        abilities.forEach((pokeAbility,index) => {
            pokeAbilities += pokeAbility['ability']['name'] + ',  ';
        });
        
        /**
         * get types array
         */
        types.forEach((poketypes,index) => {
            pokeTypes += poketypes['type']['name']+ ', ';
        }); 

        /**
         * display image with specific size
         */
        if(pokeImage && pokeImage.style) {
            pokeImage.style.width = '300px';
        }

        assignVal(pokeName,pokeApiResponse['name']);
        assignVal(pokeWeight,pokeApiResponse['weight']);
        assignVal(pokeHeight,pokeApiResponse['height']);
        assignVal(pokeAbilitiesLabel,pokeAbilities);
        assignVal(pokeTypesLabel,pokeTypes);
        assignVal(pokeMovesLabel,assignMoves);
        
     
    } 
    /**
     * assign inner html value to html tag
     */
   var assignVal =(element,value)=>{
        element.innerText = value;
    }
    /**
     * convert string to camel case
     */
     function toCamelCase(str) {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index)
        {
            return index == 0 ? word.toLowerCase() : word.toUpperCase();
        }).replace(/\s+/g, '');
    }
    /**
     * fetch pokemon data from api
     */
    async function getPokemonData(murl){
        let pokemonDetails = await fetch(murl);
        let pokeJson = await pokemonDetails.json();
        return pokeJson;
    }
    /**
     * function input validation
     */
     var validate =(formSearchName)=>{
        if (formSearchName.value == "") {
            formSearchName.focus();
            return false;
        }
        if (!/^[a-zA-Z]*$/g.test(formSearchName.value)) {
            formSearchName.focus();
            return false;
        }
    }
})();