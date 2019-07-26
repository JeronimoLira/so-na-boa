var validaSend = 0;
var id = window.localStorage.getItem('usuarioId');
var servidor = window.localStorage.getItem('servidor');
var rest = window.localStorage.getItem('rest');
var restNome = window.localStorage.getItem('restNome');
var restImg = window.localStorage.getItem('restImg');
var restPapelDeParede = window.localStorage.getItem('restPapelDeParede');

logado = window.localStorage.getItem('logado');
var dia = new Date();
var idcutucahome = '';

$('#home-header div span').text(diasemana());
$('#home-header div h2').text('Dia ' + dia.getDate());

$.post(servidor + 'home.php', {id: id}).done(function (data) {
    console.log(data);
    usuario = JSON.parse(data);

    var temp = $('#home-header h1').text();
    var nomeTela = '';
    var saudacao = '';

    // Saudação Bom dia/tarde/noite
    d = new Date;
    hour = d.getHours();

    //Flávio -> Acertada a saudação baseando-se no horário:
    if ((hour > 17) && (hour <= 23)){
        saudacao = "Boa noite";
    } else if((hour >= 12) && (hour <= 17)){
        saudacao = "Boa tarde";
    } else {
        saudacao = "Bom dia";
    }

    /*if (hour < 5) {
        saudacao = "Boa Noite";
    }
    else if (hour < 8) {
        saudacao = "Bom Dia";
    }
    else if (hour < 12) {
        saudacao = "Bom Dia!";
    }
    else if (hour < 18) {
        saudacao = "Boa tarde";
    }
    else {
        saudacao = "Boa noite";
    }*/

    var temp = $('#home-header h1').text();
    if (saudacao.length > 0) {
        $('#home-header h1').text(temp.replace('#SAUDACAO#', saudacao));
    } else {
        $('#home-header h1').text(temp.replace('#SAUDACAO#', "Boa ???"));
    }

    nomeTela = usuario.usr_nome;

    var temp = $('#home-header h1').text();
    $('#home-header h1').text(temp.replace('#NOME#', nomeTela));

    var temp = $('#home-header h1').text();
    if (restNome != null && restNome != undefined && restNome.length > 0) {
        $('#home-header h1').text(temp.replace('#LOCAL#', restNome));
    }
    else {
        $('#home-header h1').text(temp.replace('#LOCAL#', 'Só na Boa!'));
    }

    //$("#img").attr('src',servidor + "uploads/restaurantes/" + restImg);
    //console.log("home.html - restImg: "+restImg);
    $(".img-p").attr("src", servidor + "/uploads/usuarios/" + usuario.usr_foto);
    $("#div-logo-restaurante").attr('style', 'background-image:url(' + servidor + "uploads/restaurantes/" + restImg + ')');

    $.ajax({
        type:'POST',
        url: servidor + '\/CtrlImagem.php',
        data:{
            usuario:id,
            op:1
        }
    })
    .done(function(data){
        // var ft = new FileTransfer();
        // var uri = servidor + '\/upload\/usuario\/' + data;
        if(data == ''){
            data = 'sem-imagem.png';
        }
        $('.img-p').attr('src',servidor + 'uploads\/usuarios\/' + data);
    })
    .fail(function(jqXHR,textStatus,errorThrown){
        alert(errorThrown);
    })


    if (restPapelDeParede != 0) {
        // Localiza o elemento
        document.body.style.background = "url(" + servidor + "uploads/restaurantes/" + restPapelDeParede + ") no-repeat center fixed";
        document.body.style.backgroundSize = "100% 100%";
        /*
        document.getElementById("bg").style.WebkitBackgroundSize="cover";
        document.getElementById("bg").style.MozBackgroundSize="cover";
        document.getElementById("bg").style.OBackgroundSize="cover";
        document.getElementById("bg").style.backgroundSize="cover";
        */
        document.getElementById("bg").style.fontFamily = "HelveticaNeue-Light, HelveticaNeue, Helvetica, Arial, sans-serif";
        document.getElementById("bg").style.fontSize = "12px";
        document.getElementById("bg").style.height = "100%";
        document.getElementById("bg").style.margin = "0px";
        document.getElementById("bg").style.padding = "0px";
        document.getElementById("bg").style.textTransform = "uppercase";
        document.getElementById("bg").style.width = "100%";
    }
});

function setFotoUsuario(element,id){

    $.ajax({
        type:'POST',
        url: servidor + '\/CtrlImagem.php',
        data:{
            usuario:id,
            op:1
        }
    })
    .done(function(data){
        // var ft = new FileTransfer();
        // var uri = servidor + '\/upload\/usuario\/' + data;
        if(data == ''){
            data = 'sem-imagem.png';
        }
        $(element).attr('src',servidor + 'uploads\/usuarios\/' + data);
    })
    .fail(function(jqXHR,textStatus,errorThrown){
        alert(errorThrown);
    })
}

function verificaUsuariosLogados() {
    $.post(
        servidor + 'home.php',
        {
            id: id,
            rest: rest,
            servidor: servidor
        })
    .done(function (data) {
        $('.call-perfil').parent().remove();
        $('#home-fotos ul li').append(data);

        perfis = document.getElementsByClassName('call-perfil');
        for(var i = 0; i < perfis.length; i++){
            var id = perfis[i].id;
            element = '#' + id;
            setFotoUsuario(element,id);
        }
        // for(var i = 0; i < $('#home-fotos').children().children().children().length; i++){
        //     if(data != $('#home-fotos').children().children().children()[i].children[0].id){
        //         $('#home-fotos ul li').append(data);
        //     }
        // }
    });
    setTimeout('verificaUsuariosLogados()', 30000);
}

$("#home-fotos ul li").on('click', ".call-perfil", function () {
    $('#div-carregando').fadeIn('100');
    var dados = this.id; //????????????????????????
    var dados = window.localStorage.setItem('dados', dados);
    $('#content').load('perfil.html');
});

$(".img-p").on('click', function () {
    $('#div-carregando').fadeIn('100');
    var dados = id;
    var dados = window.localStorage.setItem('dados', dados);
    $('#content').load('perfil.html');
});

$("#home-fotos ul li").on('taphold', ".call-perfil", function () {
    var dados = this.id;

    $.post(servidor + 'chat.php', {id: id, para: dados, acao: 'notificaqtd'}, function () {
    })
        .done(function (data) {
            if (data > 1) {
                $('#content').load('chat.html');
            } else if (data == 0) {
                var txt = "Olá, vamos trocar uma idéia?";
                $.post(servidor + 'chat.php', {id: id, para: dados, acao: 'primeira', msg: txt}, function () {
                })
                    .done(function (data) {
                        alert("Solicitação de Chat enviada!");
                    });
            } else if (data == 1) {
                alert("Aguardando o usuário aceitar sua solicitação de chat!");
            }
        });
});

function diasemana() {
    var hoje = new Date();
    var dia = hoje.getDay();
    var semana = new Array(6);
    semana[0] = 'Domingo';
    semana[1] = 'Segunda';
    semana[2] = 'Terça';
    semana[3] = 'Quarta';
    semana[4] = 'Quinta';
    semana[5] = 'Sexta';
    semana[6] = 'Sábado';

    return semana[dia];
}

//atualiza as notificações no header
function notifica() {
    $.post(servidor + 'chat.php', {
        id: id,
        rest: rest,
        para: 'dados',
        acao: 'notifica',
        msg: ''
    }).done(function (data) {
        console.log('Notifica: ' + data);
        console.log(rest);
        if($.trim(data) != ''){
            $('.notifica').remove();
            $('#notifica').append(data);
        }

        if($('#chat-area').lenght > 0){
            $('.notifica').remove();
        }

        if (typeof data !== 'undefined') {
            if (data.length > 0) {

                // Atualiza listagem chat
                if (typeof carregaLista !== 'undefined') {
                    carregaLista();
                }

                // Atualiza chat
                if (typeof atualiza !== 'undefined') {
                    atualiza();
                    updateScroll();
                }
            }
        }

    });
    setTimeout('notifica()', 5000);
}

//atualiza as notificações no header
function mamtemLogado() {
    $.post(servidor + 'chat.php', {
        id: id,
        rest: rest,
        para: 'dados',
        acao: 'mantemllogado',
        msg: ''
    }).done(function (data) {
    });
    setTimeout('mamtemLogado()', 30000);
}

//Atualiza Contadores
function contadores(tipo) {
    $.post(servidor + 'contadores.php', {id: id, rest: rest, tipo: tipo}).done(function (data) {
        if (tipo == 'online') {
            $('#totalPessoas').html(data);
        }

        if (tipo == 'amigos') {
            $('#totalAmigos').html(data);
        }
    });
    setTimeout('contadores()', 5000);
}

// function setImagemPerfil(){
//     $.ajax({
//         type:'POST',
//         url:'Controllers/CtrlFotos.php', //setar a url que vai retornar a foto do perfil selecionada do usuário;
//         data:{
//             op: 0,
//             id: id,
//             usuario:usuario
//         }
//     })
//     .done(function(data){
//         if(strpos(data,"sucesso") > 0){
//             //Atualiza a foto do perfil
//         }
//         //$('#perfil-exemplo').attr('src',data);
//     })
//     .fail(function(jqXHR,textStatus,errorThrown){
//         alert('Não foi possível mostrar a foto do perfil.\n'+textStatus);
//     })
// }

// function fotoPerfil(){
//     var usuario = window.localStorage.getItem('usuarioId');
//     $.ajax({
//         type:'POST',
//         url: servidor + '\/Controllers\/CtrlFotos.php',
//         data:{
//             op: 1,
//             usuario:usuario
//         }
//     })
//     .done(function(data){
//         $('#perfil-exemplo').attr('src',data);
//     })
//     .fail(function(jqXHR,textStatus,errorThrown){
//         console.log(textStatus);
//     })
// }

// function fotoPerfil(){
//     var usuario = window.localStorage.getItem('usuarioId');
//     $.ajax({
//         type:'POST',
//         url:servidor + '\/CtrlImagem.php',
//         data:{
//             usuario:usuario,
//             op:1
//         }
//     })
//     .done(function(data){

//     })
//     .fail(function(jqXHR,textStatus,errorThrown){
//         console.log(textStatus);
//     })
// }

$(document).ready(function () {
    $('#msg-cutucar-home button').on('click', function () {

        $.post(
            servidor + 'chat.php',
            {
                id: id,
                para: idcutucahome,
                acao: 'notificaqtd'
            },
            function () {
        }).done(function (data) {
            if (data == 0) {
                var txt = $('#msg-cutucar-home textarea').val();
                $.post(servidor + 'chat.php', {
                    id: id,
                    para: idcutucahome,
                    acao: 'primeira',
                    msg: txt
                }, function () {
                }).done(function (data) {
                    $('#msg-cutucar-home').fadeOut('300');
                });
            } else {
                alert("Aguardando solicitação de Chat");
                $('#msg-cutucar-home').fadeOut('300');
            }
        });
    });

    notifica();
    mamtemLogado();
    verificaUsuariosLogados();

    contadores('online');
    contadores('amigos');

    // Direcionar para tour
    var primeiroAcesso = window.localStorage.getItem('primeiroAcesso');
    if (primeiroAcesso == null) {
        escondeRodape(false);
        fixaTela(false);
        $('#content').load('tour.html');
    }
});
