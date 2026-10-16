import { useState, useRef, useCallback } from 'react'
import './App.css'

const STEP = 90

export default function App() {
  const [image, setImage] = useState(null)
  const [rotation, setRotation] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const fileInputRef = useRef(null)
  const canvasRef = useRef(null)

  const loadFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      setImage(e.target.result)
      setRotation(0)
    }
    reader.readAsDataURL(file)
  }, [])

  const handleFileChange = (e) => {
    loadFile(e.target.files[0])
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    loadFile(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = () => setDragging(false)

  const rotateCW = () => setRotation((r) => (r + STEP) % 360)
  const rotateCCW = () => setRotation((r) => (r - STEP + 360) % 360)

  const handleReset = () => {
    setRotation(0)
    setImage(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDownload = () => {
    if (!image) return
    setDownloading(true)

    const img = new Image()
    img.onload = () => {
      const rad = (rotation * Math.PI) / 180
      const sin = Math.abs(Math.sin(rad))
      const cos = Math.abs(Math.cos(rad))

      const w = img.width * cos + img.height * sin
      const h = img.width * sin + img.height * cos

      const canvas = canvasRef.current
      canvas.width = w
      canvas.height = h

      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, w, h)
      ctx.translate(w / 2, h / 2)
      ctx.rotate(rad)
      ctx.drawImage(img, -img.width / 2, -img.height / 2)

      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'rotated-image.png'
        a.click()
        URL.revokeObjectURL(url)
        setDownloading(false)
      }, 'image/png')
    }
    img.src = image
  }

  const degLabel = `${rotation}°`

  return (
    <div className="app">
      <header className="app-header">
        <h1>image rotator</h1>
        <p className="subtitle">drop an image or click to upload</p>
      </header>

      <main className="main-content">
        {/* upload zone */}
        <div
          className={`drop-zone ${dragging ? 'drag-over' : ''} ${image ? 'has-image' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !image && fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Upload image by clicking or dropping a file"
          onKeyDown={(e) => e.key === 'Enter' && !image && fileInputRef.current?.click()}
        >
          {image ? (
            <div className="preview-wrapper">
              <img
                src={image}
                alt="Uploaded preview"
                className="preview-img"
                style={{ rotate: `${rotation}deg` }}
                draggable={false}
              />
            </div>
          ) : (
            <div className="empty-state">
              <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <span>drop your image here</span>
              <span className="hint">or click to browse</span>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden-input"
          aria-label="Choose image file"
        />

        {/* controls */}
        <div className="controls" aria-label="Rotation controls">
          <button
            className="btn btn-rotate"
            onClick={rotateCCW}
            disabled={!image}
            title="Rotate 90° counter-clockwise"
            aria-label="Rotate counter-clockwise"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
            </svg>
            <span>CCW</span>
          </button>

          <div className="degree-badge" aria-live="polite" aria-label={`Current rotation: ${degLabel}`}>
            {degLabel}
          </div>

          <button
            className="btn btn-rotate"
            onClick={rotateCW}
            disabled={!image}
            title="Rotate 90° clockwise"
            aria-label="Rotate clockwise"
          >
            <span>CW</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" />
            </svg>
          </button>
        </div>

        {image && (
          <div className="action-row">
            <button className="btn btn-secondary" onClick={handleReset}>
              clear
            </button>
            <button
              className="btn btn-primary"
              onClick={handleDownload}
              disabled={downloading}
            >
              {downloading ? 'saving…' : 'download'}
            </button>
          </div>
        )}
      </main>

      {/* hidden canvas used only for rendering the export */}
      <canvas ref={canvasRef} style={{ display: 'none' }} aria-hidden="true" />
    </div>
  )
}
