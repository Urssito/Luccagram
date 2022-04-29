function likeCheckPost(user, i, pubID){
    

    const like = document.getElementById(`likeBtn${i}`).checked;

    $.ajax({
        type: 'post',
        url: '/api/Home',
        contentType: 'application/json',
        data: JSON.stringify({user: user,pubID: pubID, value: like}),
        success: function(result){
            $("#likeText"+i).text('');
            $("#likeText"+i).text(result.totalLikes);
        }
    });
    const icon = $('#heart-icon'+i);

    if(like){
        icon.html('favorite');
        icon.prop('style','color:#d11;')
    }else{
        icon.html('favorite_border');
        icon.prop('style','color:rgba(0,0,0,.5)');
    }
}

function onLoadCheck(){

    let likeBox = $('.likeBtn');

    for(let i=0;i<likeBox.length;i++){
        const input = $(`#likeBtn${i}`);
        const icon = $(`#heart-icon${i}`);

        if(input.is(':checked')){
            icon.html('favorite');
            icon.prop('style','color:#d11;')
        }
    }
}