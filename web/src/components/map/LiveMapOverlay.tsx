"use client";

import React, { useState, useEffect } from 'react';

interface Asset {
    id: string;
    type: 'TAXI' | 'LIMO' | 'AMBULANCE';
    x: number;
    y: number;
    status: string;
}

export default function LiveMapOverlay() {
    const [assets, setAssets] = useState<Asset[]>([
        { id: 'TX-1', type: 'TAXI', x: 20, y: 30, status: 'AVAILABLE' },
        { id: 'LM-5', type: 'LIMO', x: 70, y: 15, status: 'VIP_TRIP' },
        { id: 'AMB-2', type: 'AMBULANCE', x: 45, y: 50, status: 'P1_MISSION' },
        { id: 'TX-2', type: 'TAXI', x: 35, y: 80, status: 'ON_TRIP' },
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            setAssets(prev => prev.map(a => ({
                ...a,
                x: a.x + (Math.random() - 0.5) * 2,
                y: a.y + (Math.random() - 0.5) * 2,
            })));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {assets.map(asset => (
                <div
                    key={asset.id}
                    className="absolute transition-all duration-1000 ease-linear"
                    style={{ left: `${asset.x}%`, top: `${asset.y}%` }}
                >
                    <div className={`relative group`}>
                        {/* Pulsing Aura for Emergency */}
                        {asset.type === 'AMBULANCE' && (
                            <div className="absolute inset-0 w-8 h-8 -top-3 -left-3 bg-pulse-orange/20 rounded-full animate-ping"></div>
                        )}

                        {/* Asset Icon */}
                        <div className={`w-3 h-3 rounded-full border border-white/40 shadow-lg ${asset.type === 'AMBULANCE' ? 'bg-pulse-orange scale-125' :
                                asset.type === 'LIMO' ? 'bg-purple-500' : 'bg-neon-blue'
                            }`}></div>

                        {/* Tooltip on Hover (Simulated) */}
                        <div className="absolute top-4 left-0 bg-black/80 backdrop-blur-md px-2 py-1 rounded border border-white/10 text-[8px] font-mono text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                            {asset.id} // {asset.status}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
