$(document).ready(function(){

    $('form').on('submit', function(e){
        e.preventDefault();
        e.stopPropagation();
        Index.post($(this).serialize());
    });

    $('.menu a').click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log($(this).attr('href'));
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top
        },1000);
    });

    Index.map();
    Index.unLoader();

});

Index = {
    onLoader: function(){
        $('#loader').fadeIn();
    },
    unLoader: function(){
        $('#loader').fadeOut();
    },
    post: function( data ){
        Index.onLoader();
        $.ajax({
            url: "contact.php",
            type: 'POST',
            data: data,
            dataType: 'json',
            success: function( data ) {
                Index.unLoader();
                $('form').trigger('reset');
                Index.modal({
                    icon: 'fa-confirm',
                    title: 'Mensagem',
                    html: '<b>Sua mensagem foi enviada com sucesso.</b><br/>Responderemos em breve!',
                    buttons: [{
                        id: 'modal-button-confirm',
                        icon: 'fa-check',
                        title: 'Fechar',
                        action: function(){}
                    }]
                });
            },
            error: function( data ) {
                Index.unLoader();
                Index.modal({
                    icon: 'fa-exclamation-triangle',
                    title: 'Atenção',
                    html: '<b>Não foi possível enviar sua mensagem!</b><br/>Por favor, tente novamente em alguns minutos.',
                    buttons: [{
                        id: 'modal-button-confirm',
                        icon: 'fa-check',
                        title: 'Fechar',
                        action: function(){}
                    }]
                });
            }
        });
    },
    modal: function( data ){
        $('#modal .modal-header h5 i').addClass('fa '+data.icon);
        $('#modal .modal-header h5 span').text(data.title);
        $('#modal .modal-body').html(data.html);
        $('#modal .modal-footer button').remove();
        $.each( data.buttons, function( key, button ){
            $('#modal .modal-footer').append(
                '<button id="' + button.id + '" type="button" class="btn btn-sirius" data-dismiss="modal">' +
                '<i class="fa ' + button.icon + '"></i> ' + button.title +
                '</button>'
            );
            $('#'+button.id).click(button.action);
        });
        $('#modal').unbind('show.bs.modal');
        $('#modal').on('show.bs.modal',function(){
            data.onLoad ? data.onLoad() : null;
        });
        $('#modal').modal('show');
    },
    map: function(){
        var point = { lat: -22.4882741, lng: -43.1776177 };
        var map = new google.maps.Map(document.getElementById('map'),{
            zoom: 16,
            center: point
        });
        var contentString = '<b>ECIN Alumínio e Ferro - Comércio de Aço e Ferro</b><br/>Endereço: Av. Barão do Rio Branco, 1939<br/>Centro, Petrópolis, RJ, 25680-275';
        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });
        var marker = new google.maps.Marker({
            position: point,
            map: map,
            title: 'ECIN Alumínio e Ferro - Comércio de Aço e Ferro'
        });
        marker.addListener('click', function(){
            infowindow.open(map, marker);
        });
        setTimeout(function(){
            new google.maps.event.trigger( marker, 'click' );
        },200);
    }
};