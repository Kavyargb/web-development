const htmlCode = document.getElementById('html-code');
const cssCode = document.getElementById('css-code');
const jsCode = document.getElementById('js-code');
const preview = document.getElementById('preview');
const codePanes = document.querySelectorAll('.code-input');
const tabBtns = document.querySelectorAll('.tab');
const lineNumbers = document.querySelector('.line-numbers');
const themeToggle = document.getElementById('theme-toggle');
const appContainer = document.querySelector('.app-container');
const body = document.querySelector('body');
const fullScreenToggle = document.getElementById('full-screen-toggle');
const container = document.querySelector('.app-container');

let isFullScreen = false;
// Update Preview Function
const updatePreview = () => {
    const html = htmlCode.value;
    const css = `<style>${cssCode.value}</style>`;
    const js = `<script>${jsCode.value}</script>`;
    const combined = `<!DOCTYPE html><html><head>${css}</head><body>${html}${js}</body></html>`;

    preview.srcdoc = combined;
};

// Function to debounce updates
const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
};

// Debounced updates for efficiency
const debouncedUpdate = debounce(updatePreview, 200);
const updateLineNumbers = () => {
    let lines = htmlCode.value.split('\n').length;
    lineNumbers.innerText = Array.from({length:lines}, (_,i)=> i+1).join("\n");
}
// Event Listeners
codePanes.forEach(codePane => {
  codePane.addEventListener('input', () => {
    updateLineNumbers();
    debouncedUpdate();
});
});
tabBtns.forEach(tab => {
    tab.addEventListener('click', function(){
    const codeType = this.getAttribute('data-code');
        tabBtns.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        codePanes.forEach(pane => {
          pane.classList.remove('active');
          if (pane.id === `${codeType}-code`){
              pane.classList.add('active');
          }
        });
        updateLineNumbers();
    });
});

// Theme toggle functionality
themeToggle.addEventListener('click', function() {
    body.classList.toggle('dark-theme');
    appContainer.classList.toggle('dark-theme');
    document.querySelectorAll('.code-input').forEach(el => el.classList.toggle('dark-theme'));
    document.querySelector('.code-area .line-numbers').classList.toggle('dark-theme');
    document.querySelectorAll('.editor-header .tab.active').forEach(el => el.classList.toggle('dark-theme'));
    document.querySelector('.preview-pane').classList.toggle('dark-theme')
    document.querySelector('footer').classList.toggle('dark-theme');
    document.querySelector('.app-header').classList.toggle('dark-theme');
})
//Full screen toggle functionality
fullScreenToggle.addEventListener('click', function(){
    isFullScreen = !isFullScreen;
    if(isFullScreen){
      container.classList.add('full-screen');
    } else {
      container.classList.remove('full-screen');
    }
    fullScreenToggle.innerHTML = isFullScreen ? '<i class="fas fa-compress"></i>' : '<i class="fas fa-expand"></i>';
})

//Initial setup and first update
updateLineNumbers();
updatePreview();
