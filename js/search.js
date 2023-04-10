import { getIngredientList, selectListSearchTags, getApplianceOrUstensils, orderedListWithoutDouble } from "./main.js"
import { getRecipesDatas } from "./datas.js"
import { displayRecipe } from "./recipeFactory.js"

/**
 * Variable global tableau des tags selectionnés pour l'ajout et le retrait des tags
 */
var tagsSearchArray = []

/**
 * Affichage des recettes suite à la recherche principale
 * @param {*} allDatasFromMainSearch liste des recettes
 */
async function displayRecipesWithTagsSelected(allDatasFromMainSearch) {
  const recipeDatas = await allDatasFromMainSearch
  const targetNode = document.querySelector(".tags-selected")
  const config = { childList: true }  
  const main = document.querySelector(".recipes-wrapper")
  
  displayRecipeAfterSelection(recipeDatas)

  let callback = (mutationList) => {
    if (mutationList[0].type === "childList") {
      observer.disconnect()
      main.innerHTML = ""
      displayRecipeAfterSelection(tagsSelectedDisplay(recipeDatas))      
      observer.observe(targetNode, config)
    }
    
    if(mutationList[0].target.childNodes.length === 0) {
      displayRecipeAfterSelection(recipeDatas)
    }
  }
  
  const observer = new MutationObserver(callback)  
  observer.observe(targetNode, config) 
}

/**
 * Liste des recettes après avoir choisi des tags
 * @param {*} allRecipesDatas On récupère toutes les recettes
 * @returns 
 */
async function tagsSelectedDisplay(allRecipesDatas) {
  let recipeDatas
  if (typeof allRecipesDatas?.then === 'function') {
    recipeDatas = await allRecipesDatas
  } else {
    recipeDatas = allRecipesDatas
  }

  let tagFilter = false 
  let recipeFilteredWithTag = []
  let allIngredientsTag = []
  let allAppliancesTag = []
  let allUstensilsTag = []
  const tagsSelectedList = document.querySelectorAll(".btn-tag")
  
  for (let tag of tagsSelectedList){
    if (tag.dataset.color === "ingredients") {      
      allIngredientsTag.push(tag.textContent.toLowerCase())
    }
  }
  for (let tag of tagsSelectedList){  
    if (tag.dataset.color === "appliances") {      
      allAppliancesTag.push(tag.textContent.toLowerCase())
    }
  }
  for (let tag of tagsSelectedList){  
    if (tag.dataset.color === "ustensils") {
      allUstensilsTag.push(tag.textContent.toLowerCase())
    }
  }
    
  if(allIngredientsTag.length > 0) {
    if(tagFilter) {
      recipeFilteredWithTag = recipeFilteredWithTag.filter(recipe => recipe.ingredients.some( ingredient => allIngredientsTag.includes(ingredient.ingredient.toLowerCase())))
    } else {
      recipeFilteredWithTag = recipeDatas.filter(recipe => recipe.ingredients.some( ingredient => allIngredientsTag.includes(ingredient.ingredient.toLowerCase())))
      tagFilter = true
    }
  }
  
  if(allAppliancesTag.length > 0) {
    if(tagFilter) {              
      recipeFilteredWithTag = recipeFilteredWithTag.filter(recipe => allAppliancesTag.includes(recipe.appliance.toLowerCase()))
    } else {
      recipeFilteredWithTag = recipeDatas.filter(recipe => allAppliancesTag.includes(recipe.appliance.toLowerCase()))
      tagFilter = true
    }
  }
  
  if(allUstensilsTag.length > 0) {
    if(tagFilter) {
      recipeFilteredWithTag = recipeFilteredWithTag.filter(recipe => recipe.ustensils.some( ustensil => allUstensilsTag.includes(ustensil.toLowerCase())))
    } else {
      recipeFilteredWithTag = recipeDatas.filter(recipe => recipe.ustensils.some( ustensil => allUstensilsTag.includes(ustensil.toLowerCase())))
      tagFilter = true
    }
  }

  if(allUstensilsTag.length === 0 && allAppliancesTag.length === 0 && allIngredientsTag.length === 0) {
    recipeFilteredWithTag = recipeDatas
  }

  return recipeFilteredWithTag 
}

/**
 * Affichage quand aucune recette ne correspond
 */
function noRecipesFoundDisplay() {
  const main = document.querySelector(".recipes-wrapper")
  main.innerHTML = `<p class="no-recipes">Aucune recette ne correspond à votre critère… vous pouvez
  chercher « tarte aux pommes », « poisson », etc</p>`
}

/**
 * Mise à jour de la liste des tags avec la recherhce principale
 * @param {*} listInfos Données concernant la liste des ingrédients, appareils ou ustensiles
 * @param {*} listParagraphe On choisit la div dans laquelle on veut changer les tags 
 * @param {*} fullList On choisit quelles liste on veut récupérer
 */
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
    list.innerHTML += `<a href="#" id="${info.toLowerCase()}" class="tag" onload="displayTagsSelected();">${info}</a>`
  })

}

/**
 * Affichage des recettes
 * @param {*} recipesDatas tableau des recettes selectionnées
 */
async function displayRecipeAfterSelection(recipesDatas){
  let dataDisplay

  if (typeof recipesDatas?.then === 'function') {
    dataDisplay = await recipesDatas
  } else {
    dataDisplay = recipesDatas
  }

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
      "appliance": data.appliance,
      "ustensils": data.ustensils
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

  function tagDisplay(e) {
    const datas = getDatasToLowerCase()
    const query = e.target.value.toLowerCase()
    const selectedDatas = datas.filter((data) => data.includes(query))
    
    selectListSearchTags(selectedDatas,listTag) 
    HideTags(datas, listTag, query)
  }

  input?.addEventListener("input", (e) => {
    tagDisplay(e)
  }, {passive: true})      
}


/**
 * Mise à jour des tags avec les recherches
 * @param {*} filteredDatas On récupère la liste des recettes filtrées pour afficher les tags qui correspondent
 */
async function updateTagsListWithSearch(filteredDatas) {
  let tagDisplay
  if (typeof filteredDatas?.then === 'function') {
    tagDisplay = await filteredDatas
  } else {
    tagDisplay = filteredDatas
  }
  let ingredientsArray = [], appliancesArray = [], ustensilsArray = []      

  for (let data of tagDisplay) {
    for (let ingredient of data.ingredients) {
      ingredientsArray.push(ingredient.ingredient)
    }
  }
  for (let data of tagDisplay) {
    appliancesArray.push(data.appliance)
  }

  for (let data of tagDisplay) {
    for (let ustensil of data.ustensils) {
      ustensilsArray.push(ustensil)
    }
  }

  /* Mise à jour des tags avec la recherche principale */
  displayNewListSearchTags(ingredientsArray, ".list-ingredients", "newList")
  displayNewListSearchTags(appliancesArray, ".list-appliances", "newList")
  displayNewListSearchTags(ustensilsArray, ".list-ustensils", "newList")

  /* Mise à jour des tags avec la recherche secondaire */
  searchTags(ingredientsArray, "input-ingredient", ".list-ingredients")
  searchTags(appliancesArray, "input-appliance", ".list-appliances")
  searchTags(ustensilsArray, "input-ustensils", ".list-ustensils")

  const allTagsList = document.querySelectorAll(".tag")
  for (let tag of allTagsList) {
    for (let tagS of tagsSearchArray) {
      if(tagS === tag.textContent.toLowerCase()) {
        tag.style.display = "none"
      }
    }
  }

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
 * Affichage des tags selectionnés
 */
async function displayTagsSelected() {
  const recipesDatas = await getRecipesDatas()
  let titles = await getDatasFromMainRecipes(recipesDatas, "name")
  let ingredients = await getDatasFromMainRecipes(recipesDatas, "ingredients")
  let descriptions = await getDatasFromMainRecipes(recipesDatas, "description")
  const search = document.getElementById("search")
  const tagsSearchDataset = document.querySelector(".tags-search")

  document.addEventListener("click", (e)=> {


    if(e.target.classList.contains("tag")){
      const colorTag = e.target.parentNode.getAttribute("id")    
      const tagWrapper = document.querySelector(".tags-selected")
      const tagText = e.target.textContent.toLowerCase()      
      const tagsSearch = document.querySelector(".tags-search")
      
      tagsSearchArray.push(tagText) 
      tagsSearch.dataset.tags = [tagsSearchArray]
      e.target.style.display = "none"
      tagWrapper.dataset.addedRemoved= "added"
      tagWrapper.innerHTML+=`<button class="btn-tag" onload="removeBtnTag();" data-selected="true" data-color="${colorTag}">${tagText}<i class="far fa-times-circle"></i></button>`
      
      tagsSelectedDisplay(getRecipesDatas())
        .then( recipe => {
        if(recipe.length === 0) {
          noRecipesFoundDisplay()
        }

        if (recipe.length > 0 && search.value.length === 0) {   
          updateTagsListWithSearch(tagsSelectedDisplay(getRecipesDatas()), tagText)
          displayRecipeAfterSelection(tagsSelectedDisplay(getRecipesDatas())) 
        }

        if (recipe.length > 0 && search.value.length !== "") {
          let query = search.value
          let allRecipes = getAllRecipesSelectedWithInput(titles, ingredients, descriptions, query)
          let filteredDatas = recipesDatas.filter( recipe => allRecipes.includes(recipe.id))

          tagsAndSearchFilteredDisplay(colorTag, filteredDatas, tagsSearchArray)
        }
      })

    }

    if(e.target.classList.contains("fa-times-circle") || e.target.classList.contains("btn-tag")) {      
      if(tagsSearchDataset.getAttribute("data-tags") === "" && search.value === "") {
        tagsSelectedDisplay(getRecipesDatas())
        .then( recipe => {
          updateTagsListWithSearch(recipe)
        })
        displayRecipesWithTagsSelected(getRecipesDatas())
      }

      if(tagsSearchDataset.getAttribute("data-tags") !== "" && search.value === "") {
        tagsSelectedDisplay(getRecipesDatas())
        .then( recipe => {
          updateTagsListWithSearch(recipe)
        })
      
        let ingredientsFiltered = recipesDatas.filter(recipe => recipe.ingredients.some( ingredient => tagsSearchArray.includes(ingredient.ingredient.toLowerCase())))
        let appliancesFiltered = recipesDatas.filter(recipe => tagsSearchArray.includes(recipe.appliance.toLowerCase()))        
        let ustensilsFiltered = recipesDatas.filter(recipe => recipe.ustensils.some( ustensil => tagsSearchArray.includes(ustensil.toLowerCase())))
        let fullList = ingredientsFiltered.concat(appliancesFiltered, ustensilsFiltered)
        let fullListWithoutDouble = [...new Set(fullList)]

        if(fullListWithoutDouble.length === 0) {
          noRecipesFoundDisplay()
        } else {
          displayRecipesWithTagsSelected(fullListWithoutDouble)
        }
      }
    }
  })
}

/**
 * Les recettes sont filtrées avec la recherche, les tags et ensuite on affiche le résultat
 * @param {*} colorTag 
 * @param {*} filteredDatas 
 * @param {*} tagsSearchArray 
 */
function tagsAndSearchFilteredDisplay(colorTag, filteredDatas, tagsSearchArray) {
  let recipeFilteredWithTag = []
  let tagFilter = false
  
  if(colorTag === "ingredients") {
    if(tagFilter) {
      recipeFilteredWithTag = recipeFilteredWithTag.filter(recipe => recipe.ingredients.some( ingredient => tagsSearchArray.includes(ingredient.ingredient.toLowerCase())))
    } else {
      recipeFilteredWithTag = filteredDatas.filter(recipe => recipe.ingredients.some( ingredient => tagsSearchArray.includes(ingredient.ingredient.toLowerCase())))
      tagFilter = true
    }
  }
  
  if(colorTag === "appliances") {
    if(tagFilter) {              
      recipeFilteredWithTag = recipeFilteredWithTag.filter(recipe => tagsSearchArray.includes(recipe.appliance.toLowerCase()))
    } else {
      recipeFilteredWithTag = filteredDatas.filter(recipe => tagsSearchArray.includes(recipe.appliance.toLowerCase()))
      tagFilter = true
    }
  }
  
  if(colorTag === "ustensils") {
    if(tagFilter) {
      recipeFilteredWithTag = recipeFilteredWithTag.filter(recipe => recipe.ustensils.some( ustensil => tagsSearchArray.includes(ustensil.toLowerCase())))
    } else {
      recipeFilteredWithTag = filteredDatas.filter(recipe => recipe.ustensils.some( ustensil => tagsSearchArray.includes(ustensil.toLowerCase())))
      tagFilter = true
    }
  }

  displayRecipesWithTagsSelected(recipeFilteredWithTag)
}

/**
* Effacer les tags de la liste des selectionnés
*/
async function removeBtnTag() {
  document.addEventListener("click", (e)=> {
    if(e.target.classList.contains("btn-tag")){    
      const tagSelectedText = e.target.textContent.toLowerCase()
      const allTagsListSearch = document.querySelectorAll(".tag")
      const tagsSearch = document.querySelector(".tags-search")
      const tagsSearchText = tagsSearch.dataset.tags      
      const index = tagsSearchArray.indexOf(tagSelectedText)
      const tagWrapper = document.querySelector(".tags-selected")
      
      tagsSearchArray = tagsSearchText.toLowerCase().split(",")
      tagsSearchArray.splice(index, 1)
      tagsSearch.dataset.tags = [tagsSearchArray] 
      tagWrapper.dataset.addedRemoved = "removed"     

      for (let tag of allTagsListSearch) {
        if(tagSelectedText === tag.textContent.toLowerCase()) {
          tag.style.display = "block"
        }
      }

      e.target.remove()
    }

    if(e.target.classList.contains("fa-times-circle")) {
      const btnClose = e.target
      const tagSelectedText = btnClose.parentNode.textContent.toLowerCase()
      const allTagsListSearch = document.querySelectorAll(".tag")
      const tagsSearch = document.querySelector(".tags-search")
      const tagsSearchText = tagsSearch.dataset.tags      
      const index = tagsSearchArray.indexOf(tagSelectedText)
      const tagWrapper = document.querySelector(".tags-selected")
            
      tagsSearchArray = tagsSearchText.toLowerCase().split(",")
      tagsSearchArray.splice(index, 1)
      tagsSearch.dataset.tags = [tagsSearchArray] 
      tagWrapper.dataset.addedRemoved= "removed"     
      
      for (let tag of allTagsListSearch) {
        if(tagSelectedText === tag.textContent.toLowerCase()) {
          tag.style.display = "block"        
        }
      }   
      e.target.parentNode.remove()
    }
  })
}

function initSearch() {
  searchTags(getIngredientList(), "input-ingredient", ".list-ingredients")
  searchTags(getApplianceOrUstensils("appliance"), "input-appliance", ".list-appliances")
  searchTags(getApplianceOrUstensils("ustensils"), "input-ustensils", ".list-ustensils")
  window.onload = displayTagsSelected()
  window.onload = removeBtnTag()  
}

initSearch()

export { searchTags, displayTagsSelected, getDatasFromMainRecipes, updateTagsListWithSearch, getAllRecipesSelectedWithInput, displayRecipesWithTagsSelected, getRecipesDatas, noRecipesFoundDisplay }
