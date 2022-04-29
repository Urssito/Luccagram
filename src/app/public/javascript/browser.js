let search = $('#search');
let results = $('#searchResults');


function showResult(str){
  console.log(str.length)
  if(str.length == 0){
    results.html('');
  }else{
    results.html('');
  }

  $.ajax({
    url:'/',
    contentType: 'application/json',
    type: 'post',
    data: JSON.stringify({query: str}),
    success: (result) => {
      console.log(result)
      results.html(result.response);
    }
  });
}

$(document).on('click',function(e){
  if(e.target != results || e.target != search){
    results.html('');
  }
});