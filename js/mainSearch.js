import { displayRecipesWithTagsSelected, getAllRecipesSelectedWithInput, getDatasFromMainRecipes, getRecipesDatas, noRecipesFoundDisplay, updateTagsListWithSearch } from "./search.js"

async function mainSearch(datas) {
  const recipesDatas = await datas
  const search = document.getElementById("search")  
  let titles = await getDatasFromMainRecipes(recipesDatas, "name")
  let ingredients = await getDatasFromMainRecipes(recipesDatas, "ingredients")
  let descriptions = await getDatasFromMainRecipes(recipesDatas, "description")
  let appliances = await getDatasFromMainRecipes(recipesDatas, "appliance")
  let ustensils = await getDatasFromMainRecipes(recipesDatas, "ustensils")
  
  search.addEventListener("input", (e) => {
    e.preventDefault()
    const query = e.target.value
    let allRecipes    
    let filteredDatas = []
    
    if(e.target.value.length >= 3) {      
      allRecipes = getAllRecipesSelectedWithInput(titles, ingredients, descriptions, appliances, ustensils, query)
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

export { mainSearch }