$(document).ready(function () {

    $('#idLogin').click(function () {
        $('.content').load('login.html');
    });

    $('#idRegistro').click(function () {
        $('.content').load('registro.html');
    });

    $('#idReservar').click(function () {
        $('.content').load('reservar.html');
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
        console.log("Prueba url correcta : " + url);

        $.ajax({
            url: url,
            type: "GET",
            async: true,
            dataType: "json"
        })
            .done(function (data) {
                console.log("Usuario logado");
            })
            .fail(function (data) {
                console.log("Usuario no logado");
            });
    });


});