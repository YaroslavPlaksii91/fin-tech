const CroppedText: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span
    style={{
      overflow: 'hidden',
      display: 'block',
      textOverflow: 'ellipsis'
    }}
  >
    {children}
  </span>
);

export default CroppedText;
