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
function getAllRecipesSelectedWithInput(titles, ingredients, descriptions, appliances, ustensils, query) {
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

  appliances.map( appliance => {
    if (appliance.appliance.toLowerCase().includes(query)) {
      allRecipes.push(appliance.id)
    }
  })

  ustensils.map( ustensil => {
    if(ustensil.ustensils.toLowerCase().includes(query)) {
      allRecipes.push(ustensil.id)
    }
  })

  return allRecipes
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
        "appliance": element.appliance.toLowerCase(),
        "id": element.id
      }
      datas.push(elementData)
    }

    if(dataType === "ustensils") {
      element.ustensils.map(ustensil =>  {
        let elementData = {
          "ustensils": ustensil,
          "id": element.id
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
            const selectedDatas = datas.filter((data) => data?.includes(query))
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
  var allTagListId = [], numb = 0, removeTagList = []
  let compare1 = [], compare2 = []
  const recipesDatas = await getRecipesDatas()
  let titles = await getDatasFromMainRecipes(recipesDatas, "name")
  let ingredients = await getDatasFromMainRecipes(recipesDatas, "ingredients")
  let descriptions = await getDatasFromMainRecipes(recipesDatas, "description")
  let appliances = await getDatasFromMainRecipes(recipesDatas, "appliance")
  let ustensils = await getDatasFromMainRecipes(recipesDatas, "ustensils")
  const search = document.getElementById("search")
  const tagsSearchDataset = document.querySelector(".tags-search")

  /* On ajoute les tags */
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

        /* Recherche juste avec les tags */
        if (recipe.length > 0 && search.value.length === 0 && tagsSearchArray.length > 0) {
          let query = tagText
          let allRecipes = getAllRecipesSelectedWithInput(titles, ingredients, descriptions, appliances, ustensils, query)
          updateTagsListWithSearch(tagsSelectedDisplay(getRecipesDatas()), tagText)
          
          if(numb === 0) {
            for (let number of allRecipes) {
              allTagListId.push(number)
            }
          }
          numb++            
          allTagListId = allTagListId.filter(val => allRecipes.includes(val))
          allTagListId.map(tag => removeTagList.push(tag))
                                        
          if(allTagListId.length === 0) {
            noRecipesFoundDisplay()
          } 
          
          if (tagsSearchArray.length === 1){     
            removeTagList = getAllRecipesSelectedWithInput(titles, ingredients, descriptions, appliances, ustensils, tagsSearchArray[0])
            compare1 = removeTagList
          }

          if (tagsSearchArray.length > 1) {
            for (let query of tagsSearchArray) {              
              compare2 = getAllRecipesSelectedWithInput(titles, ingredients, descriptions, appliances, ustensils, query)
            }
            let intersection = compare1.filter(val => compare2.includes(val))
            compare1 = intersection
          } 

          if(compare1.length === 0) {
            noRecipesFoundDisplay()
          } else {
            let filteredDatas = recipesDatas.filter( recipe => compare1.includes(recipe.id))
            updateTagsListWithSearch(filteredDatas)
            tagsAndSearchFilteredDisplay(colorTag, filteredDatas, tagsSearchArray)                          
          }
        }

        /* Recherche avec les tags et recherche principale */
        if (recipe.length > 0 && search.value.length > 0) {
          if (tagsSearchArray.length === 1){
            let searchTaglist = getAllRecipesSelectedWithInput(titles, ingredients, descriptions, appliances, ustensils, search.value)   
            removeTagList = getAllRecipesSelectedWithInput(titles, ingredients, descriptions, appliances, ustensils, tagsSearchArray[0])
            compare1 = removeTagList.concat(searchTaglist)
          }
          
          if (tagsSearchArray.length > 1) {
            for (let query of tagsSearchArray) {              
              compare2 = getAllRecipesSelectedWithInput(titles, ingredients, descriptions, appliances, ustensils, query)
            }
            let intersection = compare1.filter(val => compare2.includes(val))
            compare1 = intersection
          } 
          
          let filteredDatas = recipesDatas.filter( recipe => compare1.includes(recipe.id))
          updateTagsListWithSearch(filteredDatas)
          tagsAndSearchFilteredDisplay(colorTag, filteredDatas, tagsSearchArray) 
    
        }
      })
    }
     /* On click pour fermer les tags */
    if(e.target.classList.contains("fa-times-circle") || e.target.classList.contains("btn-tag")) { 
      if(tagsSearchArray.length === 0) {
        removeTagList = []
      }
      let colorTag, tagText
      numb--

      if(e.target.classList.contains("fa-times-circle")){
        colorTag = e.target.parentNode.dataset.color
        tagText = e.target.parentNode.textContent.toLowerCase()
      }
      
      if(e.target.classList.contains("btn-tag")) {
        colorTag = e.target.dataset.color 
        tagText = e.target.textContent.toLowerCase()
      }
      if(tagsSearchDataset.getAttribute("data-tags") === "" && search.value === "") {        
        tagsSelectedDisplay(getRecipesDatas())
        .then( recipe => {
          updateTagsListWithSearch(recipe)
        })
        displayRecipesWithTagsSelected(getRecipesDatas())
      }

      if(tagsSearchDataset.getAttribute("data-tags") === "" && search.value !== "") { 
        removeTagList = getAllRecipesSelectedWithInput(titles, ingredients, descriptions, appliances, ustensils, search.value)
        compare1 = removeTagList
        
        let filteredDatas = recipesDatas.filter( recipe => compare1.includes(recipe.id)) 

        updateTagsListWithSearch(filteredDatas)
        displayRecipeAfterSelection(filteredDatas)
      }      

      if(tagsSearchDataset.getAttribute("data-tags") !== "" && search.value === "") { 
        let otherTagToCompare = []
        let intersectionArray = []
        let tagToCompare = getAllRecipesSelectedWithInput(titles, ingredients, descriptions, appliances, ustensils, tagsSearchArray[0])      
        
        if (tagsSearchArray.length === 1){                  
          compare1 = tagToCompare
        }

        if (tagsSearchArray.length > 1) {
          for (let query of tagsSearchArray) {              
            otherTagToCompare.push(getAllRecipesSelectedWithInput(titles, ingredients, descriptions, appliances, ustensils, query))
          }
          
          for (let tag of otherTagToCompare) { 
            intersectionArray.push(tagToCompare.filter( tags => tag.includes(tags)))
          }

          compare1 = intersectionArray[intersectionArray.length-1]

          let filteredDatas = recipesDatas.filter( recipe => compare1.includes(recipe.id))
          updateTagsListWithSearch(filteredDatas)
          tagsAndSearchFilteredDisplay(colorTag, filteredDatas, tagsSearchArray)
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
  var tagListOnly = []
  let tagFilter = false
  
  
  if(colorTag === "ingredients") {
    if(tagFilter) {
      tagListOnly = tagListOnly.filter(recipe => recipe.ingredients.some( ingredient => tagsSearchArray.includes(ingredient.ingredient.toLowerCase())))
    } else {
      tagListOnly = filteredDatas.filter(recipe => recipe.ingredients.some( ingredient => tagsSearchArray.includes(ingredient.ingredient.toLowerCase())))
      tagFilter = true
    }
  }
  
  if(colorTag === "appliances") {
    if(tagFilter) {              
      tagListOnly = tagListOnly.filter(recipe => tagsSearchArray.includes(recipe.appliance.toLowerCase()))
    } else {
      tagListOnly = filteredDatas.filter(recipe => tagsSearchArray.includes(recipe.appliance.toLowerCase()))
      tagFilter = true
    }
  }
  
  if(colorTag === "ustensils") {
    if(tagFilter) {
      tagListOnly = tagListOnly.filter(recipe => recipe.ustensils.some( ustensil => tagsSearchArray.includes(ustensil.toLowerCase())))
    } else {
      tagListOnly = filteredDatas.filter(recipe => recipe.ustensils.some( ustensil => tagsSearchArray.includes(ustensil.toLowerCase())))
      tagFilter = true
    }
  }
  
  displayRecipesWithTagsSelected(tagListOnly)
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
