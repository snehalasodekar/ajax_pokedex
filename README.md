# ajax_pokedex
A javascript Ajax project.
https://snehalchetan.github.io/ajax_pokedex/
## Learning Objectives
* A typical AJAX flow: send asynchronous requests to a remote server and process the results;
* DOM manipulation: changing the DOM based on results of AJAX-requests.

## Exercise
Make a [Pokédex](https://www.google.com/search?q=pokedex&source=lnms&tbm=isch&sa=X&ved=0ahUKEwiRtNT3-vDfAhWDy6QKHd1cBD4Q_AUIDigB&biw=1300&bih=968#imgrc=_) using [Pokeapi](https://pokeapi.co/).

## Goals
* Send an ajax request to remote server.
* In response must receive a pokemon data. (using name and Id)
* Search a pokémon by name and by ID
* Display the response in DOM with below information:
    * The ID-number
    * An image (sprite)
    * _At least_ 4 "moves"
    * The previous evolution
    * Using CSS make webpage look like pokedex
        - onclick of submit display pokemon details
        - on pokemon page - display all information of pokemon (name, short description,version,height, category, weight, abilities, gender, Type, weaknesses)) as in below image.
    ![pokedex pokemon page](./src/images/readme3.png)
## Extended Goals
    * Pokemon page
        - On click of versions chnage the short description
        - Add Pokemon evolution section as below image.
   ![pokemon evolution](./src/images/readme4.png)
        - Add Explore more pokemon tab.
## Extra Extended Challenge Implementation Goal
* Couple of pokemon that don't play with the normal rules
* Add cases for them as,
    - Ditto only has 1 move.
    - Eevee has 6 evolutions.
#Need to fix
[x] display message for the pokemons who don't have evolutions [evolves_from_species]
[x] display data of pokemon which has only one evolution
[x] clean code
[ ] Make code working for darmanitan Pokemon