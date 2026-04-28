import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const vehicles = [
  { id: 'Pet', name: 'Pet', price: 'COP 18.888', time: '12 min', pax: 4, folder: 'PET', prefix: 'Perro' },
  { id: 'Classic', name: 'Classic', price: 'COP 15.000', time: '5 min', pax: 4, folder: 'Classic', prefix: 'Vocho' },
  { id: 'Moto', name: 'Moto', price: 'COP 8.500', time: '3 min', pax: 1, folder: 'Moto', prefix: 'Moto' },
  { id: 'XL', name: 'XL', price: 'COP 25.000', time: '10 min', pax: 6, folder: 'XL', prefix: 'Monster' },
  { id: 'Planet', name: 'Planet', price: 'COP 17.000', time: '8 min', pax: 4, folder: 'Planet', prefix: 'Mata' }
];

export default function VehicleSelection() {
  const [selectedCategory, setSelectedCategory] = useState('Planet');
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const selectedVehicle = vehicles.find(v => v.id === selectedCategory);

  // 1. Pre-load ONLY the selected vehicle's images and wait for them to finish
  useEffect(() => {
    let isMounted = true;
    setIsLoaded(false);
    setCurrentFrame(0);

    const loadImages = async () => {
      const promises = [];
      for (let i = 0; i <= 28; i++) {
        const numStr = i.toString().padStart(2, '0');
        const src = `/images/${selectedVehicle.folder}/${selectedVehicle.prefix}${numStr}.jpg`;
        promises.push(new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = resolve; // Resolve anyway to not block the UI if an image fails
        }));
      }
      
      await Promise.all(promises);
      if (isMounted) {
        setIsLoaded(true);
      }
    };

    loadImages();

    return () => {
      isMounted = false;
    };
  }, [selectedCategory, selectedVehicle]);

  // 2. Play the flipbook animation ONLY after images are fully loaded
  useEffect(() => {
    if (!isLoaded) return; // Do not start animation if images are still downloading

    let frame = 0;
    const totalDurationMs = 1300;
    const intervalTime = totalDurationMs / 28; 

    const intervalId = setInterval(() => {
      frame += 1;
      if (frame <= 28) {
        setCurrentFrame(frame);
      } else {
        clearInterval(intervalId);
      }
    }, intervalTime);

    return () => clearInterval(intervalId);
  }, [isLoaded, selectedCategory]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300 font-sans text-gray-900">
      
      {/* Mobile Device Simulation Container */}
      <div className="w-full max-w-md h-[100dvh] sm:h-[850px] bg-white sm:rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col">
        
        {/* Map Background */}
        <div className="absolute inset-0 z-0 bg-[url('/images/map-bg.png')] bg-cover bg-center">
            
            {/* Back Button */}
            <button className="absolute top-12 left-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors z-10">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
            </button>

            {/* Route Tooltip */}
            <div className="absolute top-40 left-10 bg-white rounded shadow-lg flex items-stretch overflow-hidden z-10">
                <div className="bg-black text-white px-3 py-2 flex flex-col items-center justify-center">
                    <span className="font-bold text-lg leading-none">9</span>
                    <span className="text-[10px] font-medium tracking-wide">MIN</span>
                </div>
                <div className="px-4 py-3 font-medium text-sm flex items-center">
                    Main Rd, Aryarup Complex
                </div>
            </div>

            {/* Target Location Button */}
            <button className="absolute bottom-[520px] right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors z-10">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <circle cx="12" cy="12" r="3"></circle>
                    <line x1="12" y1="2" x2="12" y2="4"></line>
                    <line x1="12" y1="20" x2="12" y2="22"></line>
                    <line x1="2" y1="12" x2="4" y2="12"></line>
                    <line x1="20" y1="12" x2="22" y2="12"></line>
                </svg>
            </button>
            
        </div>

        {/* Bottom Sheet Card */}
        <div className="absolute bottom-0 w-full bg-white rounded-t-[32px] shadow-[0_-8px_30px_rgba(0,0,0,0.12)] z-20 flex flex-col">
            
            {/* Grabber indicator */}
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-4 mb-2"></div>

            <div className="p-6 pb-8">
                
                {/* Top Info (Time & Price) */}
                <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-700">{selectedVehicle.time}</span>
                    <span className="font-bold text-2xl">{selectedVehicle.price}</span>
                </div>

                {/* Prominent Image Sequence */}
                <div className="flex justify-center items-center h-60 w-full mb-4">
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={selectedVehicle.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ 
                                type: "spring", 
                                stiffness: 600, 
                                damping: 25,
                                mass: 0.5
                            }}
                            className="relative h-full w-full flex items-center justify-center" 
                        >
                            {/* Render all 29 frames in DOM to prevent decoding lag, toggling opacity */}
                            {Array.from({ length: 29 }).map((_, i) => {
                                const numStr = i.toString().padStart(2, '0');
                                const src = `/images/${selectedVehicle.folder}/${selectedVehicle.prefix}${numStr}.jpg`;
                                return (
                                    <img 
                                        key={i}
                                        src={src}
                                        alt={`${selectedVehicle.name} frame ${i}`}
                                        className={`absolute inset-0 h-full w-full object-contain ${i === currentFrame ? 'opacity-100' : 'opacity-0'}`}
                                    />
                                );
                            })}
                            
                            {/* Loading Indicator */}
                            {!isLoaded && (
                                <div className="absolute bottom-0 right-0 bg-white/80 px-2 py-1 rounded text-xs text-gray-500 animate-pulse font-medium">
                                    Cargando...
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Title & Pax */}
                <div className="flex justify-between items-center mb-6 px-1">
                    <h2 className="text-2xl font-bold">{selectedVehicle.name}</h2>
                    <div className="flex items-center gap-1.5 text-gray-800 font-semibold bg-gray-100 px-3 py-1.5 rounded-lg">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                    {selectedVehicle.pax}
                    </div>
                </div>

                {/* Segmented Control / Toggle Tabs */}
                <div className="w-full bg-gray-200 rounded-full p-1.5 flex mb-6 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {vehicles.map((v) => {
                        const isActive = selectedCategory === v.id;
                        return (
                            <button
                                key={v.id}
                                onClick={() => setSelectedCategory(v.id)}
                                className={`flex-1 py-3 px-4 rounded-full text-sm font-semibold transition-colors duration-300 whitespace-nowrap ${
                                    isActive 
                                    ? 'bg-black text-white shadow-md' 
                                    : 'text-gray-500 hover:text-gray-900 bg-transparent hover:bg-gray-300/50'
                                }`}
                            >
                                {v.name}
                            </button>
                        );
                    })}
                </div>

                {/* Confirm Button */}
                <button className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-wider text-lg hover:bg-gray-800 transition-colors">
                    Confirm {selectedVehicle.name}
                </button>
            </div>
            
            {/* Home Indicator (iOS simulation) */}
            <div className="w-32 h-1.5 bg-gray-900 rounded-full mx-auto mb-2"></div>
        </div>

      </div>
    </div>
  );
}
