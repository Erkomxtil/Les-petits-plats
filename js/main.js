import { displayRecipe } from "./recipeFactory.js";
import { getRecipesDatas } from "./datas.js";
import { closeTagsSearch, openTagsSearch } from "./tags.js"

/**
 * 
 * @returns On récupère la liste des ingrédients dans l'ordre alphabétique
 */
async function getIngredientList() {
  const recipes = await getRecipesDatas()
  const listIngredients = []

  recipes.map( (recipe) => {
    recipe.ingredients.map((ingredientList) => {
      listIngredients.push(ingredientList.ingredient)
    })
  })
  
  /**
   * On enlève les doubles dans la liste des ingrédients
   */
  let listIngredientsWithoutDouble = listIngredients.reduce(function (acc, valCourante) {
    if(acc.indexOf(valCourante) === -1) {
      acc.push(valCourante);
    }
    return acc
  }, []);
  
  let orderedListIngredient = listIngredientsWithoutDouble.sort() 
  const forDeletion = ["Beurre fondu", "Beurre salé", "Chocolat au lait","Chocolat noir","Chocolat noir en pépites", "Citron Vert", "Farine de blé noir", "Oeuf dur", "Viande hachée 1% de matière grasse"]
  let finalList = orderedListIngredient.filter(item => !forDeletion.includes(item))
  return finalList 
}

/**
 * 
 * @param {*} info On choisit si on veut les titres ou la descrition "title" ou "description"
 * @returns On récupère les titres ou les descriptions
 */
async function getDescriptionsOrTitle(info) {
  const recipes = await getRecipesDatas()
  let datas
  
  recipes.map((recipe) => {
    info === "title" ? datas = recipe.name : datas = recipe.description
    return datas
  })
}

/**
 * 
 * @param {*} info On choisit si on veut les titres ou la descrition "title" ou "description"
 * @returns On récupère les titres ou les descriptions
 */
async function getApplianceOrUstensils(info) {
  const recipes = await getRecipesDatas()
  let datas = recipes.map((recipe) => {
    if(info === "appliance") {
      return recipe.appliance
    } else {
      let ustensils = recipe.ustensils
      let tool
      ustensils.map((tools) => tool = tools)
      return tool      
    }
  })

  
  let listInfoWithoutDouble = datas.reduce(function (acc, valCourante) {
    if(acc.indexOf(valCourante) === -1) {
      acc.push(valCourante);
    }
    return acc
  }, []);
  
  return listInfoWithoutDouble
}





/**
 * Affichage de la liste des tags ingrédients, appareils et ustensiles
 */
async function selectListIngredients(datas, listParagraphe) {
  const listInfos = await datas
  const list = document.querySelector(listParagraphe)

  try {
    listInfos.map((info) => list.innerHTML += `<a href="#" class="tag">${info}</a><br>`)
  } catch (error) {
    console.log(error.message)
  }
}



/* Affichage des recettes */
displayRecipe()

/**
 * Initialisation des fonctions
 */
function init() {
  selectListIngredients( getIngredientList(), ".list-ingredients")
  selectListIngredients( getApplianceOrUstensils("ustensils"), ".list-ustensils")
  selectListIngredients( getApplianceOrUstensils("appliance"), ".list-appliance")
  
  openTagsSearch()
  closeTagsSearch()
}

init()

export { getIngredientList, getDescriptionsOrTitle }
