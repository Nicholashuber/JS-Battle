import {_sseState, connect, getUserName, setUserName} from "./net/messaging";
import {isAnyKeyDown, updateInput} from "./utils/input";
import {termPrint} from "./graphics/ui";
import {createSplashState, resetGame, updateTestGame} from "./game/game";
import {loadAtlas} from "./assets/gfx";
import {play} from "./audio/context";
import {updateFpsMeter} from "./utils/fpsMeter";
import {Snd, snd} from "./assets/sfx";

// initDraw2d();

const enum StartState {
    Loading = 0,
    TapToConnect = 1,
    Connecting = 2,
    Connected = 3,
}

let state = StartState.Loading;

const goToSplash = () => {
    state = StartState.TapToConnect;
    createSplashState();
}

new FontFace("e", `url(e.ttf),local(Arial)`).load().then((font) => {
    document.fonts.add(font);
    loadAtlas();
    goToSplash();
    if (!getUserName()) {
        const defaultName = "guest";
        setUserName(prompt("pick your name", defaultName) || defaultName);
    }
});

const raf = (ts: DOMHighResTimeStamp) => {
    ts /= 1000;
    //** DO FRAME **//
    l.innerText = updateFpsMeter(ts) + "\n";

    switch (state) {
        case StartState.TapToConnect:
            updateTestGame(ts);

            if (isAnyKeyDown()) {
                resetGame();
                state = StartState.Connecting;
                connect();
            }
            break;
        case StartState.Loading:
        case StartState.Connecting:
            termPrint("╫╪"[ts * 9 & 0x1]);
            if (_sseState == 2) {
                state = StartState.Connected;
                play(snd[Snd.bgm], 0.5, 0, true);
            }
            break;
        default:
            updateTestGame(ts);
            if (!_sseState) {
                snd[Snd.bgm].currentSource_?.stop();
                goToSplash();
            }
            break;
    }

    updateInput();
    requestAnimationFrame(raf);
}

raf(0);
