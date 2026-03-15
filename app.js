const API_URL="https://script.google.com/macros/s/AKfycbwH-ghyfJ8ZsqwxjldLIOaneLadbBhy2Fq_9RDJMe8RQxREN2YEB8EHDbZiw5xCJQe-/exec";

let deferredPrompt;

window.addEventListener("load",()=>{

if("serviceWorker" in navigator){

navigator.serviceWorker.register("./sw.js")

}

})

window.addEventListener("beforeinstallprompt",(e)=>{

e.preventDefault()

deferredPrompt=e

document.getElementById("installBtn").style.display="block"

})

function installApp(){

deferredPrompt.prompt()

deferredPrompt.userChoice.then(()=>{

deferredPrompt=null

})

}

async function loadData(){

const res=await fetch(API_URL)

const data=await res.json()

console.log(data)

}

loadData()