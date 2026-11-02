package app.rap.oracion;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(RapVoicePlugin.class);
        super.onCreate(savedInstanceState);
    }
}
