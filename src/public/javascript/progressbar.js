let form = $('#formFile');
form.on("submit",() => {
    let inputFile = $("#file");
    let progressBar = $("#progress");
    console.log(inputFile, "\n", progressBar);

    let formData = new FormData();
    formData.append("inputFile", inputFile);
    let ajax = new XMLHttpRequest();
    ajax.upload.addEventListener('progress', function(e){
        while (e.loaded < 100){
            let porcentaje = ( e.loaded / e.total ) * 100;
            console.log(porcentaje);
            progressBar.css('width', porcentaje);
        }
    });

    ajax.open('POST', '../../routes/users.js');
    ajax.send(formData);
});