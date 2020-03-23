function findAncestor(el, sel) {
  while ((el = el.parentElement) && !(el.matches || el.matchesSelector).call(el, sel));
  return el;
}

function onToggleMenu(event) {
  var menu = findAncestor(event.target, ".footer-menu");
  menu.classList.toggle("footer-menu--opened");
}

function onPopupOpen() {
  document.querySelector(".modal").classList.add("modal--opened");
}

function onPopupClose() {
  document.querySelector(".modal").classList.remove("modal--opened");
}

window.onload = function() {
  var switches = document.querySelectorAll(".footer-menu__switch");
  var modalOpenButton = document.querySelector(".contacts__button");
  var modalCloseButton = document.querySelector(".modal__close");

  switches.forEach(function(switchButton) {
    switchButton.addEventListener("click", onToggleMenu);
  });

  modalOpenButton.addEventListener("click", onPopupOpen);
  modalCloseButton.addEventListener("click", onPopupClose);
};
