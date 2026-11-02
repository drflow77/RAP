package app.rap.oracion;

import android.content.Context;
import android.media.AudioAttributes;
import android.media.AudioFocusRequest;
import android.media.AudioManager;
import android.os.Build;
import android.os.Bundle;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import com.getcapacitor.JSArray;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

// Lectura en voz del devocional con el motor de voz del teléfono.
// A diferencia del plugin de la comunidad, el audio sale como multimedia
// (USAGE_MEDIA): suena por el altavoz y pasa al Bluetooth del auto, en vez de
// sonar como llamada. También pide el foco de audio para bajar la música
// mientras lee.
@CapacitorPlugin(name = "RapVoice")
public class RapVoicePlugin extends Plugin implements TextToSpeech.OnInitListener {

    private static final String[] LANGS = { "es-MX", "es-US", "es-ES", "es" };

    private TextToSpeech tts;
    private Integer initStatus = null;
    private final List<PluginCall> waitingInit = new ArrayList<>();

    private AudioManager audioManager;
    private AudioFocusRequest focusRequest;
    private final AudioAttributes attributes = new AudioAttributes.Builder()
        .setUsage(AudioAttributes.USAGE_MEDIA)
        .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
        .build();

    // Lectura en curso: se resuelve al terminar el último trozo o al detenerse.
    private PluginCall current;
    private String lastUtteranceId;
    private int run = 0;

    private final AudioManager.OnAudioFocusChangeListener focusListener = (change) -> {
        if (change == AudioManager.AUDIOFOCUS_LOSS || change == AudioManager.AUDIOFOCUS_LOSS_TRANSIENT) {
            // Entró una llamada u otra app tomó el audio
            finish(false);
        }
    };

    @Override
    public void load() {
        audioManager = (AudioManager) getContext().getSystemService(Context.AUDIO_SERVICE);
        tts = new TextToSpeech(getContext(), this);
        tts.setAudioAttributes(attributes);
        tts.setOnUtteranceProgressListener(new UtteranceProgressListener() {
            @Override
            public void onStart(String utteranceId) {}

            @Override
            public void onDone(String utteranceId) {
                if (utteranceId.equals(lastUtteranceId)) finish(true);
            }

            @Override
            public void onError(String utteranceId) {
                if (utteranceId.startsWith(run + ":")) finish(false);
            }
        });
    }

    @Override
    public void onInit(int status) {
        getBridge().executeOnMainThread(() -> {
            initStatus = status;
            for (PluginCall call : waitingInit) speakNow(call);
            waitingInit.clear();
        });
    }

    @PluginMethod
    public void speak(PluginCall call) {
        call.setKeepAlive(true);
        getBridge().executeOnMainThread(() -> {
            if (initStatus == null) waitingInit.add(call);
            else speakNow(call);
        });
    }

    private void speakNow(PluginCall call) {
        if (initStatus != TextToSpeech.SUCCESS) {
            reject(call, "No hay motor de voz disponible");
            return;
        }
        if (!setSpanish()) {
            reject(call, "No hay voz en español");
            return;
        }

        List<String> texts;
        try {
            JSArray arr = call.getArray("texts", new JSArray());
            texts = arr.toList();
        } catch (Exception e) {
            reject(call, "Texto no válido");
            return;
        }
        if (texts.isEmpty()) {
            call.resolve();
            call.release(getBridge());
            return;
        }

        finish(false);
        run++;
        current = call;
        requestFocus();

        tts.setSpeechRate(call.getFloat("rate", 1.0f));
        tts.setPitch(call.getFloat("pitch", 1.0f));
        for (int i = 0; i < texts.size(); i++) {
            String id = run + ":" + i;
            lastUtteranceId = id;
            tts.speak(texts.get(i), i == 0 ? TextToSpeech.QUEUE_FLUSH : TextToSpeech.QUEUE_ADD, new Bundle(), id);
        }
    }

    @PluginMethod
    public void stop(PluginCall call) {
        getBridge().executeOnMainThread(() -> {
            for (PluginCall waiting : waitingInit) {
                waiting.resolve();
                waiting.release(getBridge());
            }
            waitingInit.clear();
            finish(false);
            call.resolve();
        });
    }

    private boolean setSpanish() {
        for (String tag : LANGS) {
            int result = tts.setLanguage(Locale.forLanguageTag(tag));
            if (result != TextToSpeech.LANG_MISSING_DATA && result != TextToSpeech.LANG_NOT_SUPPORTED) return true;
        }
        return false;
    }

    // Termina la lectura en curso (si la hay), suelta el foco de audio y
    // resuelve la llamada de JS para que el botón vuelva a su estado.
    private synchronized void finish(boolean completed) {
        PluginCall call = current;
        current = null;
        lastUtteranceId = null;
        if (!completed && tts != null) tts.stop();
        abandonFocus();
        if (call != null) {
            call.resolve();
            call.release(getBridge());
        }
    }

    private void reject(PluginCall call, String message) {
        call.reject(message);
        call.release(getBridge());
    }

    private void requestFocus() {
        if (audioManager == null) return;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            focusRequest = new AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK)
                .setAudioAttributes(attributes)
                .setOnAudioFocusChangeListener(focusListener)
                .build();
            audioManager.requestAudioFocus(focusRequest);
        } else {
            audioManager.requestAudioFocus(focusListener, AudioManager.STREAM_MUSIC, AudioManager.AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK);
        }
    }

    private void abandonFocus() {
        if (audioManager == null) return;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            if (focusRequest != null) audioManager.abandonAudioFocusRequest(focusRequest);
            focusRequest = null;
        } else {
            audioManager.abandonAudioFocus(focusListener);
        }
    }

    @Override
    protected void handleOnDestroy() {
        finish(false);
        if (tts != null) tts.shutdown();
    }
}
