/* 
 * Display pokemon details after adding pokemon name to search box.
* fetch pokemon details from pokeAPI
 */

(() => {
    //'https://pokeapi.co/api/v2/pokemon?limit=151'
    var url = "https://pokeapi.co/api/v2/pokemon/";
    var speciesUrl,basePokemon;

    var pokeName = document.getElementById("pokeName");
    var pokeImage = document.getElementById("pokeImage");
    var pokeIdLabel =document.getElementById("pokeIdLabel");
    var pokeHeight = document.getElementById("pokeHeight");
    var pokeWeight = document.getElementById("pokeWeight");
    var pokeAbilitiesLabel = document.getElementById("pokeAbilities");
    var pokeTypesLabel = document.getElementById("pokeTypes");
    var pokeMovesLabel = document.getElementById("pokeMoves");

    var pokeEvolutionName = document.getElementById("pokeEvolutionName");
    var pokeEvolutionName1 = document.getElementById("pokeEvolutionName1");
    var pokeEvolutionName2 = document.getElementById("pokeEvolutionName2");

    var pokeEvolutionImg = document.getElementById("pokeEvolutionImg");
    var pokeEvolutionImg1 = document.getElementById("pokeEvolutionImg1");
    var pokeEvolutionImg2 = document.getElementById("pokeEvolutionImg2");

    var pokeEvolutionTypes = document.getElementById("pokeEvolutionTypes");
    var pokeEvolutionTypes1 = document.getElementById("pokeEvolutionTypes1");
    var pokeEvolutionTypes2 = document.getElementById("pokeEvolutionTypes2");

    /**
     * Pokemon search button click functionality
     * 
     */
    document.querySelector("#submit").addEventListener("click",()=>{
        console.log("onclick");
        var formSearchName = document.getElementById("pokemonName");
        if(!validate(formSearchName)){
            let getPokemon  = document.querySelector("#pokemonName").value;
            let murl = url.concat(getPokemon);   
            displayPokemon(getPokemon,murl);
        }else{
            alert("Search Again");
            location.reload();
        }
    });
    /**
         * assign inner html value to html tag
         */
    var assignVal =(element,value)=>{
        element.innerText = value;
    }

   /**
    * display details of searched pokemon
   */

    async function displayPokemon(getPokemon,murl){
        const pokeApiResponse = await getPokemonData(murl);

        var abilities = pokeApiResponse['abilities'];
        var pokeAbilities = '';
        let types = pokeApiResponse['types'];
        var pokeTypes='';
        
        var image = pokeApiResponse['sprites']['other']['home']['front_default'];
            pokeImage.src = image;
        var pokeMovesArr = pokeApiResponse['moves'];
        var assignMoves ='';
        var pokeId = pokeApiResponse['id'];

        speciesUrl = pokeApiResponse['species']['url'];
        // using searched pokemon we get it's species url and from that we get it's evolution url
        // from this evolution url we can get evolution of searched pokemon
        getPokeEvolutionUrl(speciesUrl);

        /**
         * get moves of pokemon
         */
        pokeMovesArr.forEach((move,index) => {
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
        assignVal(pokeIdLabel,"# "+pokeId);
        assignVal(pokeWeight,pokeApiResponse['weight']);
        assignVal(pokeHeight,pokeApiResponse['height']);
        assignVal(pokeAbilitiesLabel,pokeAbilities);
        assignVal(pokeTypesLabel,pokeTypes);
        assignVal(pokeMovesLabel,assignMoves);
    } 

    /**
         * fetch seached pokemon data from api
         */
 
    async function getPokemonData(murl){
        let pokemonDetails = await fetch(murl);
        let pokeJson = await pokemonDetails.json();
        //getPokeEvolution(pokeJson['id']); //get evolutions of searched pokemon
        return pokeJson;
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

    /**
     * get evolution Url from species url of searched pokemon
     * @param speciesUrl
     */
     async function getPokeEvolutionUrl(speciesUrl){
         //console.log(speciesUrl);
        let pokeSpeciesUrl = await fetch(speciesUrl);
        let speciesUrlData= await pokeSpeciesUrl.json();
        //console.log("speciesUrlData ="+speciesUrlData['evolution_chain']['url']);
        /** from json of species url we get evolution url send it to another function */
        let evolutionUrl = speciesUrlData['evolution_chain']['url'];
        getPokeEvolution(evolutionUrl);
     }

    /*
    * display Evolution from the species url which we get from the pokemon data get after search for pokemon
    */
    async function getPokeEvolution(evolutionUrl){ // get prokemon evolution 
        console.log("evolution Url = "+evolutionUrl);
        let pokeEvolution = await fetch(evolutionUrl);
        let pokeEvolutionDetails = await pokeEvolution.json();

        let pokePreVersion1Details = pokeEvolutionDetails['chain']['evolves_to'][0];
        let pokePreversion1SpeciesUrl = pokePreVersion1Details['species']['url'];
         basePokemon = pokeEvolutionDetails['chain']['species']['name'];

         let BasePokeUrl = url.concat(basePokemon);
         var basePokemonData = await getPokemonData(BasePokeUrl);
        console.log("BASE URL + "+basePokemonData['name']);
        let pokeTypes = '';
        let basepokeTypes = basePokemonData['types'];
         let basepokeImg = basePokemonData['sprites']['other']['home']['front_default'];
         
         basepokeTypes.forEach((poketypes,index) => {
            pokeTypes += poketypes['type']['name']+ ' ';
        }); 


        
         console.log("BASE POKEMON DATA = "+basePokemonData['name']+"\t image = "+basepokeImg+" Base Type = "+pokeTypes);
      /* */
      assignVal(pokeEvolutionName,basePokemonData['name']);
      pokeEvolutionImg.src = basepokeImg;
      assignVal(pokeEvolutionTypes,pokeTypes);
      
         var prePoke1Details = await getPrePokeDetails(pokePreversion1SpeciesUrl); // get previous pokemon name,image and type
        
        
        if(prePoke1Details){
            let a1,a2,a3;
            a1 = prePoke1Details.shift();
            assignVal(pokeEvolutionName1,a1);
            a2 = prePoke1Details.shift();
            pokeEvolutionImg1.src = a2;
            a3 = prePoke1Details.shift();
            assignVal(pokeEvolutionTypes1,a3);
        }
        if(pokePreVersion1Details.hasOwnProperty('evolves_to')){
            var pokePreversion2SpeciesUrl = pokePreVersion1Details['evolves_to'][0]['species']['url'];
            var prePoke2Details = await getPrePokeDetails(pokePreversion2SpeciesUrl);
            console.log("poke version 2 data = "+prePoke2Details);
            let i=0;

            if(prePoke2Details){            
            
                var b1,b2,b3;
                b1 = prePoke2Details.shift();
                assignVal(pokeEvolutionName2,b1);
                b2 = prePoke2Details.shift();
                pokeEvolutionImg2.src = b2;
                
                b3 = prePoke2Details.shift();
                assignVal(pokeEvolutionTypes2,b3);
            }
            
        }


    }

    /**
     * get pokemon name,image and type using id
     * pokemon id get from species url which get from evolution url
     * pokemonurl = https://pokeapi.co/api/v2/pokemon/1
     * species url = https://pokeapi.co/api/v2/pokemon-species/7/
     * evolution url =  https://pokeapi.co/api/v2/evolution-chain/3/
     */
    async function getPrePokeDetails(pokePreversionSpeciesUrl){
        console.log("inside getPrePokeDetails function =  "+pokePreversionSpeciesUrl);
       
        urlString = pokePreversionSpeciesUrl.substring(0, pokePreversionSpeciesUrl.lastIndexOf("/"));
        var final = urlString.substr(urlString.lastIndexOf('/') + 1);
        console.log("final = "+final);

        let finalUrl = url.concat(final);
        let pokePreversionSpeciesUrlData = await fetch(finalUrl);
        let pokePreversionUrlResponse = await pokePreversionSpeciesUrlData.json();
            console.log("Data Evolution =  "+pokePreversionUrlResponse);
        let name = pokePreversionUrlResponse['name'];
        let image = pokePreversionUrlResponse['sprites']['other']['home']['front_default'];
        let types = pokePreversionUrlResponse['types'];
        let prePokeTypes='';
          let pokePreviousSpeciesData = new Array();
            types.forEach((poketypes,index) => {
                prePokeTypes += poketypes['type']['name']+ ' ';
            }); 
           console.log("name = "+name +" image = "+image+" types = "+prePokeTypes);
           pokePreviousSpeciesData.push(name);
           pokePreviousSpeciesData.push(image);
           pokePreviousSpeciesData.push(prePokeTypes);
        return pokePreviousSpeciesData;
    }
    /**
     * page refresh
     */
    document.getElementById("research").addEventListener("click",()=>{
        location.reload();
    });
})();