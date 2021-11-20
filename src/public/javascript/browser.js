$("#browser").hide();
$("#inputBrowser").css({"width":"0", "height":"0"});

$(document).on("click",function(e) {
                    
    let BG = $("#browserBG");
    let text = $("#textBrowser");
    let lupa = $("#lupa");
    let input = $('#browser');
    let inputBox = $("#inputBrowser");
                       
       if (BG.is(e.target) || text.is(e.target) || lupa.is(e.target)) { 
         BG.animate({width: "50%", height: "45%"}, 200);
         text.animate({opacity: 0}, 200);
         text.hide();
         lupa.animate({opacity: 0}, 200);
         lupa.hide();
         input.show();
         inputBox.prop("style", "width: 100%")
         input.prop("style", "width: 96%");
         input.focus();
       }
       else if (!(BG.is(e.target) || text.is(e.target) || lupa.is(e.target))){
         BG.animate({width: "25%", height: "36%"}, 200);
         text.show();
         text.animate({opacity: 1}, 200);
         lupa.show();
         lupa.animate({opacity: 1}, 200);
         input.hide();
         inputBox.prop("style", "width: 0")
         input.prop("style", "width: 0");
         input.val("");
       }
});

//<input name='buscador' type="text" id="browser" class="navObject" placeholder="">

