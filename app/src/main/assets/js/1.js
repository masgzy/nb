// ==UserScript==
// @name         NB实验VIP修改器（修复）
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  模拟NB实验室vip状态
// @author       MCHR
// @match        https://*.nobook.com/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // 日志工具
    const log = (...args) => {
        console.log('%c[VIP修改器]', 'color: #ff5722; font-weight: bold;', ...args);
    };

    // 配置参数
    const CONFIG = {
        TARGET_VIP: {
            vip: 1,
            vip_endtime: 4102329600,
            school_vip_endtime: 4102329600
        },
        TARGET_API: 'storage-backend.nobook.com/passport/v5/login/check'
    };

    log('脚本初始化开始');

    // ================ 时间戳控制 ================
    const TimeStampManager = (function() {
        const originalDateNow = Date.now;
        const originalGetTime = Date.prototype.getTime;
        let isHooked = false;
        let fixedTimestamp = Date.now();

        return {
            hook: function() {
                if (isHooked) return;
                fixedTimestamp = Date.now();
                Date.now = () => fixedTimestamp;
                Date.prototype.getTime = () => fixedTimestamp;
                isHooked = true;
                log(`时间戳已锁定: ${fixedTimestamp}`);
            },
            restore: function() {
                if (!isHooked) return;
                Date.now = originalDateNow;
                Date.prototype.getTime = originalGetTime;
                isHooked = false;
                log('时间戳已恢复');
            },
            getTimestamp: function() {
                return fixedTimestamp;
            }
        };
    })();

    // 立即启用时间戳Hook
    TimeStampManager.hook();

    // ================ 加密函数 ================
    function encryptVIPData(data) {
        const we = TimeStampManager.getTimestamp().toString();
        const key = CryptoJS.enc.Utf8.parse(CryptoJS.MD5(we).toString());
        const iv = CryptoJS.lib.WordArray.random(16);
        
        log(`正在加密数据，使用时间戳: ${we}`);
        
        const encrypted = CryptoJS.AES.encrypt(
            CryptoJS.enc.Utf8.parse(JSON.stringify(data)),
            key,
            { 
                iv: iv, 
                mode: CryptoJS.mode.CBC, 
                padding: CryptoJS.pad.Pkcs7 
            }
        );
        
        return iv.concat(encrypted.ciphertext).toString(CryptoJS.enc.Base64);
    }

    // ================ 请求拦截 ================
    function setupRequestInterceptors() {
        // Fetch拦截
        const originalFetch = window.fetch;
        window.fetch = async function(input, init) {
            const url = typeof input === 'string' ? input : input?.url;
            
            if (url?.includes(CONFIG.TARGET_API)) {
                log('拦截到目标请求');
                const response = await originalFetch.apply(this, arguments);
                
                try {
                    const responseData = await response.clone().json();
                    
                    // 修改VIP信息
                    if (responseData.vip_info) {
                        Object.keys(responseData.vip_info).forEach(key => {
                            responseData.vip_info[key] = {...CONFIG.TARGET_VIP};
                        });
                        log('VIP状态已升级');
                    }
                    
                    // 加密数据
                    responseData.encrypt_data = encryptVIPData({
                        user_id: responseData.user_id,
                        vip_info: responseData.vip_info
                    });
                    
                    // 停止时间戳Hook
                    TimeStampManager.restore();
                    
                    return new Response(JSON.stringify(responseData), {
                        status: response.status,
                        headers: response.headers
                    });
                } catch (e) {
                    log('处理失败:', e);
                    TimeStampManager.restore();
                    return response;
                }
            }
            return originalFetch.apply(this, arguments);
        };

        // XHR拦截
        const originalXHROpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            this._requestUrl = url;
            return originalXHROpen.apply(this, arguments);
        };

        const originalXHRSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function(body) {
            if (this._requestUrl?.includes(CONFIG.TARGET_API)) {
                log('拦截到XHR请求');
                
                const originalOnReadyStateChange = this.onreadystatechange;
                this.onreadystatechange = function() {
                    if (this.readyState === 4) {
                        try {
                            const responseData = JSON.parse(this.responseText);
                            if (responseData.vip_info) {
                                Object.keys(responseData.vip_info).forEach(key => {
                                    responseData.vip_info[key] = {...CONFIG.TARGET_VIP};
                                });
                                
                                responseData.encrypt_data = encryptVIPData({
                                    user_id: responseData.user_id,
                                    vip_info: responseData.vip_info
                                });
                                
                                Object.defineProperty(this, 'responseText', {
                                    value: JSON.stringify(responseData),
                                    writable: false
                                });
                                
                                // 停止时间戳Hook
                                TimeStampManager.restore();
                            }
                        } catch (e) {
                            log('XHR处理失败:', e);
                            TimeStampManager.restore();
                        }
                    }
                    originalOnReadyStateChange?.apply(this, arguments);
                };
            }
            originalXHRSend.apply(this, arguments);
        };
    }

    // ================ 安全DOM操作 ================
    function showStatusIndicator() {
        const checkDOM = () => {
            if (document.body) {
                const indicator = document.createElement('div');
                indicator.style.cssText = `
                    position: fixed;
                    bottom: 20px;
                    left: 20px;
                    background: linear-gradient(135deg, #4CAF50, #2E7D32);
                    color: white;
                    padding: 10px 20px;
                    border-radius: 30px;
                    font-size: 14px;
                    font-weight: bold;
                    z-index: 99999;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                    animation: fadeIn 0.5s ease-out;
                `;
                indicator.textContent = `✅ VIP修改器已激活 | 时间戳: ${TimeStampManager.getTimestamp()}`;
                document.body.appendChild(indicator);
                
                setTimeout(() => {
                    indicator.style.transition = 'opacity 1s';
                    indicator.style.opacity = '0';
                    setTimeout(() => indicator.remove(), 1000);
                }, 3000);
            } else {
                setTimeout(checkDOM, 100);
            }
        };
        checkDOM();
    }

    // ================ 初始化 ================
    setupRequestInterceptors();
    showStatusIndicator();
    log('初始化完成');
})();