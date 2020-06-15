console.log("Aplicación de Tareas");
const fs = require('fs');
const consoleArgs = process.argv;

consoleArgs.splice(2);

console.log(consoleArgs);

// (consoleArgs.length == 0)? 

function Tarea(titulo, descripcion, fecha, estado) {
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.fecha = (typeof(fecha) == "undefined") ? new Date() : new Date(fecha);
    this.estado = estado;
}

const arrayTareas = [];
let hoy = new Date();
let t1 = [
    "Practicar el Switch",
    "Entender como funciona",
    ,
    "Terminado"
];

let t2 = [
    "Practicar el For",
    "Entender como hacerlo",
    hoy,
    "Pendiente"
];

let t3 = [
    "Practicar el While",
    "Entender como funciona",
    "1984-10-10",
    "Pendiente"
];
arrayTareas.push(new Tarea(...t1));
arrayTareas.push(new Tarea(...t2));
arrayTareas.push(new Tarea(...t3));

/*
for (let tarea of arrayTareas) {
    fs.writeFileSync("./tareas.json", JSON.stringify(tarea));
}
*/


function listarTodas(fileURL, estado=null) {
    let arrayTareas = fs.readFileSync(fileURL, "utf-8");
    arrayTareas = JSON.parse(arrayTareas);

    for (let arg of arrayTareas) {
        if (estado === null || arg.estado === estado) {
            console.log("-------------------------");
            for (let tarea in arg) {
                console.log(tarea, arg[tarea]);
            }
        }
    }
}

listarTodas("./tareas.json",);