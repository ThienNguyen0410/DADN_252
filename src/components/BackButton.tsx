import { useNavigate } from 'react-router-dom'

function BackButton() {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate('/')}
      style={{
        padding: '8px 16px',
        marginBottom: '20px',
        backgroundColor: '#666',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'background-color 0.3s ease'
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#555')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#666')}
    >
      ← Quay lại
    </button>
  )
}

export default BackButton
