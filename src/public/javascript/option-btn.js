$(".getId").on("click", (e) => {
    let num = null;
    let id = e.target.getAttribute("id");

    num = id.slice(3);
    menu = "#menu" + num;
    $(menu).addClass("dropActive");
    
    let height = $(document).height();
    let width = $(document).width();
    $(".noOneD").height(height);
    $(".noOneD").width(width);
});

$(".noOneD button").on("click", () => {
    $(".getId").removeClass("dropActive");
    $(".noOneD").height(0);
    $(".noOneD").width(0);
})