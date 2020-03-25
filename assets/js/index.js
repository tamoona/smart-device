"use strict";

var ESC_KEY_NUMBER = 27;
var VALID_NUMBER_LENGTH = 11;

var modal = document.querySelector(".modal");
var modalCloseButton = modal.querySelector(".modal__close");
var modalForm = modal.querySelector(".modal__form");
var switches = document.querySelectorAll(".footer-menu__switch");
var modalOpenButton = document.querySelector(".contacts__button");
var links = document.querySelectorAll("a[href^='#']");
var phoneInputs = document.querySelectorAll(".field--phone");
var questionForm = document.querySelector(".question__form");

var findAncestor = function(el, sel) {
  while ((el = el.parentElement) && !(el.matches || el.matchesSelector).call(el, sel));
  return el;
};

var onLinkClick = function(e, target) {
  e.preventDefault();
  var distanceToTop = function(el) {
    return Math.floor(el.getBoundingClientRect().top);
  };
  var targetID = target ? target.getAttribute("href") : this.getAttribute("href");
  var targetAnchor = document.querySelector(targetID);
  if (!targetAnchor) return;
  var originalTop = distanceToTop(targetAnchor);
  window.scrollBy({ top: originalTop, left: 0, behavior: "smooth" });
  var checkIfDone = setInterval(function() {
    var atBottom = window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 2;

    if (distanceToTop(targetAnchor) === 0 || atBottom) {
      window.history.pushState("", "", targetID);
      clearInterval(checkIfDone);
    }
  }, 100);
};

var isPhoneNumberValid = function(number) {
  return number.length === VALID_NUMBER_LENGTH;
};

var onFormSubmit = function(e) {
  e.preventDefault();
  var phoneInput = e.target.querySelector(".field--phone");
  var form = e.target;
  var phone = phoneInput.value.replace(/\D/g, "");
  if (!isPhoneNumberValid(phone)) {
    phoneInput.setCustomValidity("Введите корректный номер телефона, пожалуйста");
    form.reportValidity();
  } else {
    phoneInput.setCustomValidity("");
    form.submit();
  }
};

var closeAccordeon = function() {
  var openTabs = document.querySelectorAll(".footer-menu--opened");
  openTabs.forEach(function(openTab) {
    openTab.classList.remove("footer-menu--opened");
  });
};

var onToggleMenu = function(e) {
  var menu = findAncestor(e.target, ".footer-menu");
  closeAccordeon();
  menu.classList.add("footer-menu--opened");
};

var toggleBodyScroll = function() {
  document.querySelector("body").classList.toggle("no-scroll");
};

var onModalKeydown = function(e) {
  if (e.keyCode === ESC_KEY_NUMBER) {
    onModalClose();
  }
};

var onModalBackdropClick = function(e) {
  if (e.target.classList.contains("modal")) {
    onModalClose();
  }
};

var onModalClose = function() {
  modal.classList.remove("modal--opened");
  toggleBodyScroll();

  modalForm.removeEventListener("submit", onFormSubmit);
  window.removeEventListener("keydown", onModalKeydown);
  modalCloseButton.removeEventListener("click", onModalClose);
  modal.removeEventListener("click", onModalBackdropClick);
};

var onModalOpen = function() {
  modal.classList.add("modal--opened");
  modal.querySelector("input[name='name']").focus();

  modalForm.addEventListener("submit", onFormSubmit);
  toggleBodyScroll();
  window.addEventListener("keydown", onModalKeydown);
  modalCloseButton.addEventListener("click", onModalClose);
  modal.addEventListener("click", onModalBackdropClick);
};

var onPhoneInput = function(e) {
  var phoneField = e.target;
  phoneField.setCustomValidity("");
  var match = phoneField.value.replace(/\D/g, "").match(/(?:7)(\d{0,3})(\d{0,7})/);
  var result = !match[2] ? match[1] : match[1] + ") " + match[2] + (match[3] ? match[3] : "");
  phoneField.value = "+7 (" + result;
};

var onPhoneFocus = function(e) {
  e.target.value = e.target.value || "+7 (";
};

switches.forEach(function(switchButton) {
  switchButton.addEventListener("click", onToggleMenu);
});

links.forEach(function(link) {
  link.addEventListener("click", onLinkClick);
  link.onclick = onLinkClick;
});

phoneInputs.forEach(function(phoneInput) {
  phoneInput.addEventListener("input", onPhoneInput);
  phoneInput.addEventListener("focus", onPhoneFocus);
});

modalOpenButton.addEventListener("click", onModalOpen);
questionForm.addEventListener("submit", onFormSubmit);
