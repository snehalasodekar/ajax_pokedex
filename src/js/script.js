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

    /**
     * Pokemon search button click functionality
     * 
     */
    document.querySelector("#submit").addEventListener("click",()=>{
        var formSearchName = document.getElementById("pokemonName");
        if(!validate(formSearchName)){
            let getPokemon  = document.querySelector("#pokemonName").value;
            displayPokemon(`${url+getPokemon}`);
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

    async function displayPokemon(url){
        const pokeApiResponse = await getPokemonData(url);

        var abilities = pokeApiResponse['abilities'];
        var pokeAbilities = '';

        
        var image = pokeApiResponse['sprites']['other']['home']['front_default'];
            pokeImage.src = image;


        speciesUrl = pokeApiResponse['species']['url'];

        // using searched pokemon we get it's species url and from that we get it's evolution url
        // from this evolution url we can get evolution of searched pokemon
        getPokeEvolutionUrl(speciesUrl);

        /**
         * display image with specific size
         */
        if(pokeImage && pokeImage.style) {
            pokeImage.style.width = '300px';
        }

        assignVal(pokeName,pokeApiResponse['name']);
        assignVal(pokeIdLabel,"# "+pokeApiResponse['id']);
        assignVal(pokeWeight,pokeApiResponse['weight']);
        assignVal(pokeHeight,pokeApiResponse['height']);
        assignVal(pokeAbilitiesLabel,pokeAbilities);
        assignVal(pokeTypesLabel,getTypes(pokeApiResponse['types']));
        assignVal(pokeMovesLabel,getMoves(pokeApiResponse['moves']));
    } 

/**
         * get abilities array
        
    const getAbilities = () =>
 abilities.forEach((pokeAbility,index) => {
    pokeAbilities += pokeAbility['ability']['name'] + ',  ';
});
 */


    /**
     * get moves of pokemon
     */
    const getMoves = (movesArr) => {
        let moves ='';
        movesArr.forEach((move,index) => {
            if(index > 0 && index < 6){
                moves += move['move']['name'] + ', ';
            }
          });
        return moves;
    }
    /*
    * get types array
    */
    const getTypes = (typesArr) => {
        let types ='';
        typesArr.forEach((move,index) => {
            types += typesArr['type']['name']+ ', ';
          });
        return types;
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
        let pokeSpeciesUrl = await fetch(speciesUrl);
        let speciesUrlData= await pokeSpeciesUrl.json();
         /** from json of species url we get evolution url send it to another function */
        getPokeEvolution(speciesUrlData['evolution_chain']['url']);
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
            let getBasePokeData = await getPokemonData(pokeUrl);

            evolutionArr = pushEvolutionData(getBasePokeData,evolutionArr);

            for(let i=0;i<pokeEvolutionArr.length;i++){ //for getting first level evolution
                let eve1 = await getPokemonData(`${url+pokeEvolutionArr[i].species.name}`);
                evolutionArr = pushEvolutionData(eve1,evolutionArr);
                for(j=0;j<pokeEvolutionArr[i].evolves_to.length;j++){ // get if the first level has another evolution
                    let eve2 = await getPokemonData(`${url+pokeEvolutionArr[i].evolves_to[j].species.name}`);
                    evolutionArr = pushEvolutionData(eve1,evolutionArr);
                }
            }
            
            displayEvolutionPokemon(evolutionArr);

         }else{ // if pokemon has no evolution
            document.getElementById("showNoEvolutionPokeMsg").style.display = "block";
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
        arr.push(newObj);
        return arr;
    }
    let displayEvolutionPokemon = (evolutionPokeArr) => {
        let parent = document.querySelector('.evolutionSection');
        let row = createRow('pokeDetails');
        for (let i = 0 ; i < evolutionPokeArr.length; i++){
            let col =createCol('col-12 col-md-4');
            let name = document.createElement('h4');
            name.innerHTML = evolutionPokeArr[i].name;
            let img = createImg(evolutionPokeArr[i].url);
            let types = document.createElement('h5');
            types.innerHTML = evolutionPokeArr[i].types.slice(0, -2);
          
            col.appendChild(img);
            col.appendChild(name);
            col.appendChild(types);
            row.appendChild(col);
        }
        parent.appendChild(row);
    }
    /**
     * create functions for html layout for evolution 
     */
    const createRow = (rowClass) => {
        let row = document.createElement('div');
        row.setAttribute('class', `row align-items-center ${rowClass}`);
        return row;
    }
    const createCol = (columnsClass) => {
        let col = document.createElement('div');
        col.setAttribute('class', `${columnsClass} text-center`);
        return col;
    }
    const createImg = (imgPath) => {
        let img =  document.createElement('img');
        img.setAttribute('src', imgPath);
        img.style.width = "200px";
        img.style.borderRadius  = "50%";
        img.style.border = "1px solid black";
        return img;
    }

    /**
     * page refresh
     */
    document.getElementById("research").addEventListener("click",()=>{
        location.reload();
    });
})();