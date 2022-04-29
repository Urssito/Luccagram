$(".textarea").each(function () {

    if(document.querySelector('textarea').value.length != 0){

      $('#sbmtNewPub').removeAttr('disabled')

    } 
    this.setAttribute("style", "height:" + (this.scrollHeight) + "px;overflow-y:hidden;");
  
  }).on('input click', function () {

    if(document.querySelector('textarea').value.length != 0){
      $('#sbmtNewPub').removeAttr('disabled')
    }else{
      $('#sbmtNewPub').attr('disabled','')
    }

    this.style.height = "auto";
    this.style.height = (this.scrollHeight) + "px";

    let height =  this.style.height.toString().split('p')[0];
    height = parseInt(height) + 36;
    console.log(this.scrollHeight)

    $('#new-pub').css('height', height.toString() + 'px');
    $('#header-new-pub').css('height', this.style.height);
  });

  window.addEventListener('DOMContentLoaded', (e)=> {
    $('.emoji-picker').on('click', function(){
      if(document.querySelector('textarea').value.length != 0){
        $('#sbmtNewPub').removeAttr('disabled');
      }else{
        $('#sbmtNewPub').attr('disabled','')
      }
    })
  })