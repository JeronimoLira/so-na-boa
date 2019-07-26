//console.log('meusPedidos.js - 02');

function meusPedidos(pedido, rest, idUsuario){
	$.post(servidor + 'compra.php',{id:pedido, finaliza:'1', rest:rest, usuario:idUsuario}, function(){})
		.done(function(data){
			$('#tab-meupedido').html(data);
	});
};

// Alterar Pedido
var alterar   = document.querySelectorAll('.altera');
    
alterar.forEach(function(item){
	item.addEventListener("click",function(){
		$('#finalizar ul').on('change','.altera',function(){ 
		    var itemId = this.id;
		    var qt     = $(this).val();
		   
		    $.post(servidor + 'compra.php',{altera:'1',usuario:usuario,id:itemId,rest:rest,pedido:pedido,qt:qt}, function(){})
		        .done(function(data){
		            $('#finalizar').append(data);
		    });
		});
	});		        
});