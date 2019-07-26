var id          = window.localStorage.getItem('usuarioId');
var servidor    = window.localStorage.getItem('servidor');
var restaurante = window.localStorage.getItem('rest');

function carregaLista() {
    console.log('Servidor: ' + servidor);
    console.log('Id: ' + id);
    $.post(
        servidor + 'chat.php',
        {
            id:id,
            acao:'lista',
            serv:servidor
        },
        function(){}
    )
    .done(function(data){
        console.log('Resultado: ' + data);
        //alert da função de chat, assim é feito a interface do chat alert(data);
        // console.log(data);
        $('#avisos ul').html(data);
        $('#div-carregando').fadeOut('100');
    });
}

// $(document).ready(function(){
    console.log('Carrega Lista');
    $('#avisos div ul').css('height', '100%');

    carregaLista();

    $('#avisos').on('click','.link-chat', function(){
        var idu = this.id;
        window.localStorage.setItem('dados',idu);

        $('#content').load('chat.html');
    });

    $('#avisos').on('click','.not-sim', function(){
        var not = this.id;
        $.post(servidor + 'chat.php',{id:not,acao:'aceita'}).done(function(data){
            $('.not-sim#' + not + ', .not-nao#' + not).remove();
        });
    });

    $('#avisos').on('click','.not-nao', function(){
        var not = this.id;
        $.post(servidor + 'chat.php',{id:not,acao:'recusa'}).done(function(data){
            // console.log(data);
            $('.link-chat#' + not).remove();
    		return false;
        });
    });

    var atualiza2 = function(){
        var dados = window.localStorage.getItem('dados');

        $.post(servidor + 'chat.php',{id:id,para:dados,acao:'atualiza',msg:'',serv:servidor})
            .done(function(data){
                $('#chat ul').html(data);})
            .done(function(data){
                updateScroll();
            });
    }

    $('#avisos').on('click','.drink-virtual', function(){
        var msg = "<img src='" + servidor + "uploads/usuarios/drink-virtual.png' alt=''>";
        var para = this.id;
        window.localStorage.setItem('dados',id);

        $.post(servidor + 'chat.php',{id:id,para:para,acao:'envia',msg:msg,serv:servidor},function(){
            $('#chat-enviar textarea').val('');})
           .done(function(data){
            atualiza2();
        });
    });

    $('#avisos').on('click','.drink-real', function(){
        var msg = "<img src='" + servidor + "uploads/usuarios/drink-real.png' alt=''>";
        var para = this.id;
        window.localStorage.setItem('dados',id);

        var data = new Date();

        var dia  = data.getDate();           // 1-31
        var mes  = data.getMonth()+1;          // 0-11 (zero=janeiro)
        var ano4 = data.getFullYear();       // 4 dígitos

        var dataInicial = dia+'/'+mes+'/'+ano4;

        //Pegar a mesa da pessoa
        $.post(servidor + 'chat.php',{id:id,para:para,data:dataInicial,rest:restaurante,acao:'retornaMesaDestino',msg:msg,serv:servidor},function(){})
            .done(function(data){
                //console.log(data);

                window.sessionStorage.setItem('mesaDestino',0);

                if (data == 'x1') {
                    alert('Não encontra-se no mesmo estabelecimento');
                } else if (data == 'x2') {
                    alert('Desculpe, pessoa sem mesa selecionada!');
                } else {
                    alert('A pessoa se encontra na mesa: '+data);

                    window.sessionStorage.setItem('mesaDestino',data);

                    $('#content').load('pedidos.html');
                }
        });
    });
// })    