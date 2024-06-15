//importar AI
//import { CreateMLCEngine } from "https://esm.run/@mlc-ai/web-llm"; --> sin workers
import { CreateWebWorkerMLCEngine } from "https://esm.run/@mlc-ai/web-llm"

//crear jquery
const $ = (el) => document.querySelector(el);

//pongo delante de la variable un símbolo de $
// para indicar que es un elemnto del DOM

const $form = $("form");
const $input = $("input");
const $template = $("#message-template");
const $messages = $("ul");
const $container = $("main");
const $button = $("button");
//const $info = $("small");
const $loading = $('.loading')

let messages = [];

//cargar modelo
const SELECTED_MODEL = "Llama-3-8B-Instruct-q4f32_1-MLC-1k";
//Llama-3-8B-Instruct-q4f32_1-MLC-1k  gemma-2b-it-q4f32_1-MLC

/*
const engine = await CreateMLCEngine(SELECTED_MODEL, {
  initProgressCallback: (info) => {
    //console.log("initProgressCallback", info);
    $info.textContent = `${info.text}%`;
    if (info.progress == 1) {
      $button.disabled = false;
    }
  },
});*/

const engine = await CreateWebWorkerMLCEngine(
    new Worker('./worker.js', { type: 'module' }),
    SELECTED_MODEL,
    {
      initProgressCallback: (info) => {
        //$info.textContent = `${info.text}%`
        console.log(info.text)
        if (info.progress === 1) {
          $loading.parentNode.removeChild($loading)
          $button.removeAttribute('disabled')
          addMessage("¡Hola! Soy un ChatGPT que se ejecuta completamente en tu navegador. ¿En qué puedo ayudarte hoy?", 'bot')
          $input.focus()
        }
      }
    }
  )

$form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const messageText = $input.value.trim();

  if (messageText != "") {
    //resetear el input
    $input.value = "";
  }

  //añadimos el mensaje en el DOM
  addMessage(messageText, "user");
  $button.setAttribute("disabled", "");

  const userMessage = {
    role: "user",
    content: messageText,
  };

  messages.push(userMessage);

  const chuncks = await engine.chat.completions.create({
    messages,
    stream: true,
  });

  let reply = "";

  const $botMessage = addMessage("", "bot");

  for await (const chunck of chuncks) {
    const [choice] = chunck.choices;
    //const choice = chunk.choices[0]
    const content = choice?.delta?.content ?? "";
    reply += content;
    $botMessage.textContent = reply;
  }

  $button.removeAttribute("disabled");
  //const botMessage = reply.choices[0].message
  messages.push({
    role: "assistant",
    content: reply,
  });
  //situar a la altura del scroll total
  $container.scrollTop = $container.scrollHeight;
});

function addMessage(text, sender) {
  //clonar el template
  const clonedTemplate = $template.content.cloneNode(true);
  const $newMessage = clonedTemplate.querySelector(".message");
  const $who = $newMessage.querySelector("span");
  const $text = $newMessage.querySelector("p");

  $text.textContent = text;
  $who.textContent = sender == "bot" ? "GPT" : "Tú";
  $newMessage.classList.add(sender);

  //actualizar el scroll para ir bajando

  //meterlo en el DOM
  $messages.appendChild($newMessage);
  //situar a la altura del scroll total
  $container.scrollTop = $container.scrollHeight;

  return $text;
}
