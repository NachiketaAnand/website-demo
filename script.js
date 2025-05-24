const yes = document.querySelector("#yes");
const no = document.querySelector("#no");
const confirmation = document.querySelector(".confirmation");
const container = document.querySelector(".container");
const gifDiv = document.querySelector(".gifimg");
const questionHeading = document.querySelector(".question h1");

const webhookURL = "https://discord.com/api/webhooks/1375771465357594756/2lGc0nRX1UjDLDwhB3ksAHrsXSY2OkG9TUgswoWzhxDnIzfkUm0Wi4ICYsr2m6LuCIfm";

function sendToDiscord(message) {
    fetch(webhookURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ content: message })
    });
}

function yesAnswerMethod() {
    container.style.display = 'none';
    confirmation.style.display = 'block';
    sendToDiscord("🎉 Yay NIK, she clicked YES!");
}

function noAnswerMethod() {
    gifDiv.style.backgroundImage = `url("https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDdtZ2JiZDR0a3lvMWF4OG8yc3p6Ymdvd3g2d245amdveDhyYmx6eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/cLS1cfxvGOPVpf9g3y/giphy.gif")`;
    gifDiv.style.height = "254px";
    gifDiv.style.backgroundSize = "cover";
    no.textContent = "Please 👉🏻👈🏻";
    questionHeading.textContent = "Please please please 💔,  I promise we'll have a great time!!";
    sendToDiscord("😢 NIK, she clicked NO... but there's hope!");
}

yes.addEventListener("click", yesAnswerMethod);
no.addEventListener("click", noAnswerMethod);

document.getElementById("fix").addEventListener("click", function () {
    window.location = "https://wa.me/+918802130983?text=Chalo date pr chalein !!!!!";
});
