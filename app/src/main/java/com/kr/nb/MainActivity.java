package com.kr.nb;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    private static final String PREFS_NAME = "MyAppPrefs";
    private static final String PREF_FIRST_RUN = "isFirstRun";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        SharedPreferences prefs = getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
        boolean isFirstRun = prefs.getBoolean(PREF_FIRST_RUN, true);

        if (isFirstRun) {
            // 第一次运行，跳转到登录界面
            SharedPreferences.Editor editor = prefs.edit();
            editor.putBoolean(PREF_FIRST_RUN, false);
            editor.apply();
            Intent intent = new Intent(MainActivity.this, LoginWebActivity.class);
            startActivity(intent);
        } else {
            // 非第一次运行，跳转到主界面
            Intent intent = new Intent(MainActivity.this, MainWebActivity.class);
            startActivity(intent);
        }

        finish(); // 关闭 MainActivity
    }
}
