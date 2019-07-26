

function populaUf(booleano){


	var url=window.localStorage.getItem('servidor');

	//console.log(url);

	var xhr = new XMLHttpRequest();

	$.ajax({
	    url: url+'estado.json.php',
	    async: booleano
	}).done(function(resposta) {
	    var ufs = JSON.parse(resposta);
	    $("#cod_estados").append('<option value="">UF</option>');
	    ufs.forEach(function(uf){
			var sigla      = uf.sigla;
			var cod_estado = uf.cod_estados;
			$("#cod_estados").append("<option value="+cod_estado+">"+sigla+"</option>");
		});
	});
};

function populaCidades(booleano){
	if( $('#cod_estados').val() ) {		
		$('.div-cidade').show();
		
		$("#cod_cidades").html('');
		$("#cod_cidades").append("<option value=''>-- Escolha uma Cidade --</option>");

		var url=window.localStorage.getItem('servidor');		

		var idUf   = $('#cod_estados').val();

		url += 'cidade.json.php?codestados='+idUf;

		var xhr = new XMLHttpRequest();

		xhr.open("GET",url,booleano);

		xhr.addEventListener("load", function(){
			var resposta = xhr.responseText;
			var cidades  = JSON.parse(resposta);

			cidades.forEach( function(cidade){
				$("#cod_cidades").append("<option value="+cidade.cod_cidades+">"+cidade.nome+"</option>");
			});

			$('.div-cidade').hide();
		});

		xhr.send();
	} else {
		$('#cod_cidades').html('<option value="">– Escolha um Estado –</option>');
		$('.div-cidade').hide();					
	}
}