package com.kr.nb;

import android.os.Bundle;
import android.view.MotionEvent;
import android.view.View;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.appcompat.app.AppCompatActivity;

public class MainWebActivity extends AppCompatActivity {
    private WebView webView;
    private int tapCount = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main_web);

        webView = findViewById(R.id.mainWebView);
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);

        // 加载自定义 JavaScript 脚本
        new JSInjector(this).injectJS(webView);

        webView.setWebViewClient(new WebViewClient());
        webView.loadUrl("https://hx.nobook.com");

        // 设置点击事件
        webView.setOnTouchListener((v, event) -> {
            if (event.getAction() == MotionEvent.ACTION_UP) {
                float x = event.getX();
                float y = event.getY();
                // 检测右下角区域点击
                if (x > webView.getWidth() * 0.7 && y > webView.getHeight() * 0.7) {
                    tapCount++;
                    if (tapCount >= 3) {
                        // 三次点击后返回登录界面
                        Intent intent = new Intent(MainWebActivity.this, LoginWebActivity.class);
                        startActivity(intent);
                        finish();
                    }
                } else {
                    tapCount = 0; // 重置计数
                }
            }
            return false;
        });
    }
}
