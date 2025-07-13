function logout(){
    sessionStorage.removeItem("aproved");
    window.location.href="loggin.html";
}

function menu(){
    const menuImg=document.getElementById("menuLateral");
    const menuHamb = document.getElementById("sideNav");
    
    menuHamb.classList.toggle("active");
    
    if (menuHamb.classList.contains("active")) {
        menuImg.textContent = "X";
    } else {
        menuImg.textContent = "≡";
    }

}
