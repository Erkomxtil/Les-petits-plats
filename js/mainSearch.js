import { displayRecipesWithTagsSelected, getAllRecipesSelectedWithInput, getDatasFromMainRecipes, getRecipesDatas, noRecipesFoundDisplay, updateTagsListWithSearch } from "./search.js"

/**
 * affichage des recettes avec la recherche principale
 * @param {*} datas On récupère toutes les recette
 */
async function mainSearch(datas) {
  const recipesDatas = await datas
  const search = document.getElementById("search")  
  let titles = await getDatasFromMainRecipes(recipesDatas, "name")
  let ingredients = await getDatasFromMainRecipes(recipesDatas, "ingredients")
  let descriptions = await getDatasFromMainRecipes(recipesDatas, "description")
  
  search.addEventListener("input", (e) => {
    e.preventDefault()
    const query = e.target.value
    let allRecipes    
    let filteredDatas = []
    
    if(e.target.value.length >= 3) {      
      allRecipes = getAllRecipesSelectedWithInputWithFor(titles, ingredients, descriptions, query)
      filteredDatas = recipesDatas.filter( recipe => allRecipes.includes(recipe.id))

      updateTagsListWithSearch(filteredDatas)
      
      /* Affichage quand aucune recette ne correspond à la recherche */
      if(filteredDatas.length === 0) {
        noRecipesFoundDisplay()
      } else {
      /* Affichage des recettes avec la contrainte des tags */          
        displayRecipesWithTagsSelected(filteredDatas)
      }
    } else {
      updateTagsListWithSearch(recipesDatas)
      displayRecipesWithTagsSelected(getRecipesDatas())
    }
  })
}

function getAllRecipesSelectedWithInputWithFor(titles, ingredients, descriptions, query) {
  let allRecipes = []
  for (let title of titles){
    if (title.title.includes(query)) {
      allRecipes.push(title.id)
    }
  }
  
  for (let ingredient of ingredients) {
    console.log(ingredient.ingredient)
    console.log(query, "query")
    if (ingredient.ingredient.includes(query)) {
      allRecipes.push(ingredient.id)
    }
  }

  for (let description of descriptions) {
    if (description.description.includes(query)) {
      allRecipes.push(description.id)
    }
  }

  return allRecipes
}

export { mainSearch }