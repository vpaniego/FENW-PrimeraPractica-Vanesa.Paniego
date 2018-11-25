const urlApi = "http://fenw.etsisi.upm.es:5555";
const ajaxAsync = true;
const ajaxDataType = "json";

const locationSPA = '/SPA/';

const tokenKey = "authToken";

$(function () {
    hideComponentsNavBar();
    loadHome();
    $('#idLogin').click(loadLogin);
    $('#idRegistro').click(loadRegistro);
    $('#idReservar').click(loadReservar);
    $('#idInstalaciones').click(loadInstalaciones);
    $('#idServicios').click(loadServicios);
    $('#idLogout').click(logout);
});

function hideComponentsNavBar() {
    $('#idReservar').hide();
    $('#idMenuLogout').hide();
}

function hideLoginAlert() {
    $('#alertaErrorLogin').hide();
    $('#alertaErrorVerificacionLogin').hide();
}

function showLoginAlertUsuario() {
    $('#alertaErrorLogin').show();
}

function showLoginAlertAuthentication() {
    $('#alertaErrorVerificacionLogin').show();
}

function toggleComponentsNavBar() {
    if (getToken(tokenKey)) {
        $('#idReservar').toggle();
        $('#idMenuLogout').toggle();
        $('#idLogin').toggle();
    }
}

function successLogin(username) {
    console.log("Usuario" + username + " logado correctamente");
    $('a[class=dropdown-toggle]').text(username).append($('<span></span>').addClass("caret"));
    hideLoginAlert();
    loadHome();
}

function errorLoginUser() {
    console.log("Usuario no logado");
    showLoginAlertUsuario();
    toggleComponentsNavBar();
}

function errorLoginAuthentication() {
    console.log("Authentication login no verificada");
    showLoginAlertAuthentication();
    toggleComponentsNavBar();
}

function redirectToIndex() {
    $(location).attr('href', 'index.html');
}

function loadHome() {
    loadComponent('home.html');
    toggleComponentsNavBar();
}

function loadServicios() {
    loadComponent('servicios.html');
}

function loadInstalaciones() {
    loadComponent('instalaciones.html');
}

function loadReservar() {
    let myToken = getToken(tokenKey);
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
            hideLoginAlert();
            $('#loginForm').submit(function (event) {
                event.preventDefault();
                var operacion = "/users/login";
                var username = $('#inputUsername').val();
                var password = $('#inputPassword').val();
                var urlLogin = urlApi + operacion + "?username=" + username + "&password=" + password;
                $.ajax({
                    url: urlLogin,
                    type: "GET",
                    async: ajaxAsync,
                    dataType: ajaxDataType
                })
                    .done(function (response, textStatus, xhr) {
                        if (treatToken(response, xhr)) {
                            successLogin(username);
                        } else {
                            errorLoginAuthentication();
                        }
                    })
                    .fail(function (error) {
                        errorLoginUser();
                    });
            });
        }
        if (statusTxt == "error") {
            console.log("Error: " + xhr.status + ": " + xhr.statusText);
        }
    });
}

function treatToken(response, xhr) {
    let verificado = true;
    let auth = xhr.getResponseHeader('Authorization');
    if (auth === response) {
        saveToken(tokenKey, auth);
        console.log('Token verificado');
    } else {
        console.log('Token no verificado');
        verificado = false;
    }
    return verificado;
}

function loadComponent(url) {
    $('.content').load(url);
    history.pushState(null, '', locationSPA + url);
}

function logout() {
    deleteToken(tokenKey);
    redirectToIndex();
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

