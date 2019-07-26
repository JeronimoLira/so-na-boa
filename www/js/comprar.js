$(document).ready(function () {
    var compras = document.querySelectorAll('.comprar');

    compras.forEach(function (item) {
        item.addEventListener("click", function () {

            //console.log('comprar.js - 04');
            var rest = window.localStorage.getItem('rest');
            var servidor = window.localStorage.getItem('servidor');
            var idUsuario = window.localStorage.getItem('usuarioId');
            var pedido = window.localStorage.getItem('pedido');
            var mesa = window.localStorage.getItem('mesa');
            //console.log("comprar.js - var mesa = window.localStorage.getItem('mesa');" + mesa);

            var mesaDestino = window.sessionStorage.getItem('mesaDestino');

            //console.log('comprar.js - mesaDestino: '+mesaDestino);

            if (mesaDestino == undefined || mesaDestino == null || mesaDestino == 0) {
                var mesa = window.localStorage.getItem('mesa');
            } else {
                mesa = mesaDestino;
            }

            //console.log("comprar.js - Estamos no Comprar: ");
            var compra = this.id;
            var pedido = '0';

            //console.log('comprar.js - mesa: '+mesa);

            //console.log("comprar.js - Item: "+document.querySelector(".comprar").id);

            if (window.localStorage.getItem('pedido') == 'undefined'
                || window.localStorage.getItem('pedido') === undefined
                || window.localStorage.getItem('pedido') == null)
                pedido = '0';
            else
                pedido = window.localStorage.getItem('pedido');

            //console.log("comprar.js - Pedido: " + pedido);

            function onPrompt(value) {

                // Valida quantidade
                if (parseInt(value) > 0) {

                    qtdPedido = value;

                    $.post(servidor + 'compra.php', {
                        usuario: idUsuario,
                        id: compra,
                        rest: rest,
                        pedido: pedido,
                        qtde: qtdPedido,
                        mesa: mesa
                    }, function () {
                    })
                        .done(function (data) {
                            //toastr.success('Pedido realizado com sucesso!', 'Só na Boa');
                            // alertaNativo('Pedido realizado com sucesso!',"Sucesso","OK");
                            alert('Pedido realizado com sucesso!');
                            meusPedidos(pedido, rest, idUsuario);
                            retornaTotal();

                            //console.log('if(mesaDestino != 0) '+mesaDestino);
                            if (mesaDestino != 0) {
                                var msg = "<img src='" + servidor + "uploads/usuarios/drink-real.png' alt=''>";
                                var para = window.localStorage.getItem('dados', id);

                                $.post(servidor + 'chat.php', {
                                    id: id,
                                    para: para,
                                    acao: 'envia',
                                    msg: msg,
                                    serv: servidor
                                }, function () {
                                    $('#chat-enviar textarea').val('');
                                })
                                    .done(function (data) {
                                        $('#content').load('chat.html');
                                    });
                            }
                        });
                }
            }

            alertify.prompt('Quantidade', 'Por favor diga a quantidade', '',
                function (evt, value) {
                    onPrompt(value)
                },
                function () {
                }
            ).set('labels', {ok: 'Confirmar', cancel: 'Cancelar'})
            .set("type","number");

        });
    });
});	
	  