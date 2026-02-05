import React, { useRef, useState, useEffect } from 'react';
import { StageItem } from '../types';
import { Monitor, Plug, Move, Mic, Guitar, Speaker, Music, Drum, Disc, Laptop, User } from 'lucide-react';

interface StagePlotCanvasProps {
  items: StageItem[];
  setItems: (items: StageItem[]) => void;
  editable: boolean;
}

const IconMap: Record<string, any> = {
  Mic, Guitar, Speaker, Music, Drum, Disc, Laptop, User, Monitor, Plug
};

// Helper to get icon component
const getIcon = (label: string, type: string) => {
    if (type === 'person') return User;
    if (type === 'monitor') return Monitor;
    if (type === 'power') return Plug;
    
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes('drum')) return Drum;
    if (lowerLabel.includes('vocal') || lowerLabel.includes('mic')) return Mic;
    if (lowerLabel.includes('guitar')) return Guitar;
    if (lowerLabel.includes('bass')) return Speaker;
    if (lowerLabel.includes('keys')) return Music;
    if (lowerLabel.includes('sax') || lowerLabel.includes('trumpet')) return Music;
    
    return Music; // Default instrument icon
};

export const StagePlotCanvas: React.FC<StagePlotCanvasProps> = ({ items, setItems, editable }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    if (!editable) return;
    e.preventDefault();
    e.stopPropagation();
    setDraggingId(id);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingId || !containerRef.current || !editable) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Constrain to 0-100
    const constrainedX = Math.max(0, Math.min(100, x));
    const constrainedY = Math.max(0, Math.min(100, y));

    setItems(items.map(item => 
      item.id === draggingId ? { ...item, x: constrainedX, y: constrainedY } : item
    ));
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };

  // Global mouse up handler to catch releases outside the div
  useEffect(() => {
    if (draggingId) {
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingId]);

  return (
    <div 
      className="relative w-full aspect-[4/3] bg-white border-2 border-slate-300 rounded-lg overflow-hidden shadow-inner print:border-black print:shadow-none"
      ref={containerRef}
      onMouseMove={handleMouseMove}
    >
      {/* Stage Floor Background */}
      <div className="absolute inset-4 border-2 border-dashed border-slate-200 pointer-events-none print:border-slate-400">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-slate-100 px-2 text-xs text-slate-400 font-mono print:text-black">BACK OF STAGE</div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-slate-100 px-2 text-xs text-slate-400 font-mono print:text-black">FRONT OF STAGE (AUDIENCE)</div>
      </div>

      {items.map((item) => {
        const IconComponent = getIcon(item.label, item.type);
        const isPerson = item.type === 'person';
        
        return (
          <div
            key={item.id}
            style={{ 
              left: `${item.x}%`, 
              top: `${item.y}%`,
              transform: 'translate(-50%, -50%)',
              cursor: editable ? (draggingId === item.id ? 'grabbing' : 'grab') : 'default',
              zIndex: draggingId === item.id ? 100 : (isPerson ? 50 : 10)
            }}
            className={`absolute flex flex-col items-center group`}
            onMouseDown={(e) => handleMouseDown(e, item.id)}
          >
            <div className={`
              flex items-center justify-center
              ${isPerson 
                ? 'w-10 h-10 bg-indigo-100 border-2 border-indigo-600 rounded-full text-indigo-800' 
                : (item.type === 'monitor' 
                    ? 'p-2 bg-slate-200 border-2 border-slate-500 rounded-none transform -skew-x-12' 
                    : 'p-2 bg-white border-2 border-black rounded-lg')
              }
              ${editable ? 'hover:border-blue-500 hover:shadow-md' : ''}
              print:bg-white print:border-black print:text-black
            `}>
              <IconComponent size={isPerson ? 20 : 24} className={isPerson ? "" : "text-slate-900"} />
            </div>
            
            <span className={`
              mt-1 text-[10px] font-bold px-1 rounded whitespace-nowrap border border-transparent 
              ${isPerson ? 'bg-indigo-50 text-indigo-900' : 'bg-white/80'}
              group-hover:border-slate-200 
              print:text-black print:bg-white print:border-0
            `}>
              {item.label}
            </span>
            
            {editable && (
               <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-0.5 shadow border border-slate-200">
                 <Move size={10} className="text-blue-500" />
               </div>
            )}
          </div>
        );
      })}
    </div>
  );
};