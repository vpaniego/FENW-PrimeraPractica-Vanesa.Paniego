$(document).ready(function () {

    $('#alertaErrorLogin').hide();
    $('#successLogin').hide();
    $('#idReservar').hide();

    $('#idLogin').click(function () {
        $('.content').load('login.html');
        $('#alertaErrorLogin').hide();
        $('#successLogin').hide();
        $('#idReservar').hide();
    });

    $('#idRegistro').click(function () {
        $('.content').load('registro.html');
    });

    $('#idReservar').click(function () {
        let usuarioLogado = sessionStorage.getItem("datalogin");
        alert(usuarioLogado);
        if(usuarioLogado){
            $('.content').load('reservar.html');
        }
    });

    $('#idInstalaciones').click(function () {
        $('.content').load('instalaciones.html');
    });

    $('#idServicios').click(function () {
        $('.content').load('servicios.html');
    });

    $('#loginForm').submit(function (event) {
        event.preventDefault();
        var url = "http://fenw.etsisi.upm.es:5555/users/login";
        var username = $('#inputUsername').val();
        var password = $('#inputPassword').val();
        url = url + "?username=" + username + "&password=" + password;

        $.ajax({
            url: url,
            type: "GET",
            async: true,
            dataType: "json"
        })
            .done(function (data) {
                console.log("Usuario logado correctamente");
                sessionStorage.setItem("datalogin", data);
                $('#alertaErrorLogin').hide();
                $('#successLogin').show();
                $('#idReservar').show();

            })
            .fail(function (data) {
                console.log("Usuario no logado");
                $('#alertaErrorLogin').show();
                $('#successLogin').hide();
            });
    });


});