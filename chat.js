//crear jquery
const $ = (el) => document.querySelector(el);

//pongo delante de la variable un símbolo de $
// para indicar que es un elemnto del DOM

const $form = $('form');
const $input = $('input');
const $template = $('#message-template');
const $messages = $('ul');
const $container = $('main');
const $button = $('button');

$form.addEventListener('submit', (e) => {
  e.preventDefault();
  const messageText = $input.value.trim();

  if (messageText != "") {
    //añadimos el mensaje en el DOM
    addMessage(messageText, 'user')
    //resetear el input
    $input.value = "";
  }

  
});

function addMessage(text, sender) {
  //clonar el template
  const clonedTemplate = $template.content.cloneNode(true);
  const $newMessage = clonedTemplate.querySelector(".message");
  const $who = $newMessage.querySelector("span");
  const $text = $newMessage.querySelector("p");

  $text.textContent = text;
  $who.textContent = sender == 'bot' ? 'GPT' : 'Tú';
  $newMessage.classList.add(sender);

  //actualizar el scroll para ir bajando

  //meterlo en el DOM
  $messages.appendChild($newMessage);
  //situar a la altura del scroll total
  $container.scrollTop = $container.scrollHeight;
}
