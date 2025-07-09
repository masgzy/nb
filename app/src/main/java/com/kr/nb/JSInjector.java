package com.kr.nb;

import android.content.Context;
import android.webkit.WebView;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

public class JSInjector {
    private Context context;

    public JSInjector(Context context) {
        this.context = context;
    }

    public void injectJS(WebView webView) {
        List<String> jsFiles = getJSFiles();
        for (String jsFile : jsFiles) {
            webView.evaluateJavascript(jsFile, null);
        }
    }

    private List<String> getJSFiles() {
        List<String> jsFiles = new ArrayList<>();
        try {
            String[] files = context.getAssets().list("js");
            for (String file : files) {
                if (file.endsWith(".js")) {
                    String jsContent = loadJSFile(file);
                    jsFiles.add(jsContent);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return jsFiles;
    }

    private String loadJSFile(String fileName) throws IOException {
        StringBuilder jsContent = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(context.getAssets().open("js/" + fileName)))) {
            String line;
            while ((line = reader.readLine()) != null) {
                jsContent.append(line).append("\n");
            }
        }
        return jsContent.toString();
    }
}
