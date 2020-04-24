
var debug = true;
var clientSettings = {};
var clientSettingsPath = "./settings.json";

if (fs.existsSync(clientSettingsPath)) {
    loadClientSettings();
} else {
    initSettings();
}
function saveClientSettings() {
    DB.save(clientSettingsPath, clientSettings);
}
function initSettings() {
    if (!clientSettings.hasOwnProperty("debug")) {
        clientSettings.debug = false;
    }
    if (!clientSettings.hasOwnProperty("accentColor")) {
        clientSettings.accentColor = {
            "r": 50,
            "g": 50,
            "b": 50,
            "a": 0.9
        };
    }
    if (!clientSettings.hasOwnProperty("rainbowEnabled")) {
        clientSettings.rainbowEnabled = true;
    }
    if (!clientSettings.hasOwnProperty("devToolsOnStartup")) {
        clientSettings.devToolsOnStartup = false;
    }
    if (!clientSettings.hasOwnProperty("ip")) {
        clientSettings.ip = "0.0.0.0";
    }
    if (!clientSettings.hasOwnProperty("quality")) {
        clientSettings.quality = 5;
    }
    if (!clientSettings.hasOwnProperty("firstInstall")) {
        clientSettings.firstInstall = false;
    }
    applyClientSettings();
}
function loadClientSettings() {
    clientSettings = DB.load(clientSettingsPath);
    initSettings();
    saveClientSettings();
}

function applyClientSettings() {
    $("#debugEnabled").prop("checked", clientSettings.debug);
    $("#rainbowEnabled").prop("checked", clientSettings.rainbowEnabled);
    $("#devToolsOnStartup").prop("checked", clientSettings.devToolsOnStartup);
    $("#autoStart").prop("checked", clientSettings.autoStartStreamer);
    $("#qualitySlider").val(clientSettings.quality);
    $('#qualityLabel').html("Quality: " + clientSettings.quality + "Mbps");
    $("#ipInput").val(clientSettings.ip);
    if (clientSettings.debug) {
        $("#dev-btn").fadeIn(400);
        $("#rld-btn").fadeIn(400);
    } else {
        $("#dev-btn").fadeOut(400);
        $("#rld-btn").fadeOut(400);
    }
    if (clientSettings.rainbowEnabled) {
        rainbowAccent();
    } else {
        setAccentColor(clientSettings.accentColor.r, clientSettings.accentColor.g, clientSettings.accentColor.b, clientSettings.accentColor.a);
    }
    if (clientSettings.devToolsOnStartup) {
        openDevTools();
    }
    if (!clientSettings.firstInstall) {
        ipcRenderer.send('installScpVBus');
        ipcRenderer.send('installAudioDriver');
        clientSettings.firstInstall = true;
        saveClientSettings();
    }
    if (clientSettings.autoStartStreamer) {
        connect();
    }
}

$("#rainbowEnabled").on('change', function () {
    clientSettings.rainbowEnabled = $("#rainbowEnabled").prop("checked");
    saveClientSettings();
    applyClientSettings();
});
$("#autoStart").on('change', function () {
    clientSettings.autoStartStreamer = $("#autoStart").prop("checked");
    saveClientSettings();
    applyClientSettings();
});
// $("#debugEnabled").on('change', function () {
//     clientSettings.debug = $("#debugEnabled").prop("checked");
//     saveClientSettings();
//     applyClientSettings();
// });
// $("#devToolsOnStartup").on('change', function () {
//     clientSettings.devToolsOnStartup = $("#devToolsOnStartup").prop("checked");
//     saveClientSettings();
//     applyClientSettings();
// });

$('#installScpVBusBtn').click(function () {
    ipcRenderer.send('installScpVBus');
});
$('#unInstallScpVBusBtn').click(function () {
    ipcRenderer.send('unInstallScpVBus');
});
$('#installAudioDriverBtn').click(function () {
    ipcRenderer.send('installAudioDriver');
});
$('#unInstallAudioDriverBtn').click(function () {
    ipcRenderer.send('unInstallAudioDriver');
});

$("#settings-btn").click(function () {
    $(".contentArea").hide();
    $("#settings").fadeIn(400);
    $('#settings-btn').tooltip('hide');
});
