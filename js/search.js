import { getIngredientList, selectListIngredients, getApplianceOrUstensils } from "./main.js"

async function searchTags(datasList, inputTag, listTag) {
  const datas = await datasList
  const input = document.getElementById(inputTag)
  
  let newDatas = []
  
  function getDatasToLowerCase() {
    let tab = []
    for (const data of datas) {
      tab.push(data.toLowerCase())
    }
    return tab
  }
  
  input?.addEventListener("input", (e) => {
    const datas = getDatasToLowerCase()
    const query = e.target.value
    newDatas = datas.filter((data) => data.includes(query))

    selectListIngredients(newDatas, listTag)
  })
}

function initSearch() {
  searchTags(getIngredientList(), "input-ingredient", ".list-ingredients")
  searchTags(getApplianceOrUstensils("appliance"), "input-appliance", ".list-appliance")
  searchTags(getApplianceOrUstensils("ustensils"), "input-ustensils", ".list-ustensils")
}



initSearch()

export { searchTags }
