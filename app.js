const fs = require('fs'); //Módulo FileSystem
const consoleArgs = process.argv; //array con ingreso por consola

let archivoPATH = "./tareas.json"; //PATH del archivo que persiste tareas

//Muestro titulo por consola
textFrame("\nAplicación de Tareas - JS CLI\n");

consoleArgs.splice(0, 2);   //Elimino primeros 2 elementos del array
switchParametros(consoleArgs); //Llamo al selector de opciones

//--------------------------------------------------------//

//Selección en base a opción ingresada
function switchParametros(parametros) {
    let opcion = parametros.shift();   //La opción debe estar en el primer elemento
    
    switch (opcion) {
        case "-c":
            crearTarea(parametros);
            break;
        case "-d":
            borrarTarea(parametros);
            break;
        case "-u":
            cambiarPATH(parametros);
            break;
        case "-i":
            importTarea(parametros);
            break;
        case "-l":
            listarTodas(archivoPATH, ...parametros);
            break;
        case undefined:
            listarTodas(archivoPATH);
            break;
        case "-h":
            mostrarAyuda();
            break;
        case "-a":
            acercaDe();
            break;
        default:
            opcionDesconocida();
            break;
    }
}

//función para salida por consola
function textFrame(stringArray) {
    console.log("-".repeat(30));

    if (typeof (stringArray) != "string") {
        for (let line of stringArray) {
            console.log(line);
        }
    }
    else {
        console.log(stringArray);
    }

    console.log("-".repeat(30));
}

//Crea tarea nueva y la guarda en el archivo
function crearTarea(args) {
    //Compruebo que la cantidad de argumentos sea correcta
    //Muestro error para corregir la entrada
    if (args.length != 2) {
        const text = [];
        text.push("ERROR");
        text.push("Se esperan solo un TÍTULO y una DESCRIPCIÓN de la nueva tarea.");
        textFrame(text);
        mostrarAyuda("-c");
        return false;
    }

    //Creo la tarea nueva; Estado Pendiente, fecha Hoy
    const hoy = new Date();
    const nuevaTarea = new Tarea(args[0], args[1], hoy, "Pendiente");

    //Traigo las tareas del archivo
    let arrayTareas = getTareas(archivoPATH);
    
    //Agrego la nueva tarea
    arrayTareas.push(nuevaTarea);

    //Guardo el Archivo
    setTareas(archivoPATH, arrayTareas);

    //Muestro, operación exitosa
    let lines = [
        "OPERACIÓN EXITOSA",
        "Su tarea se creó con éxito."
    ];
    lines.push(...nuevaTarea.mostrar())
    textFrame(lines);
}

//Elimina tareas del archivo por titulo
function borrarTarea(args) {
    //Traigo tareas del archivo
    let tareas = getTareas(archivoPATH);

    //Saco el titulo de los argumentos
    let tituloTarea = args[0].toLowerCase();

    //Buscar tarea a eliminar
    let arrayTareas = [...tareas];
    let tareaFiltrada = filtrarTareas(arrayTareas, "Titulo", tituloTarea);
    tareaFiltrada = tareaFiltrada[0];
    if (tareaFiltrada === undefined) {
        textFrame("\nNo se encontro la tareas " + args.toString() + "\n")
        return false;
    }
    
    //Mostrar Tarea a eliminar
    let thisTarea = new Tarea(tareaFiltrada.titulo, tareaFiltrada.descripcion, tareaFiltrada.fecha, tareaFiltrada.estado);
    textFrame("Se elimino la tarea:");
    textFrame(thisTarea.mostrar());
    //Eliminar Tarea
    let index = arrayTareas.indexOf(tareaFiltrada);
    arrayTareas.splice(index, 1);

    //Guardo las tareas en el archivo.
    setTareas(archivoPATH, arrayTareas);
}

function cambiarPATH(args) {
    //Verifico si la direccion es valida
    let direccion = args[0];
    if (direccion[0] == "." && direccion[1] == "/") {
        archivoPATH = direccion;
    }
    else {
        textFrame("\nVerifique la direccion ingresada...\n");
        return false;
    }

    args.splice(0, 1);
    return switchParametros(args);
}

function importTarea(args) {
    let desde = args[0];

    let tareas = getTareas(desde);

    if (tareas.length === 0) {
        textFrame("\nArchivo vacio\n");
        return false;
    }

    tareas.unshift(...getTareas(archivoPATH));

    setTareas(archivoPATH, tareas);

    textFrame("\nLa importación se realizó con éxito\n");

    listarTodas(archivoPATH);
}

function mostrarAyuda() {
    textFrame("Ayuda")
    return;
}

function acercaDe() {
    textFrame("Acerc de:")
    return;
}

function opcionDesconocida() {
    textFrame("\nEl parametro ingresado no pudo ser reconocido.\n-h para obtener ayuda.\n");
    return;
}

//Constructor de objetos Tarea
function Tarea(titulo, descripcion, fecha, estado) {
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.fecha = (typeof(fecha) == "undefined") ? new Date() : new Date(fecha);
    this.estado = estado;
    //String Array para mostrar tarea
    this.mostrar = function () {
        return [
            "Título: " + this.titulo,
            "Descripción: " + this.descripcion,
            "Fecha: " + this.fecha,
            "Estado: " + this.estado
        ];
    }
}

//Trae tareas del archivo y retorna un array
function getTareas(filePATH) {
    let arrayTareas = "";
    try {
        arrayTareas = fs.readFileSync(filePATH, "utf-8");
    }
    catch (error) {
        textFrame("\nNo existe el archivo: " + error.path + "\nVerifique la direccion ingresada.\n");
        return [];
    }
    if (arrayTareas === "") {
        return [];
    }
    arrayTareas = JSON.parse(arrayTareas);
    return arrayTareas;
}

//Guarda un array en archivo
function setTareas(filePATH, arrayTareas) {
    fs.writeFileSync(filePATH, JSON.stringify(arrayTareas));
}

function listarTodas(filePATH, filtrarPor = "", filtro = "") {
    //Traigo las tareas del archivo
    let arrayTareas = getTareas(filePATH);

    //Filtrar Tareas
    if (filtrarPor !== "" | filtro !== "") {
        arrayTareas = filtrarTareas(arrayTareas, filtrarPor, filtro);
    }

    //Si no hay tareas que mostrar...
    if (arrayTareas.length === 0) {
        textFrame("\nNo hay tareas...\n");
        return false;
    }

    //Muestro tareas
    for (let tarea of arrayTareas) {
        let thisTarea = new Tarea(tarea.titulo, tarea.descripcion, tarea.fecha, tarea.estado);
        textFrame(thisTarea.mostrar());
    }
    return true;
}

//Filtra las tareas de un array segun parametros
function filtrarTareas(arrayTareas, filtrarPor, filtro) {
    return arrayTareas.filter((element) => {
        let argumento = element[filtrarPor.toLowerCase()];
        let regExp = new RegExp(filtro.toLowerCase(), "i");
        return regExp.test(argumento);
    }
    );
}