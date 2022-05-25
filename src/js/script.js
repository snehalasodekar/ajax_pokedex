/* 
 * Display pokemon details after adding pokemon name to search box.
* fetch pokemon details from pokeAPI
 */

(() => {
    //'https://pokeapi.co/api/v2/pokemon?limit=151'
    var url = "https://pokeapi.co/api/v2/pokemon/";
    var speciesUrl,basePokemon;
    var showNoEvolutionPokeMsg = document.getElementById("showNoEvolutionPokeMsg");
    showNoEvolutionPokeMsg.style.display= "none";
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
        const PokemonDataResponse = await fetch(murl);

        if (PokemonDataResponse.status >= 200 && PokemonDataResponse.status <= 299) {
            const PokemonDataJsonResponse = await PokemonDataResponse.json();
            return PokemonDataJsonResponse;
        } else {
        // Handle errors
            console.log("No Pokemon Found");
            console.log(response.status, response.statusText);
        }
        //getPokeEvolution(pokeJson['id']); //get evolutions of searched pokemon
       
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
         console.log(speciesUrl);
        let pokeSpeciesUrl = await fetch(speciesUrl);
        let speciesUrlData= await pokeSpeciesUrl.json();
        //console.log("speciesUrlData ="+speciesUrlData['evolution_chain']['url']);
        /** from json of species url we get evolution url send it to another function */
        let evolutionUrl = speciesUrlData['evolution_chain']['url'];
        console.log("evolutionUrl = "+evolutionUrl);
        getPokeEvolution(evolutionUrl);
     }

    async function getPokeEvolution(evolutionUrl){
        let pokeEvolution = await fetch(evolutionUrl);
        let pokeEvolutionDetails = await pokeEvolution.json();
        
        let pokeEvolutionArr = pokeEvolutionDetails['chain']['evolves_to'];
        let length1stPokeEvolvesTo = pokeEvolutionDetails['chain']['evolves_to'].length;
        let evolutionArr = new Array();
        if(length1stPokeEvolvesTo) { // if a base pokemon has atleast one evolution
            
            let basePokemonName = pokeEvolutionDetails['chain']['species']['name'];
            

           
            //get pokemon Name, img and type and send it to display evolution data.
            let pokeUrl = url.concat(basePokemonName);
            console.log("URL = "+`${url}${pokeEvolutionArr[0].species.name}`);
            let getBasePokeData = await getPokemonData(pokeUrl);
            evolutionArr = pushEvolutionData(getBasePokeData,evolutionArr);
            //
            
            

         }else{ // if pokemon has no evolution
            //document.getElementById("showNoEvolutionPokeMsg").innerHTML = "This pokemon has no evolution";
            document.getElementById("showNoEvolutionPokeMsg").style.display = "block";
            document.getElementById("evolution").style.display="none";
            console.log("This pokemon has no evolution");
         }

    }
    /**
     * display Evolutions
     */
      /*______________Other Functions______________*/
      const pushEvolutionData = (jsonobj , arr) => {
          let typeArr = jsonobj.types;
          let pokeTypes='';
          typeArr.forEach((poketypes,index) => {
            pokeTypes += poketypes['type']['name']+ ', ';
        }); 
        let newObj = {'name' :  jsonobj.name , 'url': jsonobj.sprites.other.home.front_default, 'types':pokeTypes};
        console.log(newObj);
        arr.push(newObj);
        
        return arr;
    }
    const displayChainOfEvo = (arr) => {
        let parent = document.querySelector('.container');
        let row = createRow('pokeDetails');
        for (let i = 0 ; i < arr.length; i++){
            let col = createCol('col-12 col-md-4');
            let name = document.createElement('h4');
            name.innerHTML = arr[i].name;
            let img = createImg(arr[i].url);
            col.appendChild(name);
            col.appendChild(img);
            row.appendChild(col);
        }
        parent.appendChild(row);
    }
    /**
     * page refresh
     */
    document.getElementById("research").addEventListener("click",()=>{
        location.reload();
    });
})();