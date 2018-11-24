var urlApi = "http://fenw.etsisi.upm.es:5555";
var ajaxAsync = true;
var ajaxDataType = "json";

$(function () {
    hideComponentsNavBar();
    $('#idLogin').click(loadLogin);
    $('#idRegistro').click(loadRegistro);
    $('#idReservar').click(loadReservar);
    $('#idInstalaciones').click(loadInstalaciones);
    $('#idServicios').click(loadServicios);
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

function loadInicio() {
    $(location).attr('href', 'index.html');
}

function loadServicios() {
    loadComponent('servicios.html');
}

function loadInstalaciones() {
    loadComponent('instalaciones.html');
}

function loadReservar() {
    let myToken = getToken("datalogin");
    if (myToken) {
        loadComponent('reservar.html');
    }
}

function loadRegistro() {
    $('.content').load('registro.html', function (responseTxt, statusTxt, xhr) {
        if (statusTxt == "success") {
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
        }
        if (statusTxt == "error") {
            alert("Error: " + xhr.status + ": " + xhr.statusText);
        }
    });
}

function loadLogin() {
    $('.content').load('login.html', function (responseTxt, statusTxt, xhr) {
        if (statusTxt == "success") {
            hideComponentsAlert();
            $('#loginForm').submit(function (event) {
                event.preventDefault();
                var operacion = "/users/login";
                var username = $('#inputUsername').val();
                var password = $('#inputPassword').val();
                urlApi = urlApi + operacion + "?username=" + username + "&password=" + password;
                $.ajax({
                    url: urlApi,
                    type: "GET",
                    async: ajaxAsync,
                    dataType: ajaxDataType
                })
                    .done(function (response, textStatus, xhr) {
                        console.log("Usuario logado correctamente");
                        tratarToken(response, xhr);
                        alertSuccessLogin();
                    })
                    .fail(function (error) {
                        console.log("Usuario no logado");
                        alertErrorLogin();
                    });
            });
        }
        if (statusTxt == "error") {
            console.log("Error: " + xhr.status + ": " + xhr.statusText);
        }
    });
}

function tratarToken(response, xhr) {
    let auth = xhr.getResponseHeader('Authorization');
    if (auth === response) {
        saveToken("datalogin", auth);
        console.log('Token verificado');
    } else {
        console.log('Token no verificado')
    }
}

function loadComponent(url) {
    $('.content').load(url);
}

function logout() {
    deleteToken("datalogin");
    toggleComponentsNavBar();
    hideComponentsAlert();
    loadInicio();
}

function saveToken(key, value) {
    sessionStorage.setItem(key, value);
}

function deleteToken(key) {
    sessionStorage.removeItem(key);
}

function getToken(key) {
    return sessionStorage.getItem(key);
}

