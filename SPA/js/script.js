$(function () {

    hideComponentsNavBar();

    $('#idLogin').click(function () {
        $('.content').load('login.html', function (responseTxt, statusTxt, xhr) {
            if (statusTxt == "success") {

                hideComponentsAlert();

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
                        .done(function (response, textStatus, xhr) {
                            console.log("Usuario logado correctamente");

                            var auth = xhr.getResponseHeader('Authorization');

                            sessionStorage.setItem("datalogin", auth);

                            alertSuccessLogin();
                        })
                        .fail(function (error) {
                            console.log("Usuario no logado");

                            alertErrorLogin();
                        });
                });
            }
            if (statusTxt == "error") {
                alert("Error: " + xhr.status + ": " + xhr.statusText);
            }


        });
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

    $('#idLogout').click(logout);

});

function hideComponentsNavBar() {
    $('#idReservar').hide();
    $('#idLogout').hide();
}

function hideComponentsAlert() {
    $('#alertaErrorLogin').hide();
    $('#successLogin').hide();
}

function toggleComponentsNavBar() {
    $('#idReservar').toggle();
    $('#idLogout').toggle();
    $('#idLogin').toggle();
}

function alertSuccessLogin() {
    $('#alertaErrorLogin').hide();
    $('#successLogin').show();
    toggleComponentsNavBar();
}

function alertErrorLogin() {
    $('#alertaErrorLogin').show();
    $('#successLogin').hide();
}

function logout() {
    sessionStorage.removeItem("datalogin");

    toggleComponentsNavBar();
    hideComponentsAlert()
}

