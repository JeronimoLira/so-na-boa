var id = window.localStorage.getItem('usuarioId');
var servidor = window.localStorage.getItem('servidor');
var dados = window.localStorage.getItem('dados');
var pos = '';
var urlFotoAtualizacao = '';
var usuario;

// $.post(servidor + 'home.php', {id: id}).done(function (data) {
//     usuario = JSON.parse(data);
// }


// $("#img-meu-perfil").attr("src", servidor + "uploads/usuarios/" + USUARIO.usr_foto);
// $('#helper-debug').text($("#img-meu-perfil").attr("src"));

if (id == dados) {
    $('#perfil-fotos').on('click', '.add-img', function () {
        $('#div-carregando').fadeIn('100');
        pos = this.id;
        getImage();
    });
}

//$.post(servidor + 'home.php',{id:dados,acao:'perfil'},function(){
$.post(
    servidor + 'classes/perfil.class.php',
    {
        id: dados,
        acao: 'perfil'
    },
    function () {

    })
.done(function (data) {
    usuario = $.parseJSON(data);
    //usuario = $.parseJSON(data);

    //console.log(usuario);

    if (usuario.u.usr_vip == '0')
        $('#perfil-dados-vip').remove();

    // alert($('#helper-debug').text(usuario.u));
    if(usuario.i.length > 0){
        $('#img-meu-perfil').attr('src',servidor + "uploads/usuarios/" + usuario['i'][0]['img']);
    } else {
        $('#img-meu-perfil').attr('src', "img/perfil-exemplo.png");
    }
    // alert(usuario['i'][0]['img']);
    $('#perfil-dados #nome').text(usuario.u.usr_nome);
    $('#perfil-dados #perfil-frase').text(usuario.u.usr_frase);
    $('#perfil-dados #estado_civil').text(usuario.u.usr_est_civil);
    $('#perfil-dados #idade').text(calcularIdade(usuario.u.usr_aniversario) + ' anos');
    $('#perfil-dados #interesse').text("Tenho interesse em " + usuario.u.usr_interesse);
    $('#perfil-dados #local').text(usuario.u.nome + ' - ' + usuario.u.sigla);
    $('#perfil-dados #genero').text("Eu sou " + usuario.u.usr_sexo);
    // $('body').css('background-image','url('+servidor+"uploads/usuarios/" + usuario.usr_foto+')');
    $('#msg-cutucar h1 span').text(usuario.u.usr_nome);
    $('#msg-cutucar>img').attr('src', servidor + 'uploads/usuarios/' + usuario.u.usr_foto);

    $('#div-carregando').fadeOut('100');

    var html = "";

    var i = 1;
    // Mostrar botão cutucada
    if(id != usuario.u.usr_id) {
        $('#perfil-dados button').removeClass('hidden');
        $('#div-chat-on').removeClass('hidden');
    }

    if (usuario.i.length > 0) {
        for (var a = 0; a < usuario.i.length; a++) {
            //$.each(usuario.i, function() {
            html = html + "<span><img data-nome-imagem='" + usuario['i'][a]['img'] + "'  class='album' id='" + usuario['i'][a]['pos'] + "' src='" + servidor + "uploads/usuarios/" + usuario['i'][a]['img'] + "' alt=''></span>";
            i++;
        }
    }

    if (usuario.i.length < 6) {
        $(".add-img").hide();
    }

    if (id == dados) {
        html = html + "<span><img id='" + i + "' class='add-img' src='img/perfil-exemplo.png' alt=''></span>";
        $(".atualizar-foto").show();

    } else {
        $(".atualizar-foto").hide();
    }
    $('#perfil-fotos').html(html);
});

$.post(servidor + 'contadores.php', {id: dados, tipo: 'estrela'}, function () {

}).done(function (data) {
    if (data == 5) {
        $("#perfil-estrelas").html("<img src='img/5-estrelas.png' alt=''>");
    } else if (data == 4) {
        $("#perfil-estrelas").html("<img src='img/4-estrelas.png' alt=''>");
    } else if (data == 3) {
        $("#perfil-estrelas").html("<img src='img/3-estrelas.png' alt=''>");
    } else if (data == 2) {
        $("#perfil-estrelas").html("<img src='img/2-estrelas.png' alt=''>");
    } else if (data == 1) {
        $("#perfil-estrelas").html("<img src='img/1-estrela.png' alt=''>");
    }
});

$('#perfil-amigos').on('click', '.chat', function () {
    window.localStorage.setItem('dados', dados);
    $('#content').load('chat.html');
});

$('#btton-chat').on('click', function () {
    window.localStorage.setItem('dados', dados);
    $.post(servidor + 'chat.php', {id: id, para: dados, acao: 'notificaqtd'}, function () {
    }).done(function (data) {
        if (data > 1) {
            $('#content').load('chat.html');
        } else if (data == 0) {
            var txt = "Olá, vamos trocar uma idéia?";
            $.post(servidor + 'chat.php', {id: id, para: dados, acao: 'primeira', msg: txt}, function () {
            }).done(function (data) {
                alert("Solicitação de Chat enviada!");
            });
        } else if (data == 1) {
            alert("Aguardando o usuário aceitar sua solicitação de chat!");
        }
    });
});

$('.img-visu span').on('click', function () {
    $('.img-visu').fadeOut('100');
})

$('#perfil-fotos').on('click', '.album', function () {
    var src = $('#' + this.id).attr('src');
    var nomeImagem = $('#' + this.id).attr('data-nome-imagem');
    $('.img-visu img').attr('src', src);

    var server = window.localStorage.getItem('servidor');

    urlFotoAtualizacao = server + "atualizaFoto.php?id=" + id + "&foto=" + nomeImagem;
    urlDeleteFoto = server + "deletarFoto.php?id=" + id + "&foto=" + nomeImagem;
    $('.img-visu').fadeIn('100');
});

// Ação do clique do botão no modal de cutucar.
$('#msg-cutucar button').on('click', function () {
    console.log('valor de dados: ' + dados);
    $.post(
        servidor + 'chat.php',
        {
            id: id,
            para: dados,
            acao: 'notificaqtd'
        },
        function () {})
    .done(function (data) {
        if (parseInt(data) > 0) {
            var txt = '<i class=\'fa fa-hand-point-right cutucada\'> Cutucou</i>' + $('#msg-cutucar textarea').val();
            $.post(
                servidor + 'chat.php',
                {
                    id: id,
                    para: dados,
                    acao: 'primeira',
                    msg: txt
                },
                function () {
                    console.log(txt);
                })
            .done(function (data) {
                $('#msg-cutucar').fadeOut('300');
            });
        } else {
            alert("Aguardando o Usuário aceitar solicitação de Chat");
        }
    });
});

$('.cl-cut').on('click', function () {
    if (dados != id) {
        $('#msg-cutucar').fadeIn('300');
    }
});

$('#msg-cutucar a').on('click', function () {
    $('#msg-cutucar').fadeOut('300');
});

function calcularIdade(aniversario) {
    var nascimento = aniversario.split("-");
    var dataNascimento = new Date(parseInt(nascimento[0], 10),
        parseInt(nascimento[1], 10) - 1,
        parseInt(nascimento[2], 10));

    var diferenca = Date.now() - dataNascimento.getTime();
    var idade = new Date(diferenca);

    return Math.abs(idade.getUTCFullYear() - 1970);
}

function atualizarFoto() {
    $.get(urlFotoAtualizacao, function () {
        alert("Foto de perfil atualizada com sucesso!");
        $('#content').load('perfil.html');
    });
}

function deletarFoto() {
    $.get(urlDeleteFoto, function () {
        alert("Foto Excluída Com sucesso!");
        $('#content').load('perfil.html');
    });
}

function getImage() {
    //$('#pag-cadastro .carregando').fadeIn('slow');
    // Retrieve image file location from specified source
    navigator.camera.getPicture(uploadPhoto, function (message) {
            alert('erro ao capturar a imagem');
            $('#div-carregando').fadeOut('100');
        },{
            quality: 100,
            destinationType: navigator.camera.DestinationType.FILE_URI,
            sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
        }
    );
}

function uploadPhoto(imageURI) {
    var options = new FileUploadOptions();
    options.fileKey = "cad-foto";
    //options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
    options.fileName = "imagem.jpg";
    options.mimeType = "image/jpeg";

    var params = new Object();
    params.id = id;
    params.pos = pos;
    params.at = '1';

    options.params = params;
    options.chunkedMode = true;

    var ft = new FileTransfer();
    ft.upload(imageURI, servidor + "imagem.php", win, fail, options);
}

function win(r) {
    /*alert("Code = " + r.responseCode);
    alert("Response = " + r.response);
    alert("Sent = " + r.bytesSent);*/

    $('#div-carregando').fadeOut('100');
    $('#content').load('perfil.html');
}

function fail(error) {
    alert("An error has occurred: Code = " + error.code);
    $('#div-carregando').fadeOut('100');
}

function visualizaCutucada() {
    $('#msg-cutucar').toggle();
}
