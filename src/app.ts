import TurndownService from 'turndown'

const app = () => {
  console.log('monkey jumping on the bed.')

  function initTurndown() {
    const turndownService = new TurndownService()

    turndownService.addRule('button', {
      filter: 'button',
      replacement: function () {
        return ''
      },
    })

    turndownService.addRule('img', {
      filter: 'img',
      replacement: function () {
        return ''
      },
    })

    function checkPreviousSiblingClasses(element: HTMLElement, classes: string[]): boolean {
      const previousElement = element.previousElementSibling as HTMLElement
      if (previousElement && previousElement.tagName === 'DIV') {
        return classes.every((className) => previousElement.classList.contains(className))
      }
      return false
    }

    function checkSelfClasses(element: HTMLElement, classes: string[]): boolean {
      if (element && element.tagName === 'DIV') {
        return classes.every((className) => element.classList.contains(className))
      }
      return false
    }

    turndownService.addRule('myquestiondiv', {
      filter: 'div',
      replacement: function (content, node) {
        const isMyQuestion = checkPreviousSiblingClasses(node as HTMLElement, [
          'mt-5',
          'h-3',
          'w-3',
          'flex-none',
          'rounded-full',
        ])
        const isNoNeedHead = checkSelfClasses(node as HTMLElement, ['text-sm', 'font-light', 'text-gray-500', 'pb-1'])
        if (isMyQuestion) {
          return '### ' + content
        } else if (isNoNeedHead) {
          // console.log('isNoNeedHead', node, content)
          return ''
        } else {
          // console.log('else', node, content)
          return content
        }
      },
    })
    turndownService.addRule('noneeda', {
      filter: 'a',
      replacement: function (content, node) {
        //a starts with '/conversation/' then return ''
        const href = (node as HTMLElement).getAttribute('href')
        if (href && href.startsWith('/conversation/')) {
          return ''
        } else {
          return content
        }
      },
    })

    turndownService.addRule('pre', {
      filter: 'pre',
      replacement: function (content, node) {
        let language = ''
        if (node instanceof HTMLElement) {
          const childCodeNode = node.querySelector('code')
          if (childCodeNode) {
            const classAttr = childCodeNode.getAttribute('class')
            if (classAttr && classAttr.startsWith('language-')) {
              language = classAttr.replace('language-', '')
            }
          }
        }
        return '\n```' + language + '\n' + content + '\n```\n'
      },
    })
    return turndownService
  }

  const turndownService = initTurndown()
  // create a function which names html
  const createCopyButton = () => {
    // create a button
    const copyButton = document.createElement('button')
    // set the button text
    copyButton.innerText = 'Copy'
    // set the button id
    copyButton.id = 'copy-button'

    // add CSS styling to the button
    copyButton.style.position = 'fixed'
    copyButton.style.bottom = '20px'
    copyButton.style.right = '20px'
    copyButton.style.padding = '10px'
    copyButton.style.backgroundColor = '#4CAF50'
    copyButton.style.color = 'white'
    copyButton.style.border = 'none'
    copyButton.style.borderRadius = '5px'
    copyButton.style.cursor = 'pointer'
    copyButton.style.boxShadow = '0 4px 8px 0 rgba(0, 0, 0, 0.2)'
    copyButton.style.transition = '0.3s'
    copyButton.addEventListener('mouseover', () => {
      copyButton.style.backgroundColor = '#45a049'
    })
    copyButton.addEventListener('mouseout', () => {
      copyButton.style.backgroundColor = '#4CAF50'
    })
    copyButton.addEventListener('click', async () => {
      // find the element which has this classes : scrollbar-custom mr-1 h-full overflow-y-auto
      const exportTargetElement = document.querySelector('.scrollbar-custom.mr-1.h-full.overflow-y-auto')
      if (!exportTargetElement) {
        return
      }
      const mdtext = turndownService.turndown(exportTargetElement.innerHTML)
      // read mdtext to clipboard
      await navigator.clipboard.writeText(mdtext)

      // async function getClipboardData() {
      //   try {
      //     const clipboardItems = await navigator.clipboard.read()

      //     for (let i = 0; i < clipboardItems.length; i++) {
      //       if (clipboardItems[i].types.includes('text/html')) {
      //         const blob = await clipboardItems[i].getType('text/html')
      //         const text = await new Response(blob).text()
      //         const mdtext = turndownService.turndown(text)
      //         // console.log('The HTML content from the clipboard is:\n', text)
      //       }
      //     }
      //   } catch (err) {
      //     console.error('Failed to read clipboard contents: ', err)
      //   }
      // }

      // getClipboardData()
    })

    // return the button
    return copyButton
  }
  // 创建copy按钮
  const copyButton = createCopyButton()
  // 添加到文档中
  document.body.appendChild(copyButton)
}

export default app
