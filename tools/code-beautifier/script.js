document.addEventListener('DOMContentLoaded', function() {
    const inputArea = document.getElementById('code-input');
    const outputArea = document.getElementById('code-output');
    const beautifyButton = document.getElementById('beautify-btn');
    const minifyButton = document.getElementById('minify-btn');
    const copyButtons = document.querySelectorAll('.copy-code-btn');
    const downloadButton = document.querySelector('.download-code-btn');
    const notificationContainer = document.getElementById('notification-container');

    beautifyButton.addEventListener('click', function() {
       try {
        const code = inputArea.value;
        const language = detectLanguage(code);
        let formattedCode;

        switch (language) {
            case 'html':
                formattedCode = beautifyHTML(code);
                 break;
            case 'css':
                 formattedCode = beautifyCSS(code);
                 break;
            case 'json':
                 formattedCode = beautifyJSON(code);
                 break;
            case 'python':
                 formattedCode = beautifyPython(code);
                 break;
            default: // javascript
                formattedCode = beautifyCode(code);
        }
        outputArea.textContent = formattedCode;
         } catch (error) {
          showNotification('Error during beautifying.', 'error');
        }
    });

    minifyButton.addEventListener('click', function(){
        try {
          const code = inputArea.value;
          const language = detectLanguage(code);
          let minifiedCode;

           switch(language) {
               case 'html':
                 minifiedCode = minifyHTML(code);
                 break;
                case 'css':
                  minifiedCode = minifyCSS(code);
                  break;
                case 'json':
                     minifiedCode = minifyJSON(code);
                     break;
                case 'python':
                   minifiedCode = minifyPython(code);
                     break;
                default: // javascript
                   minifiedCode = minifyCode(code);
           }
           outputArea.textContent = minifiedCode;
       } catch (error) {
            showNotification('Error during minifying.', 'error');
        }
    });

    copyButtons.forEach(button => {
        button.addEventListener('click', function(){
            const codeToCopy = this.previousElementSibling.querySelector('code').textContent;
            copyCode(codeToCopy);
        });
    });

    downloadButton.addEventListener('click', function() {
        try {
            const code = outputArea.textContent;
            const language = detectLanguage(inputArea.value);
            let fileExtension;
              switch(language){
                  case 'html':
                    fileExtension = 'html';
                    break;
                    case 'css':
                        fileExtension = 'css';
                        break;
                   case 'json':
                    fileExtension = 'json';
                    break;
                   case 'python':
                    fileExtension = 'py';
                    break;
                   default:
                    fileExtension = 'js';
            }

            downloadCode(code, `code.${fileExtension}`);
            showNotification('Code downloaded successfully!', 'success');
        } catch(error) {
             showNotification('Error during download.', 'error');
         }
    });

     function detectLanguage(code) {
        const trimmedCode = code.trimStart();

          if(trimmedCode.startsWith('<!DOCTYPE html>') || trimmedCode.startsWith('<html')) {
            return 'html';
          } else if(trimmedCode.startsWith('{') || trimmedCode.startsWith('[')){
              try {
                  JSON.parse(trimmedCode);
                  return 'json';
              } catch (e){

              }
          } else if(trimmedCode.startsWith('/*') || trimmedCode.startsWith('.') || trimmedCode.startsWith('#') || trimmedCode.startsWith('@') || trimmedCode.startsWith('body') || trimmedCode.startsWith('div')){
                return 'css';
          } else if(trimmedCode.startsWith('def ') || trimmedCode.startsWith('import ') || trimmedCode.startsWith('class ' ) || trimmedCode.startsWith('from ') || trimmedCode.startsWith('print(') || trimmedCode.startsWith('if ') || trimmedCode.startsWith('while ') || trimmedCode.startsWith('for ') || trimmedCode.startsWith('try ') || trimmedCode.startsWith('except ') || trimmedCode.startsWith('finally ') || trimmedCode.startsWith('with ') || trimmedCode.startsWith('return ') || trimmedCode.startsWith('raise ') || trimmedCode.startsWith('assert ') || trimmedCode.startsWith('break ') || trimmedCode.startsWith('continue ') || trimmedCode.startsWith('global ') || trimmedCode.startsWith('nonlocal ') || trimmedCode.startsWith('lambda ') || trimmedCode.startsWith('pass ') || trimmedCode.startsWith('del ') || trimmedCode.startsWith('yield ') || trimmedCode.startsWith('async ') || trimmedCode.startsWith('await ')){
                return 'python'
          }
          else if(trimmedCode.startsWith('function ') || trimmedCode.startsWith('const ') || trimmedCode.startsWith('let ') || trimmedCode.startsWith('var ') || trimmedCode.includes('=>') || trimmedCode.includes('function(')){
              return 'javascript';
          }
          return 'javascript';
    }

    function beautifyCode(code) {
        let lines = code.split('\n');
        let indentLevel = 0;
        let beautifiedLines = [];

        for (let line of lines) {
            line = line.trim();
            if (line.endsWith('{')) {
                beautifiedLines.push('  '.repeat(indentLevel) + line);
                indentLevel++;
            } else if (line.startsWith('}')) {
                indentLevel = Math.max(0, indentLevel - 1);
                beautifiedLines.push('  '.repeat(indentLevel) + line);
            } else {
                beautifiedLines.push('  '.repeat(indentLevel) + line);
            }
        }
        return beautifiedLines.join('\n');
    }

    function minifyCode(code) {
        return code.replace(/\s+/g, ' ').trim();
    }

     function beautifyHTML(code) {
        return code.replace(/></g, '>\n<').replace(/<(.*?)>/g, '<$1>\n').replace(/\n\s*\n/g, '\n').trim();
    }


    function minifyHTML(code) {
       return code.replace(/>\s+</g,'><').replace(/\s+/g, ' ').trim();
    }

     function beautifyCSS(code) {
       return code.replace(/\{/g, '{\n  ').replace(/\}/g, '\n}\n').replace(/;/g, ';\n  ').replace(/\n\s*\n/g, '\n').trim();
    }

    function minifyCSS(code) {
        return code.replace(/\s+/g, ' ').replace(/{\s+/g, '{').replace(/\s+}/g, '}').replace(/:\s+/g, ':').replace(/;\s+/g,';').trim();
    }
     function beautifyJSON(code) {
            try {
                const parsed = JSON.parse(code);
                return JSON.stringify(parsed, null, 2);
            } catch (e) {
                 return code;
            }
     }

    function minifyJSON(code) {
         return code.replace(/\s+/g, '').trim();
    }
  function beautifyPython(code) {
     return code.replace(/:\s*\n/g,':\n    ').replace(/(\n\s*)?(def|class|for|if|while|with|try|except|finally)\b/g, '\n$2')
            .replace(/\n\s*\n/g, '\n')
           .trim();
    }

  function minifyPython(code){
      return code.replace(/\s+/g, ' ').trim();
  }
    function copyCode(text) {
        navigator.clipboard.writeText(text)
            .then(() => {
                 showNotification('Code copied to clipboard!', 'success');
            })
            .catch(err => {
                 showNotification('Failed to copy code.', 'error');
                console.error('Failed to copy text: ', err);
            });
    }
    function downloadCode(code, filename) {
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.classList.add('notification', type);
        notification.textContent = message;
        notificationContainer.appendChild(notification);
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notificationContainer.removeChild(notification);
            }, 300);
        }, 2000);
    }
});