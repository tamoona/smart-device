var ESC_KEY_NUMBER = 27;

function findAncestor(el, sel) {
  while ((el = el.parentElement) && !(el.matches || el.matchesSelector).call(el, sel));
  return el;
}

function onLinkClick(event, target) {
  var distanceToTop = function(el) {
    return Math.floor(el.getBoundingClientRect().top);
  };
  event.preventDefault();
  var targetID = target ? target.getAttribute("href") : this.getAttribute("href");
  var targetAnchor = document.querySelector(targetID);
  if (!targetAnchor) return;
  var originalTop = distanceToTop(targetAnchor);
  window.scrollBy({ top: originalTop, left: 0, behavior: "smooth" });
  var checkIfDone = setInterval(function() {
    var atBottom = window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 2;
    if (distanceToTop(targetAnchor) === 0 || atBottom) {
      targetAnchor.tabIndex = "-1";
      targetAnchor.focus();
      window.history.pushState("", "", targetID);
      clearInterval(checkIfDone);
    }
  }, 100);
}

function onToggleMenu(event) {
  var menu = findAncestor(event.target, ".footer-menu");
  menu.classList.toggle("footer-menu--opened");
}

function onModalOpen() {
  document.querySelector(".modal").classList.add("modal--opened");
}

function onModalClose() {
  document.querySelector(".modal").classList.remove("modal--opened");
}

function onPhoneInput(e) {
  var match = e.target.value.replace(/\D/g, "").match(/(?:7)(\d{0,3})(\d{0,7})/);
  var result = !match[2] ? match[1] : match[1] + ") " + match[2] + (match[3] ? match[3] : "");
  e.target.value = "+7 (" + result;
}

function onPhoneFocus(e) {
  e.target.value = e.target.value || "+7 (";
}

function onModalKeydown(e) {
  if (e.keyCode === ESC_KEY_NUMBER) {
    onModalClose();
  }
}

function onModalBackdropClick(e) {
  if (e.target.classList.contains("modal")) {
    onModalClose();
  }
}

window.onload = function() {
  var switches = document.querySelectorAll(".footer-menu__switch");
  var modalOpenButton = document.querySelector(".contacts__button");
  var modalCloseButton = document.querySelector(".modal__close");
  var modal = document.querySelector(".modal");
  var links = document.querySelectorAll("a[href^='#']");
  var phoneInputs = document.querySelectorAll(".field--phone");

  switches.forEach(function(switchButton) {
    switchButton.addEventListener("click", onToggleMenu);
  });

  links.forEach(function(link) {
    link.addEventListener("click", onLinkClick);
  });

  phoneInputs.forEach(function(phoneInput) {
    phoneInput.addEventListener("input", onPhoneInput);
    phoneInput.addEventListener("focus", onPhoneFocus);
  });

  window.addEventListener("keydown", onModalKeydown);
  modalOpenButton.addEventListener("click", onModalOpen);
  modalCloseButton.addEventListener("click", onModalClose);
  modal.addEventListener("click", onModalBackdropClick);
};
