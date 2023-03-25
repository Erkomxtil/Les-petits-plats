import { getRecipesDatas } from "./datas.js"

async function displayRecipe() {
  const recipes = await getRecipesDatas()
  const main = document.querySelector(".recipes-wrapper")

  try {
    recipes.forEach(recipe => {
      const article = document.createElement("article")
      const {id, name, servings, ingredients, time, description, appliance, ustensils} = recipe

      article.dataset.id = id

      const img = document.createElement("img")
      img.src = "images/image-basic-plat.jpg"
      img.alt = "image par défaut"

      const wrapper = document.createElement("div")
      wrapper.classList.add("info-recipe-wrapper")
      
      const titleTitleWrapper = document.createElement("div")
      titleTitleWrapper.classList.add("info-title-time")
      titleTitleWrapper.innerHTML = `
        <h2>${name}</h2>
        <div class="info-time"><strong><i class="fa-regular fa-clock"></i> ${time} min</strong></div>
      `  
      wrapper.appendChild(titleTitleWrapper)  
      
      const ingredientsRecipe = document.createElement("div")
      ingredientsRecipe.classList.add("info-ingredients-recipe")

      const infoIngredients = document.createElement("div")
      const list = document.createElement("ul")
      infoIngredients.classList.add("info-ingredients")
   
      ingredients.forEach( (ingredients) => {
        const infoIngredientsText = document.createElement("li")       
        infoIngredientsText.innerHTML = `
          <strong>${ingredients.ingredient}</strong>${ingredients.quantity ? ": " + ingredients.quantity:""}${ingredients.unit ? ingredients.unit:""}
        `
        list.appendChild(infoIngredientsText)
      }) 
      infoIngredients.appendChild(list)
      ingredientsRecipe.appendChild(infoIngredients)

      const infoRecipe = document.createElement("div")
      infoRecipe.classList.add("info-recipe")
      infoRecipe.innerHTML = `
        <p>${description}</p>
      `
      ingredientsRecipe.appendChild(infoRecipe)

      article.appendChild(img)
      article.appendChild(wrapper)
      article.appendChild(ingredientsRecipe)

      // article.innerHTML= `
      //   <img src="images/image-basic-plat.jpg" alt="Image par défault">
      //   <div class="info-recipe-wrapper">
      //     <div class="info-title-time">
      //       <h2>${name}</h2><div class="info-time"><strong><i class="fa-regular fa-clock"></i> ${time} min</strong></div>
      //     </div>
      //     <div class="info-ingredients-recipe">
      //       <div class="info-ingredients">
      //         <p class="ingredients">

      //         </p>
      //       </div>
      //       <div class="info-recipe">
      //         <p>
      //           ${description}
      //         </p>
      //       </div>
      //     </div>
      //   </div class="info-recipe-wrapper">`
        main.appendChild(article)
    }) 
  } catch (error) {
    console.log(error.message)
  }
}

export { displayRecipe }