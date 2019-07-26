$(document).ready(function(){
	//console.log('pacote.js - 03');
		var rest      = window.localStorage.getItem('rest');
		var servidor  = window.localStorage.getItem('servidor');
		var idUsuario = window.localStorage.getItem('usuarioId');
		var mesa      = window.localStorage.getItem('mesa');
		var pedido    = window.localStorage.getItem('pedido');

		meusPedidos(pedido, rest, idUsuario);
		
		$.ajaxSetup({async: false});

		$.post(servidor + 'pacotes.php',{id:rest}, function(){})
			.done(function(data){
				//console.log(data);
				$('#tab-pacote').html(data);
		});

		retornaTotal();

		$.ajaxSetup({async: true});
		
		$('#pedidos-tot button').on('click',function(){
			var id = this.id;
			$.post(servidor + 'pacotes.php',{id:rest}, function(){})
				.done(function(data){
					$('#tab-pacote').html(data);
					// $('#pedidos ul').html(data);
			});

		});
		$('#tot button').on('click',function(){
			var id = this.id;
			$.post(servidor + 'pacotes.php',{id:rest}, function(){})
				.done(function(data){
					$('#tab-pacote').html(data);
					// $('#pedidos ul').html(data);
			});
		});

		$('#pedidos-finalizar button').on('click',function(){
			var id = this.id;
			// $('#content').load('finalizar.html');
			$('#tab-pacote').html(data);
		});
		
		$('.pedidos-cat-pacote').on('click','.filtrar',function(){
			var filtro = this.id;
			//console.log(filtro);
			$.post(servidor + 'pacotes.php',{id:rest,filtro:filtro}, function(){})
				.done(function(data){
					$('#tab-pacote').html(data);
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