import { buildSandboxHtml } from '../lib/sandbox'
import { useState, useCallback, useRef, useEffect } from 'react'

export function useSandbox(code) {
  const iframeRef = useRef(null)
  const activeRunRef = useRef(null)
  const doneTimerRef = useRef(null)
  const hardTimerRef = useRef(null)
  const handleRunRef = useRef(null)

  const [output, setOutput] = useState([])
  const [running, setRunning] = useState(false)

  const markDone = useCallback((runId) => {
    if (activeRunRef.current !== runId) return
    activeRunRef.current = null
    clearTimeout(hardTimerRef.current)
    setRunning(false)
    setOutput(prev => prev.length ? prev : [{ type: 'muted', msg: '(no output)' }])
  }, [])

  useEffect(() => {
    const onMessage = (e) => {
      const data = e.data
      if (!data || typeof data !== 'object' || data.__runId !== activeRunRef.current) return
      const runId = data.__runId
      if (data.type === 'log' || data.type === 'err' || data.type === 'warn') {
        setOutput(prev => [...prev, { type: data.type, msg: data.msg }])
      }
      clearTimeout(doneTimerRef.current)
      doneTimerRef.current = setTimeout(() => markDone(runId), 600)
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [markDone])

  useEffect(() => () => {
    clearTimeout(doneTimerRef.current)
    clearTimeout(hardTimerRef.current)
  }, [])

  const handleRun = useCallback(() => {
    clearTimeout(doneTimerRef.current)
    clearTimeout(hardTimerRef.current)
    const runId = Date.now()
    activeRunRef.current = runId
    setOutput([])
    setRunning(true)
    iframeRef.current.srcdoc = buildSandboxHtml(code, runId)
    hardTimerRef.current = setTimeout(() => {
      if (activeRunRef.current !== runId) return
      activeRunRef.current = null
      setRunning(false)
      if (iframeRef.current) iframeRef.current.srcdoc = ''
      setOutput(prev => [...prev, { type: 'err', msg: 'Timed out after 10s — possible infinite loop' }])
    }, 10000)
  }, [code])

  useEffect(() => { handleRunRef.current = handleRun }, [handleRun])

  const reset = useCallback(() => {
    clearTimeout(doneTimerRef.current)
    clearTimeout(hardTimerRef.current)
    activeRunRef.current = null
    setOutput([])
    setRunning(false)
  }, [])

  return { iframeRef, output, running, handleRun, handleRunRef, reset }
}
