function openTagsSearch () {
  const btnTag = document.querySelectorAll(".btn-tags")
  btnTag.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const btnNoActive = document.querySelectorAll(".no-active")
      btnNoActive?.forEach((btn) => {
        if(btn.classList.contains("no-active")) {
          btn.classList.remove("no-active")
        }
      })

      const btn = document.querySelectorAll(".input-list")
      btn.forEach((nope) => nope.style.display = "none")
      e.target.classList.add("no-active")
      e.target.nextElementSibling ? e.target.nextElementSibling.style.display = "block": ""       
    })
  })

  const inputs = document.querySelectorAll(".input-search")
  inputs.forEach((input) => input.addEventListener("click", (e) => {
    e.target.parentNode.style.display = "block"
  }))
}

function closeTagsSearch() {
  document.addEventListener("click", (e) => {
    if(e.target.localName !== "button" && e.target.localName !== "input" && e.target.localName !== "a"){
      const btnNoActive = document.querySelectorAll(".no-active")
      btnNoActive?.forEach((btn) => {
        if(btn.classList.contains("no-active")) {
          btn.classList.remove("no-active")
        }
      })

      const inputList = document.querySelectorAll(".input-list")
      inputList.forEach((list) => list.style.display = "none")
    }
  })
}

export { openTagsSearch, closeTagsSearch }