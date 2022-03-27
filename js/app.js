// AUTOR: ADRIAN IVORRA ARACIL

window.addEventListener("load", function(){
    // LOS ARRAYS CON LAS PALABRAS ESTAN EN OTROS ARCHIVOS JS

    // Variables que inicializamos
    let palabra = []; // Array donde meteremos cada letra que escribamos en los imputs
    let num = 1; // Es en la fila donde va a insertar la palabra al clicar en el botón de enviar
    let fin = 0; // Para ver si ya hemos puesto las seis palabras (oportunidades) o no
    let cont = 0; // Para contar cuantas letras hemos puesto en el array y si hay menos que en la palabra a adivinar no se envia la palabra (no puede haber inputs vacios)
    let i = 0; // Es la letra del contador
    let res = false; // Controlamos si se envia la palabra o no
    let palabra_azar; // Declaramos la variable palabra_azar
    
    // Los datos guardados en el navegador los ponemos en las variables
    let puntos = localStorage.getItem('puntos');
    // Variables de partidas ganadas dependiendo de la dificultad
    let ganadas4 = localStorage.getItem('ganadas4');
    let ganadas5 = localStorage.getItem('ganadas5');
    let ganadas7 = localStorage.getItem('ganadas6');
    // Variables de partidas perdidad dependiendo de la dificultad
    let perdidas4 = localStorage.getItem('perdidas4');
    let perdidas5 = localStorage.getItem('perdidas4');
    let perdidas7 = localStorage.getItem('perdidas4');

   //let puntuacion = document.getElementById("puntuacion");
    //puntuacion.style.display = "none"; // Ocultamos la puntucación al cargar la página

    // Ocultar
    let reiniciarEst = document.getElementById("reiniciarEstadisticas");
    reiniciarEst.style.display = "none"; // ocultar el botón de reiniciar estadísticas (solo aparece en la sección estadísticas)
    document.getElementById("teclado").style.display = "none"; // Ocular teclado al inicio
    document.getElementById("inicio").style.display = "none"; //ocultamos el botón de ir a inicio de la sección de estadísticas

    // Crear botón para volver a jugar
    let sectionContenedor = document.getElementById("contenedor");
    let botonReintentar = document.createElement("button");

    // Atributos del botón de reintentar
    botonReintentar.setAttribute("id","reintentar");
    botonReintentar.style.display = "none";

    sectionContenedor.appendChild(botonReintentar); // Insertamos el botón

    // Función para generar la rejilla con las casillas de cada palabra
    function generarRejilla(){
        let divContenedor = document.getElementById("casillas"); // Nos vamos al div donde insertaremos la rejilla

        let longitudRejillas = 6;
        if (palabra_azar.length == 7)
            longitudRejillas = 8;

        // Creamos las casillas de 6 x palabra_azar.length
        for (let i = 0 ; i < longitudRejillas ; i++){
            let div_fila = document.createElement("div");

            div_fila.setAttribute("id","fila" + (i+1)); // Id de cada fila
            for (let j = 0 ; j < palabra_azar.length ; j++){
                let divCasillaFila = document.createElement("div");
                divCasillaFila.setAttribute("id","casilla" + (j+1)+ "_" + (i+1)); // id de cada casilla
                divCasillaFila.setAttribute("class","casilla"); // Clase de la casilla
                div_fila.appendChild(divCasillaFila);
            }
            divContenedor.appendChild(div_fila);
        }
    }

    // Teclas del teclado en pantalla
    let teclas = document.getElementsByClassName("tecla");
    function teclas1(){
        for (let i = 0 ; i < teclas.length-1 ; i++) { // El -1 esta para que no coger el valor del enter que seria cadena vacia
            teclas[i].addEventListener("click", function() {
                teclasTeclado(this.value);
            });
        }
    }

    teclas1(); // Llamamos a la función de las teclas en pantalla


    // Función de las teclas del teclado en pantalla
    function teclasTeclado(valor){
        console.log(valor);
        if ( valor != "" && /^[a-zA-ZñÑ]$/.test(valor) != false && palabra.length != palabra_azar.length && valor != "Delete"){
            res = true;
            palabra.push(valor.toUpperCase());
            document.getElementById("casilla" + (cont+1) + "_" + num).innerText = valor.toUpperCase();
            document.getElementById("casilla" + (cont+1) + "_" + num).style.border = "3px solid black";
            cont++;
        }
        else
            res = false;

        if (valor == "Delete")
        {
            palabra.splice(palabra.length-1);
            document.getElementById("casilla" + (cont) + "_" + num).innerText = "";
            document.getElementById("casilla" + (cont) + "_" + num).style.border = "2px solid #3a3a3c";
            cont--;
        }

        if (valor == "Enter")
        {
            enviarPalabra();
        }
    }
    
    // Función para enviar la palabra a las casillas superiores
    function enviarPalabra(){
        if (res && cont == palabra_azar.length && num <= 6)
        {
            let tipoArray;
            if (palabra_azar.length == 4)
                tipoArray = palabras4letras;
            else if (palabra_azar.length == 5)
                tipoArray = palabras5letras;
            else
                tipoArray = palabras7letras;

            if (tipoArray.inArray(palabra))
            {
                if (palabra.length == palabra_azar.length)
                    insertarComprobarPalabra(palabra, num);
                else
                    insertarComprobarPalabra(palabraTeclado, num);
       
                palabra = [];
                num++;     
                cont = 0; 
            }
            else
            {
                palabra = [];
                cont = 0;
                for (let i = 0 ; i < palabra_azar.length ; i++){
                    document.getElementById("casilla" + (i+1) + "_" + num).innerText = "";
                    document.getElementById("casilla" + (i+1) + "_" + num).classList.add("noEncontrada");
                }
                document.getElementById("encontrada").innerText="Palabra no encontrada!"; //Mensaje de error
                document.getElementById("encontrada").setAttribute("class","noEncontrada"); // Efecto temblor del texto

                setTimeout(function () { 
                    document.getElementById("encontrada").innerText="";
                    document.getElementById("encontrada").classList.remove("noEncontrada"); // Quitar efecto temblor al texto
                    for (let i = 0 ; i < palabra_azar.length ; i++){
                        document.getElementById("casilla" + (i+1) + "_" + num).classList.remove("noEncontrada");
                        document.getElementById("casilla" + (i+1) + "_" + num).style.border = "2px solid #3a3a3c";
                    }
                }, 1500) // Tiempo de retardo
            }
        }
    }

     // Ver si la palabra introducida esta en el diccionario (array de palabras) 
     //(Esta función no se puede utilzar porque no es eficiente y tarda en encontrar si la palabra esta en el array o no (sobretodo en dispostivos moviles que son mas lentos ))
    //  function palabraEncontrada(array){
    //     let encontrada = false;
    //     if (palabra.length == palabra_azar.length)
    //         for (let i = 0 ; i < array.length; i++)
    //             if (palabra.join("").toUpperCase().includes(array[i])){
    //                 encontrada = true;
    //                 break;
    //             }
    //     else
    //         for (let i = 0 ; i < array.length; i++)
    //             if (palabra.join("").toUpperCase().includes(array[i])){
    //                 encontrada = true;
    //                 break;
    //             }
    //     return encontrada;
    // }


    // Ver si la palabra introducida esta en el diccionario (array de palabras)
    Array.prototype.inArray = function inArray (search) {
        let founded = false
        for (let i = 0; i < this.length; i++) {
          if (this[i] == search.join("").toUpperCase()) {
            founded = true
            break
          }
        }
        return founded;
      }

    // Función para insertar  y comprobar la palabra (y las letras)
    function insertarComprobarPalabra(palabra, num){
        let cantidadColum = 6;
        if (palabra_azar.length == 7)
            cantidadColum = 8;
        if (num <= cantidadColum){
            i = 0;
            fin = 0;
            myLoop(palabra, num); // LLamamos al bucle con retardo para insertar las letras y los colores 
        }
    }
    
    // Función que tiene un retardo para insertar las letras y los colores y que no se inserten todos a la vez
    function myLoop (palabra, num) { 
        setTimeout(function () { 
            document.getElementById("casilla" + (i+1) + "_" + num).classList.add("añadirPalabra"); // Efecto temblor de las casillas
            document.getElementById("casilla" + (i+1) + "_" + num).innerText = palabra[i].toUpperCase();

            let longitudPalabras = 6;
            if (palabra_azar.length == 7) // Si elegimos el modo dificil tenemos dos oportunidades mas de insertar palabras 
                longitudPalabras = 8;
            // Comprobar coincidencias (poner colores de fondo en cada letra)
            if (num <= longitudPalabras){
                if (palabra_azar.charAt(i).includes(palabra[i].toUpperCase())) // Letras encontradas en la misma posición que la palabra a adivinar
                {
                    document.getElementById("casilla" + (i+1) + "_" + num).style.backgroundColor = "#538d4e"; // Colorear las letras encontradas
                    document.getElementById(palabra[i].toUpperCase()).style.backgroundColor = "#538d4e"; // Poner colores a las teclas del teclado
                    fin++;
                }
                else if (palabra_azar.includes(palabra[i].toUpperCase()) && palabra_azar[i] != palabra.join("")[i] ){//&& palabra_azar.charAt(i).includes(palabra[i].toUpperCase())) // letras encontradas en la palabra pero no en la misma posición
                    document.getElementById("casilla" + (i+1) + "_" + num).style.backgroundColor = "#b59f3a";
                    document.getElementById(palabra[i].toUpperCase()).style.backgroundColor = "#b59f3a"; // Poner colores a las teclas del teclado
                }else{ // Letra no encontrada
                    document.getElementById("casilla" + (i+1) + "_" + num).style.backgroundColor = "#717174";
                    document.getElementById(palabra[i].toUpperCase()).style.backgroundColor = "#717174"; // Poner colores a las teclas del teclado
                 } 
            }
            i++; // incrementar el contador
            if (palabra_azar.length == fin){
                clearTimeout(); // Parar el retardo de tiempo si hemos ganado
                ganar(); // Funcion ganador
            }
            else if (i < palabra_azar.length)
                myLoop(palabra, num); // Llamada a si mismo
            else if (num == 6 && fin < palabra_azar.length){
                perder(); // Funcion perdedor
                clearTimeout(); // Parar el retardo de tiempo si hemos perdido
            }
        }, 400) // Tiempo de retardo
    }

    // Funcion ganar
    function ganar()
    {
        document.getElementById("teclado").style.display = "none";
        num = 1; // Ponemos num a 1 por si queremos volver a jugar que empiece desde la linea uno
        mensajeFin("Has ganado!"); // Función para el mensaje de fin
        botonReintentar.innerText = "Volver a jugar"; // Texto que aparece en el botón de reintentar
        botonReintentar.style.display = ""; //Mostrar el botón de reintentar
        startConfetti(); // Empieza el confetti
        
        // Puntuaciones
        let punt = 0;

        // Incrementar puntos dependiendo de la dificultad del nivel
        if (palabra_azar.length == 7)
        {
            punt = 40;
            ganadas7++;
        }
        else if (palabra_azar.length == 5)
        {
            punt = 30;
            ganadas5++;
        }
        else if (palabra_azar.length == 4)
        {
            punt = 20;
            ganadas4++;
        }

        if (num == 1 || num == 2)
            puntos += punt;
        else if (num == 3 || num == 4)
            puntos += punt - 5;
        else if (num == 5)
            puntos += punt - 10;
        else if (num == 6)
            puntos += punt - 15;
        else if (num == 7 || num == 8)
            puntos = 0;

        //actualizarGrafica(true); //octualizar la gráfica con las partidas ganadas
        //puntuacion.innerHTML = '<strong>Puntuación:</strong>' + puntos + ' puntos'; // Mostrar los putnos por pantalla
        localStorage.setItem('puntos', puntos);
    }

    // Funcion perder 
    function perder()
    {
        document.getElementById("teclado").style.display = "none";
        num = 1;
        // Contar las partidas perdidad dependiendo de la dificultad
        if (palabra_azar.length == 7)
        perdidas7++;
        else if (palabra_azar.length == 5)
            perdidas5++;
        else if (palabra_azar.length == 4)
            perdidas4++;
        //ocultarImputs(); // Ocultar imputs
        mensajeFin("Has perdido"); // Mensaje de fin
        botonReintentar.innerText = "Reintentar"; // Texto que aparece en el botón de reintentar
        botonReintentar.style.display = ""; // Mostrar el botón de reintentar
        //actualizarGrafica(false); // Actualizamos la gráfica con las partidas perdidas
    }

    // Función para actualizar la gráfica 
    // function actualizarGrafica(ganada){

    //     // Dependiendo de si seha ganado o perdido
    //     if (ganada)
    //     {
    //         if (palabra_azar.length == 7)
    //             datos.datasets[0].data[2] = ganadas7;
    //         else if (palabra_azar.length == 5)
    //             datos.datasets[0].data[1] = ganadas5;
    //         else if (palabra_azar.length == 4)
    //             datos.datasets[0].data[0] = ganadas4;
    //     }
    //     else
    //     {
    //         if (palabra_azar.length == 7)
    //             datos.datasets[1].data[2] = perdidas7;
    //         else if (palabra_azar.length == 5)
    //             datos.datasets[1].data[1] = perdidas5;
    //         else if (palabra_azar.length == 4)
    //             datos.datasets[1].data[0] = perdidas4;
    //     }

    //     //  Guardamos los datos de las partidas ganas y perdidas en el navegador
    //     localStorage.setItem('ganadas4', ganadas4);
    //     localStorage.setItem('ganadas5', ganadas5);
    //     localStorage.setItem('ganadas7', ganadas7);

    //     localStorage.setItem('perdidas4', perdidas4);
    //     localStorage.setItem('perdidas5', perdidas5);
    //     localStorage.setItem('perdidas7', perdidas7);
    //     chart.update(); // Actualizar gráfica
    // }

    // Mensaje de fin personalizado
    function mensajeFin(mensaje){
        let divMensaje = document.getElementById("mensaje");
        let parrafo = document.createElement("h3");
        if (mensaje == "Has perdido")
            parrafo.innerHTML = mensaje + ". La palabra secreta es '" + palabra_azar + "'";
        else
            parrafo.innerHTML = mensaje;

        divMensaje.appendChild(parrafo);
        document.getElementById("reintentar").focus();
    }

    // Función que llama a otras funciones
    function llamarFuncionesBotones(array)
    {
        //puntuacion.style.display = "";
        document.getElementById("dificultad").style.display = "none";
        let numero = Math.floor(Math.random() * array.length);
        palabra_azar = array[numero];
        console.log(palabra_azar);
        generarRejilla();
        //document.getElementById("grafica").style.display = "none";
        botonEstadisticas.style.display = "none";
        document.querySelector("#titulo > h1").style.marginLeft = "-200px";
        return palabra_azar;
    }

    // Pulsaciones de las teclas del teclado
    document.addEventListener('keydown', (event) => {
        var keyValue = event.key;
        if ( keyValue != "" && /^[a-zA-ZñÑ]$/.test(keyValue) != false && palabra.length != palabra_azar.length && keyValue != " " && event.key != "Backspace"){
            res = true;
            palabra.push(keyValue.toUpperCase());
            document.getElementById("casilla" + (cont+1) + "_" + num).classList.add("animacionEscribir");
            document.getElementById("casilla" + (cont+1) + "_" + num).innerText = keyValue.toUpperCase();
            document.getElementById("casilla" + (cont+1) + "_" + num).style.border = "3px solid black";
            cont++;
        }
        
        // Borrar letras de la palabra escrita
        if (event.key == "Backspace" &&  document.getElementById("casilla1" + "_" + num).innerText != "")
        {
            palabra.splice(palabra.length-1);
            document.getElementById("casilla" + (cont) + "_" + num).innerText = "";
            document.getElementById("casilla" + (cont) + "_" + num).style.border = "2px solid #3a3a3c";
            cont--;
        }

        if (event.key == "Enter")
            enviarPalabra();
    }, false);



    // Tecla enter para enviar la palabra
    let teclaEnviar = document.getElementById("teclaEnviar");
    teclaEnviar.addEventListener("click", function() {
        enviarPalabra();
    });

    // Botón de jugar de nuevo o reintentar
    botonReintentar.addEventListener("click", function() {
        document.getElementById("teclado").style.display = "none"; // Ocultar el teclado
        // Quitar colores de las teclas
        for (let i = 0 ; i < teclas.length ; i++)
            teclas[i].style.backgroundColor = "";
        stopConfetti();
        botonReintentar.style.display = "none"; // Ocultamos el botón de reintentar
        document.getElementById("mensaje").removeChild(document.querySelector("#mensaje > h3")); // Eliminamos el mensaje

        num = 1; // Ponemos la fila de la palabra a uno de nuevo (ya que reiniciamos el juego)

        // Ocultamos el texto y los botones de dificultad ¡
        document.getElementById("dificultad").style.display = "";

        // Eliminamos las casillas de las palabras
        let divCont = document.getElementById("casillas");
        let cantidadCasiilas = 6;
        if (palabra_azar.length == 7)
            cantidadCasiilas = 8;
        for (let i = 0 ; i < cantidadCasiilas ; i++){
            let cas = document.querySelector("#casillas > #fila" + (i+1) );
            divCont.removeChild(cas);
        }

        botonEstadisticas.style.display = "";
        document.querySelector("#titulo > h1").style.marginLeft = "";
    });

    // Botón dificultad baja
    let botonBaja = document.getElementById("baja");
    botonBaja.addEventListener("click", function() {
        document.getElementById("teclado").style.display = "";
       llamarFuncionesBotones(palabras4letras);
    });

    // Botón dificulad media
    let botonMedia = document.getElementById("media");
    botonMedia.addEventListener("click", function() {
        document.getElementById("teclado").style.display = "";
        llamarFuncionesBotones(palabras5letras);
    });

    // Botoón dificultad alta
    let botonAlta = document.getElementById("alta");
    botonAlta.addEventListener("click", function() {
        document.getElementById("teclado").style.display = "";
        llamarFuncionesBotones(palabras7letras);
    });

    // Botón para ver las estadísticas de partidas ganadas 
    let botonEstadisticas = document.getElementById("estadisticas");
    botonEstadisticas.addEventListener("click", function() {
        reiniciarEst.style.display = "";
        document.getElementById("dificultad").style.display ="none";
        document.getElementById("grafica").style.display = "";
        this.style.display = "none";
        botonInicio.style.display = "";
    });

    // Botón para ir a la pantalla de inicio
    let botonInicio =  document.getElementById("inicio");
    botonInicio.addEventListener("click", function() {
        reiniciarEst.style.display = "none";
        document.getElementById("dificultad").style.display ="";
        this.style.display = "none";
        botonEstadisticas.style.display = "";
        document.getElementById("grafica").style.display = "none";
        //chart.update(); // Actualizar gráfica
    });

  
    reiniciarEst.addEventListener("click", function() {
        localStorage.clear(); //Borrar almacenamiento local
        //chart.update(); // Actualizar gráfica
        location.reload(); //Recargar página y que se recargue bien la gráfica
    });


    // // Datos de la gráfica
    // let datos = {
    //     labels : ["Baja","Media","Alta"],
    //     datasets : [
    //     {
    //         label: "Partidas ganadas",
    //         backgroundColor : "rgb(124, 192, 228)", 
    //         borderColor : "black",
    //         data : [ganadas4, ganadas5, ganadas7]
    //     },
    //     {
    //         label: "Partidas perdidas",
    //         backgroundColor : "rgb(245, 128, 128)", 
    //         borderColor : "black",
    //         data : [perdidas4, perdidas5, perdidas7]
    //     }]
    // };

    // // Configuración de la gráfica 
    // let config = {
    //     type: 'bar',
    //     data: datos,
    //     options: {}
    // };
    
    // const chart= new Chart(document.getElementById("grafico"), config); // Añadir la gráfica 
});
