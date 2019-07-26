window.idRestaurante = 0;
var restID = 0;

var lat;
var long;
var logado;
var qtdPedido = 0;
var arrayPaginas = [];
var contadorPagina = 0;

//colocar oendereço do servidor com http e '/' no fim http://localhost:8082/snbphp/paga.php
var servidor = "http://sonaboa.net/";


// Function called when phonegap is ready
function onDeviceReady() {

    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": true,
        "progressBar": false,
        "positionClass": "toast-top-left",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }

    function alertDismissed() {
        navigator.app.exitApp();
    }

    function alertDismissed2() {

    }

    function alertaNativoClose(mensagem,titulo,botao){
        navigator.notification.alert(
                mensagem,  // message
                alertDismissed,         // callback
                titulo,            // title
                botao                  // buttonName
                );
    }

    function alertaNativo(mensagem,titulo,botao){
        alertify.alert(titulo, mensagem, function(){}).set('label', botao).set('movable', false);
    }

    /*
    function CustomAlert(){
        this.render = function(dialog){
            var winW = window.innerWidth;
            var winH = window.innerHeight;
            var dialogoverlay = document.getElementById('dialogoverlay');
            var dialogbox = document.getElementById('dialogbox');
            dialogoverlay.style.display = "block";
            dialogoverlay.style.height = winH+"px";
            dialogbox.style.left = (winW/2) - (550 * .5)+"px";
            dialogbox.style.top = "100px";
            dialogbox.style.display = "block";
            document.getElementById('dialogboxhead').innerHTML = "Título";
            document.getElementById('dialogboxbody').innerHTML = dialog;
            document.getElementById('dialogboxfoot').innerHTML = '<button onclick="da im.ok()">OK</button>';
        };

        this.ok = function(){
            document.getElementById('dialogbox').style.display = "none";
            document.getElementById('dialogoverlay').style.display = "none";
        }
    }

    var Alert = new CustomAlert();
    */

    window.localStorage.setItem('servidor',servidor)

    var config = {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 20000
    }

    /*
    function checkConnection() {
		var networkState = navigator.connection.type;

		var states = {};
		states[Connection.UNKNOWN]  = 'Unknown connection';
		states[Connection.ETHERNET] = 'Ethernet connection';
		states[Connection.WIFI]     = 'WiFi connection';
		states[Connection.CELL_2G]  = 'Cell 2G connection';
		states[Connection.CELL_3G]  = 'Cell 3G connection';
		states[Connection.CELL_4G]  = 'Cell 4G connection';
		states[Connection.CELL]     = 'Cell generic connection';
		states[Connection.NONE]     = 'No network connection';

		if(states[networkState] == 'No network connection'){
			alertaNativoClose("Sem acesso a Internet","Aviso","Fechar");
		}
	}

    checkConnection();
    */

    //geoposição
    function initiate_geolocation() {
        navigator.geolocation.getCurrentPosition(handle_geolocation_query,handle_errors,config);
    }

    function handle_errors(error) {
        switch(error.code)
        {
            case error.PERMISSION_DENIED: alertaNativo("Precisamos de permissão para saber sua posição","Erro","OK");
            //alert("Precisamos de permissão para saber sua posição");
            break;

            case error.POSITION_UNAVAILABLE: alertaNativo("Não foi possível detectar sua posição","Erro","OK");
            //alert("Não foi possível detectar sua posição");
            break;

            case error.TIMEOUT: alertaNativo('Verifique se o seu GPS está ligado',"Erro","OK");
            break;

            default: alertaNativo("Erro desconhecido!","Erro","OK");
            //alert("Erro desconhecido!");
            break;
        }
    }

    function handle_geolocation_query(position){
        lat  = position.coords.latitude;
        long = position.coords.longitude;

        window.localStorage.setItem('lat',lat);
        window.localStorage.setItem('long',long);

        //console.log('latitude: '+lat+' longitude: '+long);

        $.post(servidor + 'restaurante.php',{lat:lat,lng:long}).done(function(data){
            // console.log("index.js - handle_geolocation_query "+data);
            //console.log(data);
            if(data != "")
            {
                //console.log('index.js - Geolocation: '+data);
                var rest = JSON.parse(data);



                if(rest.nome != undefined && rest.nome != null && rest.nome != ''){

					window.idRestaurante  = rest.id;
					restID = rest.id;

                    window.localStorage.setItem('rest', rest.id);
                    window.localStorage.setItem('restNome',rest.nome);
                    window.localStorage.setItem('restImg',rest.img);
                    window.localStorage.setItem('restPapelDeParede',rest.papeldeparede);
                    window.sessionStorage.setItem('mesaDestino',0);

					publicidadeImg(rest.id);

                    if (rest.papeldeparede == null){
                        window.localStorage.setItem('restPapelDeParede',0);
                    } else {
                        window.localStorage.setItem('restPapelDeParede',rest.papeldeparede);
                    }
                    // console.log(window.localStorage.getItem('restPapelDeParede'))

                    if (window.localStorage.getItem('restPapelDeParede') == 0) {
                        var restPapelDeParede = 0;
                    } else {
                        var restPapelDeParede = window.localStorage.getItem('restPapelDeParede');
                    }

                    if (restPapelDeParede != 0) {
                    // Localiza o elemento
                    //console.log("index.html - restPapelDeParede: "+restPapelDeParede);
                    document.body.style.backgroundImage="url(" + servidor + "uploads/restaurantes/" + restPapelDeParede + ")";

                    document.body.style.fontFamily="HelveticaNeue-Light, HelveticaNeue, Helvetica, Arial, sans-serif";
                    document.body.style.fontSize="12px";
                    document.body.style.height="100%";
                    document.body.style.margin="0px";
                    document.body.style.padding="0px";
                    document.body.style.textTransform="uppercase";
                    document.body.style.width="100%";
                    }
                }
            } else {
                window.localStorage.setItem('rest', '0');
                //console.log('Restaurante não localizado');
                alertaNativo("Restaurante não localizado","Alerta","OK");

                escondeRodape(false);
                fixaTela(true);
                MenuFlutuante();

                $('#content').load('mapa.html');

                // initiate_geolocation();
            }
        });
    }

    initiate_geolocation();

    function publicidadeImg(id){
        var idRestaurante = window.localStorage.getItem('rest');

        var servidor = window.localStorage.getItem('servidor');

        //console.log("index.js idRestaurante: " + idRestaurante);

        $.post(servidor + 'publicidade.php',{id:id}).
        done(function(data)
        {
            //console.log("index.js data: "+data);

            if(data != ""){
                var imgs = $.parseJSON(data);

                for(i = 0; i < imgs.length; i++){
                    //console.log(imgs);
                    //console.log(imgs[i].img);

                    if ( i <= 5 )
                    {
                        $(".circulo"+i).attr("src", servidor + "restaurante/uploads/" + imgs[i].img);
                        //console.log("restaurante/uploads/" + imgs[i].img);
                    }
                    else
                        $(".quadrado"+i).attr("src", servidor + "restaurante/uploads/" + imgs[i].img);
                }
            }
        });
    }

    //publicidadeImg("73");

    /*
    * Verifica se entra no app já logado ou não
    */
    var usuario;

    logado = window.localStorage.getItem('logado');

    if(logado == 'true')
    {
        var usuarioId = window.localStorage.getItem('usuarioId');

        //atualiza data
        var dia = new Date();
        $('#home-header div span').text(diasemana());
        $('#home-header div h2').text('Dia ' + dia.getDate());

        $.post(servidor + "home.php",{id:usuarioId})
            .done(function(data){
                //atualiza os dados da página
                try{
                    usuario = JSON.parse(data);
                }catch(error){
                    console.log(JSON.stringify());
                }
                // console.log(usuario);
                var temp = $('#home-header h1').text();
                $('#home-header h1').text(temp.replace('#NOME#',usuario.usr_nome));

                if (usuario.usr_foto != "")
                    $(".img-p").attr("src", servidor + "uploads/usuarios/" + usuario.usr_foto);

                $(".img-p").attr("id", usuario.usr_id);

                escondeRodape(false);
                fixaTela(true);
                $(".menu-usuario").show();
                $('#content').load('home.html');
            });
    } else {
        this.location = '#pag-login';
    }

    //navegação
    $('#tour a.menu-tour').on('click',function(){
        escondeRodape(false);
        fixaTela(false);
        $('#content').load('tour.html');
    });


    $('.header-faleconosco').on('click',function(){
        escondeRodape(false);
        fixaTela(true);
        MenuFlutuante();
        $('#content').load('faleconosco.html');
    });

    $('.header-menu, .cl-pedidos').on('click',function(){
        escondeRodape(false);
        fixaTela(false);
        MenuFlutuante();

        if(logado != 'true' || window.localStorage.getItem('rest') == '0') {
            $('#content').load('mapa.html');
            return;
        }

        //if(this.className == 'header-menu ui-link')
        $('#content').load('pedidos.html');
    });

    $('.header-pagar').on('click',function(){
        escondeRodape(false);
        fixaTela(false);
        MenuFlutuante();
        $('#content').load('cartao.html');
    });

    $('.header-delivery').on('click',function(){
        escondeRodape(false);
        fixaTela(false);
        MenuFlutuante();
        $('#content').load('delivery.html');
    });

    $('.header-estatistica').on('click',function(){
        escondeRodape(false);
        fixaTela(false);
        MenuFlutuante();
        $('#content').load('estatisticas.html');
    });

    $('.header-cadastro').on('click',function(){
        escondeRodape(false);
        fixaTela(true);
        MenuFlutuante();
        if(logado != 'true' || window.localStorage.getItem('rest') == '0')
        {
            $('#content').load('cadastrar.html');
            return;
        }
        $('#content').load('cadastro.html');
    });

    $('.header-perfil').on('click',function(){
        $('#div-carregando').fadeIn('100');
        escondeRodape(false);
        fixaTela(true);
        MenuFlutuante();
        var dados = window.localStorage.getItem('usuarioId');
        var dados = window.localStorage.setItem('dados',dados);
        $('#content').load('perfil.html');
    });

    $('.header-saida').on('click',function(){
        escondeRodape(false);
        fixaTela(true);
        MenuFlutuante();
        $('#content').load('verifica.html');
    });

    $('.header-local').on('click',function(){
        escondeRodape(false);
        fixaTela(true);
        MenuFlutuante();
        $('#content').load('mapa.html');
    });


    $('.header-local2').on('click',function(){
        escondeRodape(true);
        fixaTela(true);
        MenuFlutuante();
        $('#content').load('mapa.html');
    });


    // Chamada a tela de Fidelidade
    $('.header-fidelidade').on('click',function(){
        escondeRodape(false);
        fixaTela(false);
        MenuFlutuante();

        $('#content').load('fidelidade.html');
    });

    $('.header-sobre').on('click',function(){
        escondeRodape(false);
        fixaTela(true);
        MenuFlutuante();
        $('#content').load('sobre.html');
    });

    $('.header-avisos').on('click',function(){
        escondeRodape(true);
        fixaTela(false);
        //MenuFlutuante();
        $('#div-carregando').fadeIn('100');
        $('.notifica').remove();

        if(logado != 'true' || window.localStorage.getItem('rest') == '0'){
            $('#content').load('mapa.html');
            return;
        }

        $('#content').load('avisos.html');
    });

    $('.header-sair').on('click',function(){
        alertify.confirm('Sair do aplicativo', 'Você deseja sair do Aplicativo Só na Boa?',
            function(){
                onConfirm()
            },
            function(){

            }
        ).set('labels', {ok:'Sim', cancel:'Não'});
    });

    function onConfirm() {
        localStorage.clear();
        sessionStorage.clear();
        navigator.app.exitApp();
    }

    // Menu CHAT
    $('.header-avisos2').on('click',function(){
        escondeRodape(true);
        fixaTela(false);

        $('#div-carregando').fadeIn('100');

        MenuFlutuante();

        if(logado != 'true' || window.localStorage.getItem('rest') == '0')
        {
            $('#content').load('mapa.html');
            return;
        }
        $('#content').load('avisos.html');
    });

    $('.btn-cadastrar').on('click',function(){
        escondeRodape(true);
        fixaTela(true);
        $('#content').load('cadastrar.html');
    });

    $('.btn-logo').on('click',function(){
        escondeRodape(false);
        fixaTela(true);

        if(logado != 'true' || window.localStorage.getItem('rest') == '0')
        {
            location.reload();
            return;
        }
        $('#content').load('home.html');
    });

    //função verifica se está logado
    function redireciona(){
        if(logado !== 'true' || window.localStorage.getItem('rest') == '0') $("#content").load("index.html");
    }

    //função dia da semana por extenso
    function diasemana()
    {
        var hoje=new Date();
        var dia= hoje.getDay();
        var semana=new Array(6);
        semana[0]='Domingo';
        semana[1]='Segunda';
        semana[2]='Terça';
        semana[3]='Quarta';
        semana[4]='Quinta';
        semana[5]='Sexta';
        semana[6]='Sábado';

        return semana[dia];
    }

    $('#content').on('click','#cad-foto', function(){
        getImage();
    });

    //funções para fazer o crop da imagem
    var jcrop_api;

    $('#content').on("change",'#cad-foto',function(){
        var path = $('#cad-foto').val();
        var fileName = path.match(/[^\/\\]+$/);
        $("[name='foto']").val(fileName);

        $('#pag-cadastro .carregando').fadeIn('slow');

        $('#cad-imagens').ajaxForm({
            error: function() {
                alertaNativo('Ocorreu um erro ao enviar a imagem',"Erro","OK");
            },
            success: function(){
                $('#previsualizar').Jcrop({
                    minSize: [ 100, 100 ],
                    aspectRatio: 1,
                    setSelect:[ 100, 100, 50, 50 ],
                    onChange: exibePreview,
                    onSelect: exibePreview
                },function(){
                    jcrop_api = this;
                    $('#btn-cadastro-usuario').css('z-index','-1');
                });
            },
            target: '#pag-cadastro .carregando div'
        }).submit();
    });

    $('#content').on('click','#btn-crop',function(){
        $('#btn-crop').prop("disabled",true);
        $.post( servidor + 'crop.php', {
            img:$('#previsualizar').attr('src'),
            x: $('#x').val(),
            y: $('#y').val(),
            w: $('#w').val(),
            h: $('#h').val(),
            iw: $('#iw').val(),
            ih: $('#ih').val()
        }, function(data){
            $("[name='foto']").val(data);
            $('.carregando').fadeOut('slow');
            jcrop_api.destroy();
            $('#btn-cadastro-usuario').css('z-index','1');
        });
        return false;
    });

    $('#content').on('click', '#cadastro-fechar', function(){
        $('#pag-cadastro .carregando').fadeOut('slow');
        jcrop_api.destroy();
        $('#btn-cadastro-usuario').css('z-index','1');
    });

    function getImage() {
        $('#pag-cadastro .carregando').fadeIn('slow');
        // Retrieve image file location from specified source
        navigator.camera.getPicture(uploadPhoto, function(message) {},
        {
                quality: 100,
                destinationType: navigator.camera.DestinationType.FILE_URI,
                sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
        });
    }

    function uploadPhoto(imageURI) {
        try {
            var options = new FileUploadOptions();
            options.fileKey="cad-foto";
            //options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
            options.fileName="teste.jpg"
            options.mimeType="image/jpeg";

            var params = new Object();
            params.serv = servidor;

            options.params = params;
            options.chunkedMode = true;

            var ft = new FileTransfer();
            ft.upload(imageURI, servidor + "imagem.php", win, fail, options);
        }catch(err) {
            //alert('erro ao capturar a imagem'+err);
            alertaNativo("erro ao capturar a imagem"+err,"Erro","OK");
        }
    }

    function win(r) {
        //console.log("Code = " + r.responseCode);
        //console.log("Response = " + r.response);
        //console.log("Sent = " + r.bytesSent);

        $('#pag-cadastro .carregando div').html(r.response);

        var path = $('#previsualizar').attr('src');
        var fileName = path.match(/[^\/\\]+$/);
        $("[name='foto']").val(fileName);

        $('#previsualizar').Jcrop({
            minSize: [ 100, 100 ],
            aspectRatio: 1,
            setSelect:[ 100, 100, 50, 50 ],
            onChange: exibePreview,
            onSelect: exibePreview
        },function(){
            jcrop_api = this;
            $('#btn-cadastro-usuario').css('z-index','-1');
        });
    }

    function fail(error) {
        // alert("An error has occurred: Code = " + error.code);
        alertaNativo("Um erro está ocorrendo: Código = " + error.code,"Erro","OK");
    }

    function exibePreview( c )
    {
        // campos hidden que armazenam os valores
        $('#x').val(c.x);
        $('#y').val(c.y);
        $('#x2').val(c.x2);
        $('#y2').val(c.y2);
        $('#w').val(c.w);
        $('#h').val(c.h);
        $('#iw').val($('#previsualizar').width());
        $('#ih').val($('#previsualizar').height());
    };

    /*
    * LOGIN DO USUÁRIO
    */
    $('#entrar').on('click',function(){

        var loginValido = false;
        var login = $('#lg_login').val();
        var senha = $('#lg_senha').val();

        // Retorna o Id do Restaurante
        var gpstrue = window.localStorage.getItem('rest');

        if(gpstrue != 0){
            if(login == ''){
                // alert("Campo Login obrigatório!");
                alertaNativo("Campo Login obrigatório!","Campo Obrigatório","OK");
            }else if(senha == ''){
                //alert("Campo Senha obrigatório!");
                alertaNativo("Campo Senha obrigatório!","Campo Obrigatório","OK");
            }else{
                loginValido = true;
            }

            if(loginValido){
                $('#div-carregando').fadeIn('100');

                var restaurante = window.localStorage.getItem('rest');

                //$.post(servidor + 'login.php',{acao:'logar', login:login, senha:senha, rest:restaurante})
                $.post(servidor + 'classes/perfil.class.php',{acao:'logar', login:login, senha:senha, rest:restaurante})
                    .done(function(data){

                      var usuario = JSON.parse(data);
                        if(usuario.logado == "true"){
                          $('#form_login').append(
                            "<script>"
                              +"window.localStorage.setItem('nome',       '"+usuario.login+"');"
                              +"window.localStorage.setItem('logado',     '"+usuario.logado+"');"
                              +"window.localStorage.setItem('usuarioId',  '"+usuario.id+"');"
                              +"$('#content').load('home.html');"
                            +"</script>"
                          );
                        }else{
                          $('#form_login').append("<script>window.localStorage.setItem('logado', 'false');</script>")
                        }

                        if(usuario.logado == "true"){

                          escondeRodape(false);
                          fixaTela(true);
                          //console.log('Login efetuado');
                          $(".menu-usuario").show();

                        }else{

                          escondeRodape(true);
                          fixaTela(true);
                          $('#div-carregando').fadeOut('100');
                          //alert('Login e/ou senha inválidos');
                          //('Login e/ou senha inválidos');
                          alertaNativo('Login e/ou senha inválidos','Alerta','OK');

                        }
                        $('#div-carregando').fadeOut('100');
                });
            }
        } else {
            alertaNativo("Restaurante não localizado","Alerta","OK");
            initiate_geolocation();
        }

    });

    //cadastro de usuarios
    $('#content').on('click','#btn-cadastro-usuario',function(){
        $('#cadastro-termos').css('display','block');

        $('#btn_cancelar').click(function(){
            $('#cadastro-termos').css('display','none');
        })

        $('#btn_aceitar_termos').click(function(){
            var nome = $("[name='nome']").val();
            var sexo = $("[name='sexo']").val();
            var aniversario = $("[name='aniversario']").val();
            var codinome = $("[name='codinome']").val();
            var telefone = $("[name='telefone']").val();
            var senha = $("[name='cadSenha']").val();
            var confSenha = $("[name='confSenha']").val();
            var frase = $("[name='frase']").val();
            var estadoCivil = $("[name='estadoCivil']").val();
            var foto = $("[name='foto']").val();
            var interesse = $("[name='interesse']").val();
            var uf = $('[name="uf"]').val();
            var cidade = $("[name='cidade']").val();
            var idioma = $("[name='idioma']").val();
            var rg = $("[name='rg']").val();

            if(nome == '' || nome == undefined || nome == null){
                alertaNativo("Campo nome é obrigatório","Campo Obrigatório","OK");
                $("[name='nome']").focus();
            }else if(rg == '' || rg == undefined || rg == null){
                alertaNativo("Campo RG é obrigatório","Campo Obrigatório","OK");
            }else if(sexo == '' || sexo == undefined || sexo == null){
                alertaNativo("Campo sexo é obrigatório","Campo Obrigatório","OK");
                $("[name='sexo']").focus();
            }else if(aniversario == '' || aniversario == undefined || aniversario == null){
                alertaNativo("Campo Data de Nascimento é obrigatório","Campo Obrigatório","OK");
                $("[name='aniversario']").focus();
            }else if(codinome == '' || codinome == undefined || codinome == null){
                alertaNativo("Campo Codinome é obrigatório","Campo Obrigatório","OK");
                $("[name='codinome']").focus();
            }else if(telefone == '' || telefone == null){
                alertaNativo("Campo Telefone é obrigatório","Campo Obrigatório","OK");
                $("[name='telefone']").focus();
            }else if(senha == '' || senha == undefined || senha == null){
                alertaNativo("Campo Senha é obrigatório","Campo Obrigatório","OK");
                $("[name='cadSenha']").focus();
            }else if(confSenha == '' || confSenha == undefined || confSenha == null){
                alertaNativo("Campo confirmação de senha é obrigatório","Campo Obrigatório","OK");
                $("[name='confSenha']").focus();
            }else if(senha != confSenha){
                alertaNativo("A confirmação de senha precisa ser idêntica a senha","Campo Obrigatório","OK");
            }else{
                $('#div-carregando').css('display','block');
                $.post(
                    servidor + 'cadastro.php',
                    {
                        nome: nome,
                        sexo: sexo,
                        aniversario: aniversario,
                        codinome: codinome,
                        telefone: telefone,
                        senha: senha,
                        frase: frase,
                        estadoCivil: estadoCivil,
                        foto: foto,
                        interesse: interesse,
                        cidade: cidade,
                        uf: uf,
                        idioma: idioma,
                        rg:rg
                    })
                .done(function(data){
                    $('#content').append(data);
                    $(".menu-usuario").show();
                });
                $('#cadastro-termos').css('display','none');
                $('#div-carregando').css('display','none');
            }
        })
    });

    //atualização de usuarios
    $('#content').on('click','#btn-cadastro-atualizar',function(){
    //$('#btn-cadastro-atualizar').click(function(){
        //salva os dados inseridos em variaveis
        var nome = $("[name='nome']").val();
        var sexo = $("[name='sexo']").val();
        var aniversario = $("[name='aniversario']").val();
        var codinome = $("[name='codinome']").val();
        var telefone = $("[name='telefone']").val();
        var senha = $("[name='cadSenha']").val();
        var confSenha = $("[name='confSenha']").val();
        var frase = $("[name='frase']").val();
        var estadoCivil = $("[name='estadoCivil']").val();
        var foto = $("[name='foto']").val();
        var interesse = $("[name='interesse']").val();

        //var uf = $("[name='uf']").val();
        var uf = $('[name="uf"]').val();
        var cidade = $("[name='cidade']").val();

        var idioma = $("[name='idioma']").val();
        var rg = $("[name='rg']").val();

        if(nome == '' || nome == undefined || nome == null){
            $("[name='nome']").focus();
            alertaNativo("Campo nome é obrigatório","Campo Obrigatório","OK");
        }else if(rg == '' || rg == undefined || rg == null){
            alertaNativo("Campo RG é obrigatório","Campo Obrigatório","OK");
        }else if(sexo == '' || sexo == undefined || sexo == null){
            alertaNativo("Campo sexo é obrigatório","Campo Obrigatório","OK");
            $("[name='sexo']").focus();
        }else if(aniversario == '' || aniversario == undefined || aniversario == null){
            alertaNativo("Campo Data de Nascimento é obrigatório","Campo Obrigatório","OK");
            $("[name='aniversario']").focus();
        }else if(codinome == '' || codinome == undefined || codinome == null){
            alertaNativo("Campo Codinome é obrigatório","Campo Obrigatório","OK");
            $("[name='codinome']").focus();
        }else if(telefone == '' || telefone == undefined || telefone == null){
            alertaNativo("Campo Telefone é obrigatório","Campo Obrigatório","OK");
            $("[name='codinome']").focus();
        }else if(senha == '' || senha == undefined || senha == null){
            alertaNativo("Campo Senha é obrigatório","Campo Obrigatório","OK");
            $("[name='cadSenha']").focus();
        }else if(confSenha == '' || confSenha == undefined || confSenha == null){
            alertaNativo("Campo confirmação de senha é obrigatório","Campo Obrigatório","OK");
            $("[name='confSenha']").focus();
        }else if(senha != confSenha){
            alertaNativo("A confirmação de senha precisa ser idêntica a senha","Campo Obrigatório","OK");
            $("[name='confSenha']").focus();
        }else{
            //faz o envio ajax para atualizar
            $.post( servidor + "cadastro.php", { at:1, id:id, nome: nome, sexo: sexo, aniversario: aniversario, codinome: codinome, telefone: telefone, senha: senha, frase: frase, estadoCivil: estadoCivil, foto_cad: foto, interesse: interesse, cidade: cidade, uf: uf, idioma: idioma, senhaHash:senhaHash, rg:rg })
                .done(function( data ) {
                    $('#content').load('cadastro.html');
                });

            $('#cadastro-termos').css('display','none');
            // alert("Usuário Atualizado com sucesso!");
            alertaNativo("Usuário Atualizado com sucesso!","Alerta","OK");
        }
    });

    //Enviar Contato
    $('#content').on('click','#cadastre-se2',function(){
        //salva os dados inseridos em variaveis
        var email    = $("[name='email']").val();
        var mensagem = $("[name='mensagem']").val();

        if(email == '' || email == undefined || email == null){
            $("[name='email']").focus();
            alertaNativo("Campo e-mail é obrigatório","Campo Obrigatório","OK");
        }else if(mensagem == '' || mensagem == undefined || mensagem == null){
            alertaNativo("Campo mensagem é obrigatório","Campo Obrigatório","OK");
        }else if (validaEmail(email)){
            //faz o envio ajax para atualizar
            $.post( servidor + "contatoMob.php", { email: email, mensagem: mensagem})
                .done(function( data ) {
                    //console.log(data);
                    $('.faleconosco').append(data);
                    $('#content').load('faleconosco.html');
                });

           // alertaNativo("Email enviado com sucesso!","Alerta","OK");
        } else {
            alert('O e-mail inserido e invalido!');
            // echo "<script>alertaNativo('O e-mail inserido e invalido!','Alerta','OK');</script>";
        }
    });

    //controla o menu flutuante
    function MenuFlutuante() {
        var atual = $('.menu_flutuante').css('display');
        if(atual == 'none')
        {
            $('.menu_flutuante').css('display','block');
        }
        else
			$('.menu_flutuante').css('display','none');
    }

    $('.MenuFlutuanteBotao').on('click', function(){
        MenuFlutuante();
    });

    //baixa os arquivos para o aparelho
    function DownloadFile(URL, Folder_Name, File_Name) {
    //Parameters mismatch check
        if (URL == null && Folder_Name == null && File_Name == null) {
            return;
        }
        else {
            //checking Internet connection availablity
            var networkState = navigator.connection.type;
            if (networkState == Connection.NONE) {
                return;
            } else {
                download(URL, Folder_Name, File_Name); //If available download function call
            }
        }
    }

    function download(URL, Folder_Name, File_Name) {
        //step to request a file system
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemSuccess, fileSystemFail);

        function fileSystemSuccess(fileSystem) {
            var download_link = encodeURI(URL);
            ext = download_link.substr(download_link.lastIndexOf('.') + 1); //Get extension of URL

            var directoryEntry = fileSystem.root; // to get root path of directory
            directoryEntry.getDirectory(Folder_Name, { create: true, exclusive: false }, onDirectorySuccess, onDirectoryFail); // creating folder in sdcard
            var rootdir = fileSystem.root;
            var fp = rootdir.fullPath; // Returns Fulpath of local directory

            fp = fp + "/" + Folder_Name + "/" + File_Name + "." + ext; // fullpath and name of the file which we want to give
            // download function call
            filetransfer(download_link, fp);
        }

        function onDirectorySuccess(parent) {
            // Directory created successfuly
        }

        function onDirectoryFail(error) {
            //Error while creating directory
            //alert("Unable to create new directory: " + error.code);
            alertaNativo("Não é possível criar um novo diretório: " + error.code,"Erro","OK");
        }

        function fileSystemFail(evt) {
            //Unable to access file system
            //alert(evt.target.error.code);
            alertaNativo("evt.target.error.code","Erro","OK");
        }
    }

    function filetransfer(download_link, fp) {
        var fileTransfer = new FileTransfer();
        // File download function with URL and local path
        fileTransfer.download(download_link, fp,
            function (entry) {
                //alert("download complete: " + entry.fullPath);
                alertaNativo("download complete: " + entry.fullPath,"Alerta","OK");
            },
            function (error) {
                //Download abort errors or download failed errors
                //alert("download error source " + error.source);
                //alert("download error target " + error.target);
                //alert("upload error code" + error.code);
                alertaNativo("download error source " + error.source,"Erro","OK");
            }
        );
    }

    document.addEventListener("backbutton", function() {
        navigator.app.exitApp();
    }, false);

    $('#exibirSenha').on('click',function(){
        if (document.getElementById('exibirSenha').checked) {
            document.getElementById('lg_senha').type = 'text';
        } else {
            document.getElementById('lg_senha').type = 'password';
        }
    });
}

function escondeRodape(esconde){
    if(esconde == true){
        $(".rodape").hide();
    }else{
        $(".rodape").show();
    }
}
function fixaTela(fixar){
    if(fixar == true){
        $('#main-principal').css('position','fixed');
    }else{
        $('#main-principal').css('position','unset');
    }
}

function btnBack(cont,array){
    if(array[cont] == 1){
        $('.header-perfil').click();
    }else if(array[cont] == 2){
        $('.header-saida').click();
    }else if(array[cont] == 3){
        $('.header-avisos2').click();
    }else if(array[cont] == 4){
        $('.header-cadastro').click();
    }else if(array[cont] == 5){
        $('.header-pacotes').click();
    }else if(array[cont] == 6){
        $('.header-menu').click();
    }else if(array[cont] == 7){
        $('.header-local').click();
    }else if(array[cont] == 8){
        $('.header-fidel').click();
    }else if(array[cont] == 9){

        $('.header-pagar').click();
    }else if(array[cont] == 10){

        $('.header-faleconosco').click();
    }
}

$(document).ready(function(){
    escondeRodape(false);
    fixaTela(true);
    $(".menu-usuario").hide();
    $("#lg_login").click(function(){
        $("#lg_login").focus();
    });


    $('.cl-cut').on('click',function(){
        if(idcutucahome != ''){
            $('#msg-cutucar-home').fadeIn('300');
        }
    });

    $('#msg-cutucar-home a').on('click',function(){
        $('#msg-cutucar-home').fadeOut('300');
    });

    window.isphone = false;
    if(document.URL.indexOf("http://") === -1
        && document.URL.indexOf("https://") === -1) {
        window.isphone = true;
    }

    if( window.isphone ) {
        document.addEventListener("deviceready", onDeviceReady, false);

    } else {
        onDeviceReady();
    }
    $('#menu_bg').click(function( e ){
        $('#menu_bg').hide(); //fecha o menu se clicar fora
    });

});

function callAnothePage(path)
{
    window.location = path;
}

// Define uma função que poderá ser usada para validar e-mails usando regexp
function validaEmail(mail) {
    var er = new RegExp(/^[A-Za-z0-9_\-\.]+@[A-Za-z0-9_\-\.]{2,}\.[A-Za-z0-9]{2,}(\.[A-Za-z0-9])?/);
    if(typeof(mail) == "string"){
        if(er.test(mail)){
            return true;
        }
    } else if (typeof(mail) == "object"){
        if(er.test(mail.value)){
            return true;
        }
    } else {
        return false;
    }
}
