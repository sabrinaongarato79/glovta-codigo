package com.glovta.app;

import android.app.Activity;
import android.os.Bundle;
import android.graphics.drawable.GradientDrawable;
import android.graphics.Typeface;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;

public final class MainActivity extends Activity {
    private static final int NAVY = 0xFF031229;
    private static final int NAVY_SURFACE = 0xFF08244A;
    private static final int CYAN = 0xFF22D3EE;
    private static final int TEXT = 0xFFF8FBFF;
    private static final int MUTED = 0xFFCBD5E1;

    @Override
    protected void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().setStatusBarColor(NAVY);

        getWindow().setNavigationBarColor(NAVY);

        ScrollView scroll = new ScrollView(this);
        scroll.setBackground(new GradientDrawable(GradientDrawable.Orientation.TOP_BOTTOM,
                new int[] {NAVY_SURFACE, NAVY}));
        LinearLayout content = new LinearLayout(this);
        content.setOrientation(LinearLayout.VERTICAL);
        int padding = Math.round(24 * getResources().getDisplayMetrics().density);
        content.setPadding(padding, padding, padding, padding);

        TextView brand = new TextView(this);
        brand.setText("GLOVTA");
        brand.setTextColor(CYAN);
        brand.setTextSize(16);
        brand.setTypeface(null, Typeface.BOLD);
        brand.setLetterSpacing(0.14f);
        content.addView(brand);

        TextView title = new TextView(this);
        title.setText("Tu próximo paso.\nSin fronteras.");
        title.setPadding(0, padding, 0, 0);
        if (android.os.Build.VERSION.SDK_INT >= 28) title.setAccessibilityHeading(true);
        title.setTextColor(TEXT);
        title.setTextSize(36);
        title.setTypeface(null, Typeface.BOLD);
        content.addView(title);

        TextView description = new TextView(this);
        description.setText("Empleabilidad y formación para avanzar en tu carrera.");
        description.setTextSize(18);
        description.setTextColor(MUTED);
        description.setPadding(0, padding, 0, 0);
        content.addView(description);
        TextView emailLabel = new TextView(this);
        emailLabel.setText("Correo electrónico");
        emailLabel.setTextColor(TEXT);
        emailLabel.setPadding(0, padding, 0, 0);
        content.addView(emailLabel);
        android.widget.EditText email = new android.widget.EditText(this);
        email.setId(android.view.View.generateViewId());
        emailLabel.setLabelFor(email.getId());
        email.setTextColor(TEXT);
        email.setSingleLine(true);
        email.setInputType(android.text.InputType.TYPE_CLASS_TEXT
                | android.text.InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS);
        email.setMinHeight(Math.round(56 * getResources().getDisplayMetrics().density));
        content.addView(email);
        TextView passwordLabel = new TextView(this);
        passwordLabel.setText("Contraseña");
        passwordLabel.setTextColor(TEXT);
        content.addView(passwordLabel);
        android.widget.EditText password = new android.widget.EditText(this);
        password.setId(android.view.View.generateViewId());
        passwordLabel.setLabelFor(password.getId());
        password.setTextColor(TEXT);
        password.setSingleLine(true);
        password.setSaveEnabled(false);
        password.setInputType(android.text.InputType.TYPE_CLASS_TEXT
                | android.text.InputType.TYPE_TEXT_VARIATION_PASSWORD);
        password.setMinHeight(Math.round(56 * getResources().getDisplayMetrics().density));
        content.addView(password);
        android.widget.Button login = new android.widget.Button(this);
        login.setText("Iniciar sesión");
        login.setTextColor(NAVY);
        login.setBackgroundTintList(android.content.res.ColorStateList.valueOf(CYAN));
        content.addView(login);
        TextView feedback = new TextView(this);
        feedback.setTextColor(TEXT);
        feedback.setTextSize(16);
        feedback.setAccessibilityLiveRegion(android.view.View.ACCESSIBILITY_LIVE_REGION_POLITE);
        content.addView(feedback);
        login.setOnClickListener(view -> {
            String address = email.getText().toString().trim();
            String secret = password.getText().toString();
            if (!android.util.Patterns.EMAIL_ADDRESS.matcher(address).matches()) {
                email.setError("Ingresá un correo válido.");
                email.requestFocus();
                return;
            }
            if (secret.isEmpty()) {
                password.setError("Ingresá tu contraseña.");
                password.requestFocus();
                return;
            }
            login.setEnabled(false);
            feedback.setText("Verificando acceso…");
            new Thread(() -> {
                String message;
                try {
                    org.json.JSONObject profile = AuthClient.loadProfile(AuthClient.signIn(address, secret));
                    runOnUiThread(() -> {
                        if (isDestroyed() || isFinishing()) return;
                        password.setText("");
                        content.removeAllViews();
                        content.addView(brand);
                        title.setText(profile == null ? "Mi perfil" : profile.optString("full_name"));
                        content.addView(title);
                        if (profile == null) {
                            description.setText("Completá tu presentación en el portal de Glovta.");
                            content.addView(description);
                        } else {
                            for (String field : new String[]{"headline","location","bio"}) {
                                String value = profile.optString(field);
                                if (value.trim().isEmpty()) continue;
                                TextView text = new TextView(this);
                                text.setText(value);
                                text.setTextColor(TEXT);
                                text.setTextSize(18);
                                text.setPadding(0,padding,0,padding);
                                content.addView(text);
                            }
                        }
                        android.widget.Button logout = new android.widget.Button(this);
                        logout.setText("Cerrar sesión");
                        logout.setOnClickListener(v -> recreate());
                        content.addView(logout);
                    });
                    return;
                } catch (java.io.IOException error) {
                    message = "No se pudo conectar. Revisá tu conexión e intentá nuevamente.";
                } catch (Exception error) {
                    message = error.getMessage();
                }
                final String result = message;
                runOnUiThread(() -> {
                    if (isDestroyed()) return;
                    login.setEnabled(true);
                    password.setText("");
                    feedback.setText(result);
                });
            }, "glovta-login").start();
        });
        scroll.addView(content);
        setContentView(scroll);
    }
}

