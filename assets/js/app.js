
function loadComponent(url, elementId) {
  fetch(url)
    .then(res => res.text())
    .then(data => {
      document.getElementById(elementId).innerHTML = data;
      setActiveMenu();
    });
}

function setActiveMenu() {
  const currentPage = window.location.pathname.split("/").pop();
  document.querySelectorAll(".nav-links a").forEach(link => {
    if(link.getAttribute("href") === currentPage){
      link.classList.add("active");
    }
  });
}

document.addEventListener("DOMContentLoaded", function(){
  loadComponent("components/header.html", "header");
  loadComponent("components/footer.html", "footer");
});
