$(document).ready(function(){
    $('#idLogin').click( function(){        
        $('.content').load('login.html');   
    });
    $('#idRegistro').click( function(){     
        $('.content').load('registro.html');  
    });
    $('#idReservar').click( function(){     
        $('.content').load('reservar.html');  
    });
    $('#idInstalaciones').click( function(){     
        $('.content').load('instalaciones.html');  
    });
    $('#idServicios').click( function(){     
        $('.content').load('servicios.html');  
    });    
});