import React from 'react';

type SecurityCameraCardProps = {
  imageUrl: string | null;         
  statusMessage: string;           
  isStranger: boolean;             
  onApprove: () => void;           
  onReject: () => void;            
  onAllow: () => void;             // THÊM MỚI: Hàm gọi API /allow
  onRequestTrigger: () => void;    
}

function SecurityCameraCard({ 
  imageUrl, 
  statusMessage, 
  isStranger, 
  onApprove, 
  onReject, 
  onAllow,                         // THÊM MỚI: Khai báo prop
  onRequestTrigger 
}: SecurityCameraCardProps) {
  return (
    <article className="glass-card camera-card" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      
      {/* Header: Tiêu đề và Nhãn trạng thái */}
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>🚨 Cảnh báo an ninh</h3>
        <span 
          style={{ 
            padding: '4px 8px', 
            borderRadius: '12px', 
            fontSize: '0.8rem', 
            fontWeight: 'bold',
            backgroundColor: isStranger ? '#ff4d4f' : '#52c41a',
            color: 'white'
          }}
        >
          {isStranger ? 'Cần phê duyệt' : 'An toàn'}
        </span>
      </div>
      <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Hệ thống nhận diện Edge AI Camera</p>

      {/* Khung hiển thị hình ảnh */}
      <div 
        className="camera-frame" 
        style={{ 
          backgroundColor: '#1a1a1a', 
          borderRadius: '8px', 
          overflow: 'hidden', 
          minHeight: '220px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)'
        }}
      >
        {imageUrl ? (
          <img src={imageUrl} alt="Security Snapshot" style={{ width: '100%', height: 'auto', display: 'block' }} />
        ) : (
          <span style={{ color: '#888', fontStyle: 'italic' }}>Chưa có hình ảnh nhận diện</span>
        )}
      </div>

      {/* Dòng trạng thái */}
      <p className="scan-status" style={{ fontWeight: '500', margin: 0, color: isStranger ? '#d9363e' : '#333' }}>
        {statusMessage}
      </p>

      {/* Các nút thao tác */}
      <div className="action-buttons" style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
        {isStranger ? (
          <>
            <button 
              className="btn" 
              onClick={onApprove} 
              style={{ flex: 1, backgroundColor: '#28a745', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}
            >
              ✓ Lưu & Mở
            </button>

            {/* THÊM MỚI: Nút Mở cửa tạm thời (Không lưu mặt) */}
            <button 
              className="btn" 
              onClick={onAllow} 
              style={{ flex: 1, backgroundColor: '#007bff', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}
            >
              Mở cửa tạm
            </button>

            <button 
              className="btn" 
              onClick={onReject} 
              style={{ flex: 1, backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}
            >
              ✗ Từ chối
            </button>
          </>
        ) : (
          <button 
            className="btn btn-primary" 
            onClick={onRequestTrigger} 
            style={{ width: '100%', padding: '10px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Kích hoạt Camera (Trigger)
          </button>
        )}
      </div>
    </article>
  );
}

export default SecurityCameraCard;