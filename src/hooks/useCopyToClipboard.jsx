import { useState } from 'react'

function useCopyToClipboard(beforeCopyText, afterCopyText){
  const [copiedText, setCopiedText] = useState(null);
  const [tooltipText, setTooltipText] = useState(beforeCopyText ?? "Copy");

  const copy = async text => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported')
      return false;
    }

    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(text)
      setTooltipText(afterCopyText ?? "Copied!")
      setTimeout(()=>{
        setTooltipText(beforeCopyText ?? "Copy")
      },5000)
      return true;
    } catch (error) {
      console.warn('Copy failed', error)
      setCopiedText(null)
      setTooltipText(beforeCopyText ?? "Copy")
      return false;
    }
  }

  return {copiedText, copy, tooltipText}
}

export default useCopyToClipboard
