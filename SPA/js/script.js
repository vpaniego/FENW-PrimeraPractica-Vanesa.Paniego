function hideComponentsNavBarAlert() {
    $('#alertaErrorLogin').hide();
    $('#successLogin').hide();
    $('#idReservar').hide();
    $('#idLogout').hide();
}

function doneLoginHideShowNavBarAlert() {
    $('#alertaErrorLogin').hide();
    $('#idLogin').hide();
    $('#successLogin').show();
    $('#idReservar').show();
    $('#idLogout').show();
}

function logoutHideShowNavBarAlert() {
    $('#idLogin').show();
    $('#idLogout').hide();
    $('#idReservar').hide();
}

function failHideShowAlerts(){
    $('#alertaErrorLogin').show();
    $('#successLogin').hide();
}

$(document).ready(function () {

    hideComponentsNavBarAlert();

    $('#idLogin').click(function () {
        $('.content').load('login.html');

        hideComponentsNavBarAlert();

    });

    $('#idRegistro').click(function () {
        $('.content').load('registro.html');
    });

    $('#idReservar').click(function () {
        let usuarioLogado = sessionStorage.getItem("datalogin");
        if (usuarioLogado) {
            $('.content').load('reservar.html');
        }
    });

    $('#idInstalaciones').click(function () {
        $('.content').load('instalaciones.html');
    });

    $('#idServicios').click(function () {
        $('.content').load('servicios.html');
    });

    $('#idLogout').click(function () {
        sessionStorage.removeItem("datalogin");
        logoutHideShowNavBarAlert();
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
            .done(function (data, textStatus, xhr) {
                console.log("Usuario logado correctamente");
                var auth = xhr.getResponseHeader('Authorization');
                sessionStorage.setItem("datalogin", auth);
                doneLoginHideShowNavBarAlert();
            })
            .fail(function (data) {
                console.log("Usuario no logado");
                failHideShowAlerts();
            });
    });

    $('#registryForm').submit(function (event) {
        // Comprobacion para evitar Spam en el envio del formulario de registro
        var controlSpam = $('#nospam').val();
        if (controlSpam) {
            console.log("El campo de control de spam está vacío. Se realiza el envío del formulario de registro de usuario");

            //TODO: POST /users

        } else {
            console.log("El campo de control de spam no está vacío. Es un spam bot!!!");
        }
    });

});

