type QrScannerCardProps = {
  isScanning: boolean
  scanStatus: string
  onStartScan: () => void
}

function QrScannerCard({ isScanning, scanStatus, onStartScan }: QrScannerCardProps) {
  return (
    <article className="glass-card qr-card">
      <h3>Camera QR scan</h3>
      <p>Link new IoT nodes through QR camera.</p>
      <div className={`qr-frame ${isScanning ? 'scanning' : ''}`}>
        <span>{isScanning ? 'Scanning in progress...' : 'Camera preview area'}</span>
      </div>
      <button className="btn btn-primary" onClick={onStartScan} type="button">
        {isScanning ? 'Scanning...' : 'Start QR Scan'}
      </button>
      <p className="scan-status">{scanStatus}</p>
    </article>
  )
}

export default QrScannerCard
