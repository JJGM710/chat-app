var socket = io();
var params = new URLSearchParams(window.location.search);

if (!params.has('nombre') || !params.has('sala')) {
	window.location = 'index.html';
	throw new Error('El nombre es necesario');
}

var usuario = {
	nombre: params.get('nombre'),
	sala: params.get('sala'),
};

socket.on('connect', function () {
	console.log('Conectado al servidor');

	socket.emit('entrarChat', usuario, (resp) => {
		console.log('usuarios conectados', resp);
	});
});

// escuchar
socket.on('disconnect', function () {
	console.log('Perdimos conexión con el servidor');
});

// Escuchar información de cuaqluier mensaje enviado
socket.on('crearMensaje', function (mensaje) {
	console.log('Servidor:', mensaje);
});

// Escuchar cambios de usuarios
socket.on('listaPersonas', function (usuarios) {
	console.log(usuarios);
});

//Mensajes Privados
socket.on('mensajePrivado', function (mensaje) {
	console.log('Mensaje Privado:', mensaje);
});
