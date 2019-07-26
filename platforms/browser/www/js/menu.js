$(document).ready(function(){
	//console.log('menu.js - 01');
	$('#div-carregando').fadeIn('100');	
	var rest      = window.localStorage.getItem('rest');
	var servidor  = window.localStorage.getItem('servidor');
	var idUsuario = window.localStorage.getItem('usuarioId');
	// var mesa      = window.localStorage.getItem('mesa');
	var pedido    = window.localStorage.getItem('pedido');

	$.ajaxSetup({async: false});

    function onPrompt2(value) {

    	// Valida se a mesa foi inserida
    	if(parseInt(value) > 0){
            mesa = value;
            window.localStorage.setItem('mesa',mesa);
		}
	}

	/*
	*  Verifica se a mesa está aberta ou fechada
	*/ 
	$.post(servidor + 'verificaMesa.php',{id:idUsuario,restaurante:rest}, function(){})
	.done(function(data)
	{
		// console.log('mesa: '+data);

		//console.log('menu.js - data: ' + data);

		if (data == 'false')
		{
			mesa = 0;
			window.localStorage.setItem('mesa',0);
			//console.log('menu.js - if (data == false)');
			//console.log('menu.js - mesa1: '+mesa);
		} else 
		{			
			window.localStorage.setItem('mesa',data);
			//console.log('menu.js - else');
			//console.log('menu.js - mesa2: '+data);
			mesa = data;
		}
	});

	//console.log('menu.js - mesa3: ' + mesa);

	// Informar a mesa
	if(mesa == undefined || mesa == null || mesa == 0) {
        alertify.prompt( 'Comanda', 'Por favor digite o número da Comanda', '',
			function(evt, value) { onPrompt2(value) },
            function() {}
            ).set('labels', {ok:'Confirmar', cancel:'Cancelar'});
	}
	
	var mesaDestino = window.sessionStorage.getItem('mesaDestino');

	//console.log('menu.js - mesaDestino: '+mesaDestino);

	// Verifica se está vindo da tela de chat ou não
	if(mesaDestino == undefined || mesaDestino == null || mesaDestino == 0){
		//console.log('menu.js - Não Drink');
		$.post(servidor + 'categorias.php',{id:rest,filtro:''}, function(){})
			.done(function(data){
				$('.pedidos-cat').html(data);				
		});

		$.post(servidor + 'menu.php',{id:rest}, function(){})
			.done(function(data){
				$('#tab-fidelidade').html(data);
				$('#div-carregando').fadeOut('100');
		});
	} else {		
		$.post(servidor + 'menu.php',{id:rest,filtro:'Drinks'}, function(){})
		.done(function(data){
			//console.log('menu.js - Drink: '+data);
			$('#tab-fidelidade').html(data);
			$('#div-carregando').fadeOut('100');
		});
	};

	retornaTotal();	

	$.ajaxSetup({async: true});
	
	meusPedidos(pedido, rest, idUsuario);

	$('#pedidos-tot button').on('click',function(){
		var id = this.id;
		$.post(servidor + 'menu.php',{id:rest}, function(){})
			.done(function(data){
				$('#tab-fidelidade').html(data);
				// $('#pedidos ul').html(data);
		});

	});
	$('#tot button').on('click',function(){
		var id = this.id;
		$.post(servidor + 'menu.php',{id:rest}, function(){})
			.done(function(data){
				$('#tab-fidelidade').html(data);
				// $('#pedidos ul').html(data);
		});
	});

	$('#pedidos-finalizar button').on('click',function(){
		var id = this.id;
		// $('#content').load('finalizar.html');
		$('#tab-fidelidade').html(data);
	});
	
	$('.pedidos-cat').on('click','.filtrar',function(){
		var filtro = this.id;
		
		$.post(servidor + 'menu.php',{id:rest,filtro:filtro}, function(){})
			.done(function(data){
				$('#tab-fidelidade').html(data);
				// $('#pedidos ul').html(data);
		});
	});

	function valorTotal(valor){
		var total_str = $('#pedidos-finalizar .total').text();
		total_str     = total_str.replace(',','.');
		var total     = parseFloat(total_str);
		
		total = total + valor;
		
		var itens_str = $('#pedidos-finalizar .itens').text();
		var itens     = parseInt(itens_str);
		itens++;
		
		$('#pedidos-finalizar .itens').text(itens);
		$('#pedidos-finalizar .total').text(total.toFixed(2));
	};
});