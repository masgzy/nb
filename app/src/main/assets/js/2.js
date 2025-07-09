// 创建悬浮窗
function createFloatingWindow() {
  // 创建悬浮窗容器
  const floatingWindow = document.createElement('div');
  floatingWindow.id = 'floatingWindow';
  floatingWindow.style.position = 'fixed';
  floatingWindow.style.top = '50px';
  floatingWindow.style.right = '50px';
  floatingWindow.style.width = '400px';
  floatingWindow.style.height = '300px';
  floatingWindow.style.background = '#fff';
  floatingWindow.style.border = '1px solid #ccc';
  floatingWindow.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
  floatingWindow.style.zIndex = '1000';
  floatingWindow.style.transition = 'transform 0.3s ease, opacity 0.3s ease, width 0.3s ease, height 0.3s ease';

  // 创建悬浮窗头部
  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';
  header.style.padding = '10px';
  header.style.background = '#f1f1f1';
  header.style.borderBottom = '1px solid #ddd';

  // 创建标题
  const title = document.createElement('span');
  title.textContent = '悬浮窗';
  title.style.fontWeight = 'bold';
  header.appendChild(title);

  // 创建按钮容器
  const buttons = document.createElement('div');
  buttons.style.display = 'flex';

  // 创建全屏按钮
  const fullScreenButton = document.createElement('button');
  fullScreenButton.textContent = '全屏';
  fullScreenButton.style.marginRight = '5px';
  fullScreenButton.addEventListener('click', enterFullScreen); // 绑定全屏函数
  buttons.appendChild(fullScreenButton);

  // 创建最小化按钮
  const minimizeButton = document.createElement('button');
  minimizeButton.textContent = '最小化';
  minimizeButton.style.marginRight = '5px';
  minimizeButton.addEventListener('click', () => {
    minimizeWindow(floatingWindow);
  });
  buttons.appendChild(minimizeButton);

  // 创建关闭按钮
  const closeButton = document.createElement('button');
  closeButton.textContent = '关闭';
  closeButton.addEventListener('click', () => {
    floatingWindow.remove();
  });
  buttons.appendChild(closeButton);

  header.appendChild(buttons);
  floatingWindow.appendChild(header);

  // 创建悬浮窗内容区域
  const content = document.createElement('div');
  content.style.flex = '1';
  content.style.padding = '10px';
  content.style.overflow = 'auto';
  content.textContent = '这里是悬浮窗的内容区域';
  floatingWindow.appendChild(content);

  // 将悬浮窗添加到文档中
  document.body.appendChild(floatingWindow);
}

// 全屏与缩放函数
function enterFullScreen() {
  const docEl = document.documentElement;
  const requestFS = docEl.requestFullscreen || docEl.webkitRequestFullscreen;

  if (requestFS) {
    requestFS.call(docEl).then(() => {
      // 执行缩放（网页3的京东案例动画延迟逻辑）
      document.body.style.zoom = '80%';

      // 延迟1秒后执行Canvas和Div调整（网页5的异步操作优化）
      setTimeout(() => {
        // 强制重绘触发（网页3的渲染机制）
        const canvas = document.querySelector('canvas[uri_prefix="libs/chem/"]');
        const div = document.querySelector('.ScrollBar___1sQ2U');

        if (canvas) {
          canvas.setAttribute('height', '1268');
          canvas.setAttribute('width', '2818');
          canvas.style.height = '400px';
          canvas.style.width = '888px';
          void canvas.offsetHeight; // 强制Canvas重绘
        }

        if (div) {
          div.style.maxHeight = '344px';
          void div.offsetHeight;    // 强制Div重绘
        }
      }, 1000); // 关键延迟
    });
  }
}

// 最小化功能
function minimizeWindow(element) {
  element.style.width = '40px';
  element.style.height = '40px';
  element.style.top = '10px';
  element.style.right = '10px';
  element.style.transform = 'scale(0.2)';
  element.style.opacity = '0.5';
}

// 初始化悬浮窗
createFloatingWindow();
