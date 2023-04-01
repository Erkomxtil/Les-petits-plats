import { getIngredientList, selectListSearchTags, getApplianceOrUstensils, orderedListWithoutDouble } from "./main.js"
import { getRecipesDatas } from "./datas.js"
import { displayRecipe } from "./recipeFactory.js"

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
    if(e.target.value.length >= 3) {
      
      let displayRecipeArray = [], ingredientsArray = [], appliancesArray = [], ustensilsArray = []      
      recipesDatas.forEach(data => {
        const allRecipes = getAllRecipesSelectedWithInput(titles, ingredients, descriptions, query)
        getNewObjetFromTheSelection(allRecipes, data, displayRecipeArray, ingredientsArray, appliancesArray, ustensilsArray)
      })

      /* Mise à jour des tags avec la recherche principale */
      displayNewListSearchTags(ingredientsArray, ".list-ingredients", "newList")
      displayNewListSearchTags(appliancesArray, ".list-appliances", "newList")
      displayNewListSearchTags(ustensilsArray, ".list-ustensils", "newList")

      /* Mise à jour des tags avec la recherche secondaire */
      searchTags(ingredientsArray, "input-ingredient", ".list-ingredients")
      searchTags(appliancesArray, "input-appliance", ".list-appliances")
      searchTags(ustensilsArray, "input-ustensils", ".list-ustensils")

      /* Affichage quand aucune recette ne correspond à la recherche */
      if(displayRecipeArray.length === 0) {
        noRecipesFoundDisplay()
      }else {
        displayRecipeAfterSelection(displayRecipeArray)      
      }
    } else {
      displayRecipeAfterSelection(recipesDatas)
    }
  })
}

function noRecipesFoundDisplay() {
  const main = document.querySelector(".recipes-wrapper")
  main.innerHTML = `<p class="no-recipes">Aucune recette ne correspond à votre critère… vous pouvez
  chercher « tarte aux pommes », « poisson », etc</p>`
}

function displayNewListSearchTags(listInfos, listParagraphe, fullList) { 
  const list = document.querySelector(listParagraphe)
  list.innerHTML = ""
  let newListArray = []

  if(fullList === "fullListIngredients"){
    listInfos.map((info) => {
      newListArray.push(info.ingredient)
    })
  }

  if(fullList === "fullListAppliances") {
    listInfos.map((info) => {
      newListArray.push(info.appliance)
    })
  }

  if(fullList === "fullListUstensils") {
    listInfos.map((info) => {
      newListArray.push(info.ustensils)
    })
  }
  
  if(fullList === "newList") {
    listInfos.map((info) => {
      newListArray.push(info)
    })
  }
  
  let listInfoWithoutDouble = newListArray.reduce(function (acc, valCourante) {
    if(acc.indexOf(valCourante) === -1) {
      acc.push(valCourante);
    }
    return acc
  }, []);
  
  listInfoWithoutDouble.sort((a,b) => a.localeCompare(b)) 

  listInfoWithoutDouble.map( info => {
    list.innerHTML += `<a href="#" id="${info.toLowerCase()}" class="tag" onclick="displayTagsSelected();">${info}</a>`
  })
}

/**
 * Affichage des recettes
 * @param {*} recipesDatas tableau des recettes selectionnées
 */
function displayRecipeAfterSelection(recipesDatas){
  const main = document.querySelector(".recipes-wrapper")
  main.innerHTML = ""
  displayRecipe(recipesDatas)
}

/**
 * Retourne tous les id des recettes choisis
 * @param {*} titles Compare les titres avec la valeur de l'input
 * @param {*} ingredients Compare les ingrédients avec la valeur de l'input
 * @param {*} descriptions Compare les descriptions avec la valeur de l'input
 * @param {*} query Recherche de l'utilisateur
 * @returns 
 */
function getAllRecipesSelectedWithInput(titles, ingredients, descriptions, query) {
  let allRecipes = []
      
  titles.map( title => {
    if (title.title.includes(query)) {
      allRecipes.push(title.id)
    }
  })

  ingredients.map( ingredient => {
    if(ingredient.ingredient.includes(query)) {
      allRecipes.push(ingredient.id)
    }
  })

  descriptions.map( description => {
    if (description.description.includes(query)) {
      allRecipes.push(description.id)
    }
  })

  return allRecipes
}

/**
 * Gestion des données après la selection de l'utilisateur
 * @param {*} allRecipes On récupère tous les id des recettes selectionnées
 * @param {*} data C'est l'ensemble des recettes
 * @param {*} displayRecipeArray tableau de retournée une fois la selection faite pour l'affichage des recettes
 * @param {*} ingredientsArray tableau des ingrédients disponible après la selection
 * @param {*} appliancesArray tableau des appareils disponible après la selection
 * @param {*} ustensilsArray tableau des ustensiles disponible après la selection
 */
function getNewObjetFromTheSelection(allRecipes, data, displayRecipeArray, ingredientsArray, appliancesArray, ustensilsArray) {
  if(allRecipes?.includes(data.id)) {
    let recipe = {
      "id": data.id,
      "name": data.name,
      "ingredients": data.ingredients,
      "time": data.time,
      "description": data.description,
    }
    displayRecipeArray.push(recipe)
    data.ingredients.map(ingredient => ingredientsArray.push(ingredient.ingredient))
    appliancesArray.push(data.appliance)
    data.ustensils.map(ustensil => ustensilsArray.push(ustensil))
  } 
}


/**
 * Récupère les données spécifiées
 * @param {*} recipesDatas données de toutes les recettes
 * @param {*} dataType Mettre le type de donnée que l'on souhaite "name", "ingredients" ou "description"
 * @returns On obtient un tableau avec les données demandées
 */
async function getDatasFromMainRecipes(recipesDatas, dataType) {
  let datas = []

  recipesDatas.forEach((element) => {
    if(dataType === "name") {
      let elementData = {
        "title":element.name.toLowerCase(),
        "id": element.id
      }
      datas.push(elementData)
    }
  
    if(dataType === "ingredients") {
      element.ingredients.forEach((ingredient) => {
        let elementData = {
          "ingredient":ingredient.ingredient.toLowerCase(),
          "id": element.id
        }
        datas.push(elementData)
      })
    }

    if(dataType === "description") {
      let elementData = {
        "description": element.description.toLowerCase(),
        "id": element.id
      }
      datas.push(elementData)
    }

    if(dataType === "appliance") {
      let elementData = {
        "appliance": element.appliance.toLowerCase()
      }
      datas.push(elementData)
    }

    if(dataType === "ustensils") {
      element.ustensils.map(ustensil =>  {
        let elementData = {
          "ustensils": ustensil
        }
        datas.push(elementData)
      })
    }
  })
  return datas
}

/**
 * Gestion de la sous recherche avec les tags
 * @param {*} datasList tableau avec informations, ingrédients, appareils ou utensiles
 * @param {*} inputTag mettre l'input sur lequel on veut faire le tri
 * @param {*} listTag mettre la class qui recoit les informations pour l'affichage
 */
async function searchTags(datasList, inputTag, listTag) {
  const datas = await datasList
  const input = document.getElementById(inputTag)
  
  function getDatasToLowerCase() {
    let tab = []
    for (const data of datas) {
      tab.push(data.toLowerCase())
    }
    return tab
  }

  input?.addEventListener("input", (e) => {    
    const datas = getDatasToLowerCase()
    const query = e.target.value.toLowerCase()
    const selectedDatas = datas.filter((data) => data.includes(query))

    selectListSearchTags(selectedDatas,listTag) 
    HideTags(datas, listTag, query)
  })      
}

/**
 * On cache les tags au click
 * @param {*} datas on récupère les données pour mettre à jour la liste après le click
 * @param {*} listTag 
 * @param {*} query Recherche de l'utilisateur
 */
function HideTags(datas, listTag, query) {
  const tagsSearch = document.querySelector(".tags-selected")
  const btnSelected = tagsSearch.getElementsByTagName("button")

  /* On enlève les tags selection de la liste search */
  if(btnSelected.length > 0) {  
    for (let btn of btnSelected) {
      const index = datas.indexOf(btn.textContent.toLowerCase())
      datas.splice(index,1)      
      const selectedDatas = datas.filter((data) => data.includes(query))
      if(listTag !== undefined) {
        selectListSearchTags(selectedDatas,listTag) 
      }
    }
  }

  const callback = (mutationList) => {      
    for (let mutation of mutationList){
      if (mutation.type === "childList") {
        if(mutation.addedNodes.length > 0) {                    
          for (let btn of btnSelected) {

            const index = datas.indexOf(btn.textContent.toLowerCase())
            datas.splice(index,1)
            const selectedDatas = datas.filter((data) => data.includes(query))
            selectListSearchTags(selectedDatas,listTag)             
          }         
        }
        if(mutation.removedNodes.length > 0){             
          datas.push(mutation.removedNodes[0].innerText)
          const selectedDatas = datas.filter((data) => data.includes(query))
        
          selectListSearchTags(orderedListWithoutDouble(selectedDatas),listTag)       
        }
      } 
    }
  }

  let observer = new MutationObserver(callback)
  observer.observe(tagsSearch, {attributes: true, childList: true})
}

/**
 * Variable global tableau des tags selectionnés pour l'ajout et le retrait des tags
 */
var tagsSearchArray = []


function displayTagsSelected() {
  document.addEventListener("click", (e)=> {
    if(e.target.classList.contains("tag")){
      console.log()
      const tagWrapper = document.querySelector(".tags-selected")
      const tagText = e.target.textContent      
      const tagsSearch = document.querySelector(".tags-search")
      const colorTag = e.target.parentNode.getAttribute("id")      
      
      tagsSearchArray.push(tagText) 
      tagsSearch.dataset.tags = [tagsSearchArray]
      e.target.style.display = "none"
      tagWrapper.innerHTML+=`<button class="btn-tag" onload="removeBtnTag();" data-selected="true" data-color="${colorTag}">${tagText}<i class="far fa-times-circle"></i></button>`
    }
  })
}

async function removeBtnTag() {
  document.addEventListener("click", (e)=> {
    if(e.target.classList.contains("btn-tag")){    
      const tagSelectedText = e.target.textContent.toLowerCase()
      const allTagsListSearch = document.querySelectorAll(".tag")
      const tagsSearch = document.querySelector(".tags-search")
      const tagsSearchText = tagsSearch.dataset.tags      
      const index = tagsSearchArray.indexOf(tagSelectedText)
      
      console.log(tagsSearchArray)
      console.log(tagSelectedText)
      
      tagsSearchArray = tagsSearchText.toLowerCase().split(",")
      tagsSearchArray.splice(index, 1)
      tagsSearch.dataset.tags = [tagsSearchArray]      
      
      for (let tag of allTagsListSearch) {
        tag.style.display = "block"
        e.target.remove()
      }
    }
  })
}

function initSearch() {
  searchTags(getIngredientList(), "input-ingredient", ".list-ingredients")
  searchTags(getApplianceOrUstensils("appliance"), "input-appliance", ".list-appliances")
  searchTags(getApplianceOrUstensils("ustensils"), "input-ustensils", ".list-ustensils")
  mainSearch(getRecipesDatas())
  displayTagsSelected()
  window.onload = removeBtnTag()
}

initSearch()

export { searchTags }
