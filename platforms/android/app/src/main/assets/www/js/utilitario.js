function mascaraGenerica(evt, campo, padrao) {  
   //Testa a tecla pressionada pelo usuario  
	var charCode = (evt.which) ? evt.which : evt.keyCode;  
	
	switch (padrao) {
		case "data":
			padrao = '##/##/####';
			break;
		case "cpf":
			padrao = '###.###.###-##';
			break;
		case "cnpj":
			padrao = '##.###.###/####-##';
			break;
		case "rg":
			padrao = '##.###.###-#';
			break;
		case "hora":
			padrao = '##:##:##';
			break;
		case "celular":
			padrao = '(##)#####-####';
			break;
		case "telefone":
			padrao = '(##)####-####';
	}
	
	if (charCode == 8)
		return true; // tecla Backspace, Delete e setas direcionais(para mover o cursor, apenas para FF) permitida
	
	if (charCode != 46 && (charCode < 48 || charCode > 57)) 
		return false; //apenas numeros            
	
	campo.maxLength = padrao.length; //Define dinamicamente o tamanho maximo do campo de acordo com o padrao fornecido  
	
	//aplica a mascara de acordo com o padrao fornecido              
	entrada = campo.value;  
	
	if (padrao.length > entrada.length && padrao.charAt(entrada.length) != '#') {  
		campo.value = entrada + padrao.charAt(entrada.length);                 
	}  
	return true; 
}