import { useState } from 'react'
import Collapsible from 'react-collapsible'
import { FaMinus, FaPlus } from 'react-icons/fa6'

interface CollapsibleSectionProps {
  title: string
  defaultOpen?: boolean;
  children?: React.ReactNode
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, defaultOpen, children }) => {
  const [expanded, setExpanded] = useState(defaultOpen || false)

  return (
    <Collapsible
      trigger={
        <div className="collapsible-header">
          <h2>{title}</h2>
          {expanded ?
            <FaMinus size="2em" />
          : <FaPlus size="2em" />}
        </div>
      }
      overflowWhenOpen="visible"
      onOpen={() => setExpanded(true)}
      onClose={() => setExpanded(false)}
      easing="ease-in-out"
    >
      <div className="collapsible-body">{children}</div>
    </Collapsible>
  )
}

export default CollapsibleSection