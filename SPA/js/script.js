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
    console.log("Usuario " + username + " logado correctamente");
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
        let doReservar = function (responseTxt, statusTxt, xhr) {
            if (statusTxt == "success") {
                $("#idDatepickerReserva").datepicker($.datepicker.regional["es"]);
            }
            if (statusTxt == "error") {
                console.log("Error: " + xhr.status + ": " + xhr.statusText);
            }
        };

        $('.content').load('reservar.html', doReservar);
    }
}

function loadComponent(url) {
    $('.content').load(url);
    //history.pushState(null, '', locationSPA + url);
}

function loadRegistro() {
    let doRegistro = function (responseTxt, statusTxt, xhr) {
        if (statusTxt == "success") {

            $("#idDatepickerFechaNacimiento").datepicker($.datepicker.regional["es"]);

            let registro = function (event) {
                // Comprobacion para evitar Spam en el envio del formulario de registro
                var controlSpam = $('#nospam').val();
                if (controlSpam) {
                    console.log("El campo de control de spam está vacío. Se realiza el envío del formulario de registro de usuario");

                    //TODO: POST /users

                } else {
                    console.log("El campo de control de spam no está vacío. Es un spam bot!!!");
                }
            };

            $('#registryForm').submit(registro);
        }
        if (statusTxt == "error") {
            console.log("Error: " + xhr.status + ": " + xhr.statusText);
        }
    };
    $('.content').load('registro.html', doRegistro);
}

function logout() {
    deleteToken(tokenKey);
    redirectToIndex();
}

function loadLogin() {
    let doLogin = function (responseTxt, statusTxt, xhr) {
        if (statusTxt == "success") {
            hideLoginAlert();
            let ajaxLogin = function (event) {
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
                        console.log("Status success login " + textStatus);
                        console.log("Response : " + response);

                        var controlSpam = $('#nospam').val();
                        if (controlSpam) {
                            console.log("El campo de control de spam está vacío. Se realiza la petición Login");

                            if (treatToken(response, xhr)) {
                                successLogin(username);
                            } else {
                                errorLoginAuthentication();
                            }
                        } else {
                            console.log("El campo de control de spam no está vacío. Es un spam bot!!!");
                        }
                    })
                    .fail(function (error) {
                        errorLoginUser();
                    });
            };
            $('#loginForm').submit(ajaxLogin);
        }
        if (statusTxt == "error") {
            console.log("Error: " + xhr.status + ": " + xhr.statusText);
        }
    };
    $('.content').load('login.html', doLogin);
}

function treatToken(response, xhr) {
    let verificado = true;
    let auth = xhr.getResponseHeader('Authorization');
    if (auth === response) {
        saveToken(tokenKey, auth);
        console.log('Integridad token verificada');
    } else {
        console.log('Integridad token no verificada');
        verificado = false;
    }
    return verificado;
}

function saveToken(key, value) {
    console.log("Almacenamiento del token en sessionStorage");
    sessionStorage.setItem(key, value);
}

function deleteToken(key) {
    console.log("Eliminación del token de sessionStorage tras logout");
    sessionStorage.removeItem(key);
}

function getToken(key) {
    return sessionStorage.getItem(key);
}