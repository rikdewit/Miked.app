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
    // Simple heuristic for icons based on label content or type if specific mapping is missing
    if (type === 'monitor') return Monitor;
    if (type === 'power') return Plug;
    if (label.toLowerCase().includes('drum')) return Drum;
    if (label.toLowerCase().includes('vocal') || label.toLowerCase().includes('mic')) return Mic;
    if (label.toLowerCase().includes('guitar')) return Guitar;
    if (label.toLowerCase().includes('bass')) return Speaker;
    if (label.toLowerCase().includes('keys')) return Music;
    
    return User;
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
        
        return (
          <div
            key={item.id}
            style={{ 
              left: `${item.x}%`, 
              top: `${item.y}%`,
              transform: 'translate(-50%, -50%)',
              cursor: editable ? (draggingId === item.id ? 'grabbing' : 'grab') : 'default'
            }}
            className={`absolute flex flex-col items-center group ${draggingId === item.id ? 'z-50' : 'z-10'}`}
            onMouseDown={(e) => handleMouseDown(e, item.id)}
          >
            <div className={`
              p-2 rounded-full border-2 
              ${item.type === 'monitor' ? 'bg-slate-200 border-slate-500 rounded-none transform -skew-x-12' : 'bg-white border-black'}
              ${editable ? 'hover:border-blue-500 shadow-sm' : ''}
              print:border-black print:bg-white
            `}>
              <IconComponent size={24} className="text-slate-900" />
            </div>
            <span className="mt-1 text-[10px] font-bold bg-white/80 px-1 rounded whitespace-nowrap border border-transparent group-hover:border-slate-200 print:text-black print:bg-white">
              {item.label}
            </span>
            {editable && (
               <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                 <Move size={12} className="text-blue-500" />
               </div>
            )}
          </div>
        );
      })}
    </div>
  );
};