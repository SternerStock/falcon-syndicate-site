import ManaCheckbox from './ManaCheckbox'

const colors = ['W', 'U', 'B', 'R', 'G']

interface ColorSelectProps {
  selectedColors: string[]
  onChange: (newColors: string[]) => void
}

const ColorSelect: React.FC<ColorSelectProps> = ({
  selectedColors,
  onChange,
}) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      {colors.map((color) => (
        <ManaCheckbox
          key={color}
          symbol={color}
          selected={selectedColors.includes(color)}
          onChange={(checked) => {
            if (checked && !selectedColors.includes(color)) {
              onChange([...selectedColors, color])
            } else {
              onChange(selectedColors.filter((c) => c !== color))
            }
          }}
        />
      ))}
    </div>
  )
}

export default ColorSelect
