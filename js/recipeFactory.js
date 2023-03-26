/**
 * 
 * @param {*} datas On récupère les données sur les recttes pour les afficher
 */
async function displayRecipe(datas) {
  const recipes = await datas
  
  try {
    const main = document.querySelector(".recipes-wrapper")
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
      main.appendChild(article)
    }) 
  } catch (error) {
    console.log(error.message)
  }
}

export { displayRecipe }