$(".getId").on("click", (e) => {
    let num = null;
    let id = e.target.getAttribute("id");

    num = id.split('n')[1];
    menu = "#menu" + num;
    $(menu).addClass("dropActive");
    
    
});

$(".noOneD button").on("click", () => {
    $(".getId").removeClass("dropActive");
    $(".noOneD").height(0);
    $(".noOneD").width(0);
})