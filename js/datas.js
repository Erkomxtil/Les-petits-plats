
async function getRecipesDatas() {
	const url = new URL(window.location.href)
	const originUrl = url.origin
	let reponse 

	if (originUrl === "https://erkomxtil.github.io") {
		reponse = await fetch(`${originUrl}/les-petits-plats/js/recipes.json`)
    const recipes = await reponse.json()
    return recipes
	} else {
		reponse = await fetch(`/js/recipes.json`)
    const recipes = await reponse.json()
    return recipes
	}
}

export { getRecipesDatas }

