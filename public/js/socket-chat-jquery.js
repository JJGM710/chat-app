//funciones para renderizar usuarios
var params = new URLSearchParams(window.location.search);
var nombre = params.get('nombre');
var sala = params.get('sala');
//referenicas de Jquery

var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatbox = $('#divChatbox');

function renderizarMensajes(mensajes, yo) {
	console.log(mensajes);
	var fecha = new Date(mensajes.fecha);
	var hora = fecha.getHours() + ':' + fecha.getMinutes();
	html = '';
	var adminClass = 'info';
	if (mensajes.nombre === 'Administrador') {
		adminClass = 'danger';
	}

	if (yo) {
		html += '	<li class="reverse">';
		html += '		<div class="chat-content">';
		html += '			<h5>' + mensajes.nombre + '</h5>';
		html += '<div class="box bg-light-inverse">' + mensajes.mensaje + '</div>';
		html += '		</div>';
		html += '		<div class="chat-img">';
		html += '			<img src="assets/images/users/5.jpg" alt="user" />';
		html += '		</div>';
		html += '		<div class="chat-time">' + hora + '</div>';
		html += '	</li>';
	} else {
		html +=
			'<li class="animated fadeIn">' +
			'<div class="chat-img">' +
			'<img src="assets/images/users/1.jpg" alt="user" />' +
			'</div>' +
			'<div class="chat-content">' +
			'<h5>' +
			mensajes.nombre +
			'</h5>' +
			'<div class="box bg-light-' +
			adminClass +
			'">' +
			mensajes.mensaje +
			'</div>' +
			'</div>' +
			'<div class="chat-time">' +
			hora +
			'</div>' +
			'</li>';
	}

	divChatbox.append(html);
}

function scrollBottom() {
	// selectors
	var newMessage = divChatbox.children('li:last-child');

	// heights
	var clientHeight = divChatbox.prop('clientHeight');
	var scrollTop = divChatbox.prop('scrollTop');
	var scrollHeight = divChatbox.prop('scrollHeight');
	var newMessageHeight = newMessage.innerHeight();
	var lastMessageHeight = newMessage.prev().innerHeight() || 0;

	if (
		clientHeight + scrollTop + newMessageHeight + lastMessageHeight >=
		scrollHeight
	) {
		divChatbox.scrollTop(scrollHeight);
	}
}

function renderizarUsuarios(personas) {
	console.log(personas);
	var html = '';

	html += '<li>';
	html +=
		'<a href="javascript:void(0)" class="active">Chat de <span>' +
		params.get('sala') +
		'</span></a>';
	html += '</li>';

	for (var i = 0; i < personas.length; i++) {
		html += '<li>';
		html +=
			'<a data-id="' +
			personas[i].id +
			'" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"/><span>' +
			personas[i].nombre +
			'<small class="text-success">online</small></span>';
		html += '</a>';
		html += '</li>';
	}

	divUsuarios.html(html);
}

//listeners

divUsuarios.on('click', 'a', function () {
	//this hace referencia al anchor <a> q</a> que se ha hecho click
	var id = $(this).data('id');
	if (id) {
		console.log(id);
	}
});

formEnviar.on('submit', function (e) {
	e.preventDefault();

	if (txtMensaje.val().trim().length === 0) {
		return;
	}
	socket.emit(
		'enviarMensaje',
		{
			nombre: nombre,
			mensaje: txtMensaje.val(),
		},
		function (resp) {
			console.log('res server', resp);
			txtMensaje.val('').focus();
			renderizarMensajes(resp, true);
			scrollBottom();
		}
	);
});
