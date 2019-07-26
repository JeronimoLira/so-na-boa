var id = window.localStorage.getItem('usuarioId');
        var servidor = window.localStorage.getItem('servidor');
        var dados = window.localStorage.getItem('dados');
        var nome = window.localStorage.getItem('nome');
        var restauranteChat = window.localStorage.getItem('restNome');

        $("#restaurante-chat").text(restauranteChat);
        $('#chat span b').text(nome);

        //var alt = $(window).height() * 0.70;
        //$('#chat ul').css('height', alt + 'px');

        $(document).ready(function () {
            escondeRodape(true);
            atualiza2();
        });

        function atualiza() {
            //alert('ENTROU ATUALIZAR');
            $.post(servidor + 'chat.php', {
                id: id,
                para: dados,
                acao: 'atualiza',
                msg: '',
                serv: servidor
            })
                .done(function (data) {
                    $('#chat ul').html(data);
                    updateScroll();
                    //console.log('ATUALIZOU');
                })
        }

        $("#btnEnviar").click(function () {
            var msg = $('#chat-enviar textarea').val();

            // Valida preenchimento
            if (msg.length > 1) {

                $.post(servidor + 'chat.php', {
                    id: id,
                    para: dados,
                    acao: 'envia',
                    msg: msg,
                    serv: servidor
                }, function () {
                    $('#chat-enviar textarea').val('');
                })
                    .done(function (data) {
                        atualiza();
                    });
            }
        });

        var scrolled = false;

        function updateScroll() {
            //if(!scrolled){
            $('#chat-area').animate({scrollTop: $('#chat-area').prop('scrollHeight')}, 500)
            //console.log(element.scrollTop);
            //   }
        }

        $("#chat-area").on('scroll', function () {
            scrolled = true;
        });

        // Curtir drink
        function likeDrink(valida = 1, id) {

            var posting = $.post(servidor + 'curtir_drink.php', {
                id: id,
                valida: valida,
                serv: servidor
            });

            posting.done(function (data) {
                atualiza();
            });
        }

        // Curtir drink
        function goDrink(valida = 1, id) {

            var posting = $.post(servidor + 'aceitar_drink.php', {
                id: id,
                valida: valida,
                serv: servidor
            });

            posting.done(function (data) {
                atualiza();
            });
        }
        
        $(document).on("click",".btn-sm",function() {
            $(this).parent().find('.btn-sm').remove();
        });