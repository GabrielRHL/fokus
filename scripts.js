const html = document.querySelector('html')
const focusBtn = document.querySelector('.app__card-button--foco')
const shortRestBtn = document.querySelector('.app__card-button--curto')
const longRestBtn = document.querySelector('.app__card-button--longo')
const principalImage = document.querySelector('.app__image')
const text = document.querySelector('.app__title')
const buttons = document.querySelectorAll('.app__card-button')
const startPauseBtn = document.querySelector('#start-pause')
const finishBtn = document.querySelector('.app__card-secondary-button')
const changeBtnText = document.querySelector('#start-pause span')
const changeBtnImage = document.querySelector('.app__card-primary-butto-icon')
const timerOnScreen = document.querySelector('#timer')

let time = 1500
let gap = null

const musicBtn = document.querySelector('#alternar-musica')
const music = new Audio('/sons/luna-rise-part-one.mp3')
music.loop = true
music.volume = 0.2

const sound = new Audio('/sons/play.wav')
sound.volume = 0.1

musicBtn.addEventListener('change', () => {
    if (music.paused) {
        music.play()
    } else {
        music.pause()
    }
})

focusBtn.addEventListener('click', () => {
    time = 1500
    contextChange('foco')
    focusBtn.classList.add('active')
})

shortRestBtn.addEventListener('click', () => {
    time = 300
    contextChange('descanso-curto')
    shortRestBtn.classList.add('active')
})

longRestBtn.addEventListener('click', () => {
    time = 900
    contextChange('descanso-longo')
    longRestBtn.classList.add('active')
})

function contextChange(context) {
    displayTime()
    buttons.forEach(function (context) {
        context.classList.remove('active')
    })

    html.setAttribute('data-contexto', context)
    principalImage.setAttribute('src', `/imagens/${context}.png`)
    switch (context) {
        case 'foco': text.innerHTML = `
            Otimize sua produtividade,<br>
            <strong class="app__title-strong">mergulhe no que importa.</strong>
        `   
            break;
        case 'descanso-curto': text.innerHTML = `
            Que tal dar uma respirada? <strong class="app__title-strong">Faça uma pausa curta.</strong>
        `
            break;
        case 'descanso-longo': text.innerHTML = `
        Hora de voltar à superfície. <strong class="app__title-strong">Faça uma pausa longa.</strong>
        `
        default:
            break;
    }
}

const countdown = () => {
    if (time <= 0) {
        alert('Tempo finalizado')
        const focusEnd = html.getAttribute('data-contexto') == 'foco'
        if (focusEnd) {
            const event = new CustomEvent('FinishedFocus')
            document.dispatchEvent(event)
        }
        gapClear()
        resetTime()
        return
    }
    time -= 1
    displayTime()
}

function resetTime() {
    const context = html.getAttribute('data-contexto');
    switch (context) {
        case 'foco':
            time = 1500;
            break;
        case 'descanso-curto':
            time = 300;
            break;
        case 'descanso-longo':
            time = 900;
            break;
        default:
            time = 1500;
            break;
    }
    displayTime();
}

startPauseBtn.addEventListener('click', () => {
    startOrPause()
    sound.play()
})

function startOrPause() {
    if(gap) {
        gapClear()
        return
    }
    gap = setInterval(countdown, 1000)
    changeBtnText.textContent = 'Pausar'
    changeBtnImage.setAttribute('src', '/imagens/pause.png')
    finishBtn.classList.remove('hidden')
}

function gapClear() {
    clearInterval(gap)
    changeBtnText.textContent = 'Começar'
    changeBtnImage.setAttribute('src', '/imagens/play_arrow.png')
    finishBtn.classList.add('hidden')
    gap = null
}

function displayTime() {
    const t = new Date(time * 1000)
    formatTime = t.toLocaleTimeString('pt-br', {minute: '2-digit', second: '2-digit'})
    timerOnScreen.innerHTML = `${formatTime}`
}

displayTime()

finishBtn.addEventListener('click', () => {
    time = 0;
    displayTime()
})