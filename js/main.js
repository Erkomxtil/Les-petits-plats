import { displayRecipe } from "./recipeFactory.js";
import { getRecipesDatas } from "./datas.js";
import { closeTagsSearch, openTagsSearch } from "./tags.js"
import { searchTags } from "./search.js"
import { mainSearch } from "./mainSearch.js"


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
  
  let orderedListIngredient = listIngredientsWithoutDouble.sort(function (a,b) {return a.localeCompare(b)}) 
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
 * @param {*} info On choisit si on veut les appareils ou ustensiles "appliance" ou "ustensils"
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

  return orderedListWithoutDouble(datas)
}

/**
 * 
 * @param {*} datas tableau à trier
 * @returns il retourne un tableau trié sans doublons
 */
function orderedListWithoutDouble(datas){
  let listInfoWithoutDouble = datas.reduce(function (acc, valCourante) {
    if(acc.indexOf(valCourante) === -1) {
      acc.push(valCourante);
    }
    return acc
  }, []);

  return listInfoWithoutDouble.sort((a,b) => typeof(a)!== "number" ? a.localeCompare(b): "")
}

/**
 * Affichage de la liste des tags ingrédients, appareils et ustensiles
 * @param {*} datas tableau de données
 * @param {*} listParagraphe On choisit la div d'affichage de la liste
 */
async function selectListSearchTags(datas, listParagraphe) {
  const listInfos = await datas
  const list = document.querySelector(listParagraphe)

  try {
    list.innerHTML = ""
    listInfos.map((info) => {
      const infoCapitalized =  info.charAt(0).toUpperCase() + info.slice(1)
      list.innerHTML += `<a href="#" id="${info.split(" ").join("").toLowerCase()}" class="tag" onload="displayTagsSelected();">${infoCapitalized}</a>`
    })
  } catch (error) {
    console.log(error.message)
  }
}

/* Affichage des recettes */
displayRecipe(getRecipesDatas())

/**
 * Initialisation des fonctions
 */
function init() {
  selectListSearchTags( getIngredientList(), ".list-ingredients")
  selectListSearchTags( getApplianceOrUstensils("ustensils"), ".list-ustensils")
  selectListSearchTags( getApplianceOrUstensils("appliance"), ".list-appliances")
  searchTags(getIngredientList())
  openTagsSearch()
  closeTagsSearch()
  mainSearch(getRecipesDatas())
}



init()

export { getIngredientList, getDescriptionsOrTitle, selectListSearchTags, getApplianceOrUstensils, orderedListWithoutDouble }
