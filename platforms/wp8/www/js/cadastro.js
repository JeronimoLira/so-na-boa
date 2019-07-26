$('.carregando').css('display','block');
    //console.log('populaUf(false)');
    
populaUf(false);        
populaCidades(true);        



$(document).ready(function(){
    $.post(servidor + 'dados.php',
        {
            id:id
        },
    function(){})
    .done(function(data){
        var usuario = $.parseJSON(data);
        
        var id = usuario.usr_id;
        var nome = usuario.usr_nome;
        var sexo = usuario.usr_sexo;
        var aniversario = usuario.usr_aniversario;
        var telefone = usuario.usr_telefone;
        var codinome = usuario.usr_codinome;
        var senhaUsu = usuario.usr_senha;
        senhaHash = senhaUsu;
        var frase = usuario.usr_frase;
        var estado_civil = usuario.usr_est_civil;
        
        var foto = usuario.usr_foto;
        var interesse = usuario.usr_interesse;
        
        var uf = usuario.usr_uf;
        var cidade = usuario.usr_cidade;
        
        var idioma = usuario.usr_idioma;
        var identidade = usuario.rg;
        
        var d = new Date(aniversario);
        var day = d.getDate();
        var month = d.getMonth() + 1;
        var year = d.getFullYear();
        if (day < 10) {
            day = "0" + day;
        }
        if (month < 10) {
            month = "0" + month;
        }
        var date = day + "/" + month + "/" + year;
        $("input[name='aniversario']").val(date);
        $("input[name='nome']").val(nome);
        $("input[name='codinome']").val(codinome);
        $("input[name='telefone']").val(telefone);
        $("input[name='cadSenha']").val(senhaUsu);
        $("input[name='confSenha']").val(senhaUsu);
        $("input[name='frase']").val(frase);
        $("input[name='foto_cad']").val(foto);
        //console.log("cadastro.html foto: "+foto);

        if (uf != null && uf !== undefined && uf !== "") {
            $("#cod_estados").val(uf);
            populaCidades(false);
            $("#cod_cidades").val(cidade);
        };

        $("select[name='sexo']").val(sexo).change();
        $("select[name='estadoCivil']").val(estado_civil).change();
        $("select[name='idioma']").val(idioma).change();
        $("select[name='interesse']").val(interesse).change();
        $("input[name='rg']").val(identidade);                    
    }); 
    $('.carregando').css('display','none');           
});       

$("input[name='aniversario']").click(function(){
    $("#inputHidden").click();
});
            
$("#inputHidden").change(function(){
        var a = $("#inputHidden").val();
        var ano = a.substr(0,4);
        var mes = a.substr(5,2);
        var dia = a.substr(8,10);
        var datani = dia+"/"+mes+"/"+ano;
        $("input[name='aniversario']").val(datani);
    $(" input[name='codinome']").click();
});

var id = window.localStorage.getItem('usuarioId');
var servidor = window.localStorage.getItem('servidor');
var senhaHash = '';                    

$("[name='cadSenha']").click(function(){
        $("[name='cadSenha']").val("");
});

$("[name='confSenha']").click(function(){
        $("[name='confSenha']").val("");
});