'use client';

import React, { useEffect, useState } from 'react';

interface Vehicle {
    id: number;
    lat: number;
    lng: number;
    status: 'ONLINE' | 'BUSY';
}

interface PredictionZone {
    id: string;
    name: string;
    count: number;
    level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    x: number; // For visualization on fake map
    y: number;
}

export default function FleetMap() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [predictions, setPredictions] = useState<PredictionZone[]>([
        { id: '1', name: 'Downtown Dubai', count: 85, level: 'CRITICAL', x: 200, y: 150 },
        { id: '2', name: 'Dubai Marina', count: 42, level: 'HIGH', x: 450, y: 300 },
        { id: '3', name: 'DXB Airport', count: 65, level: 'CRITICAL', x: 600, y: 100 },
        { id: '4', name: 'Business Bay', count: 18, level: 'MEDIUM', x: 300, y: 200 },
    ]);

    useEffect(() => {
        // Simulate real-time vehicle movement
        const initialVehicles: Vehicle[] = Array.from({ length: 40 }).map((_, i) => ({
            id: i,
            lat: Math.random() * 500,
            lng: Math.random() * 800,
            status: Math.random() > 0.3 ? 'ONLINE' : 'BUSY',
        }));
        setVehicles(initialVehicles);

        const interval = setInterval(() => {
            setVehicles(prev => prev.map(v => ({
                ...v,
                lat: v.lat + (Math.random() - 0.5) * 5,
                lng: v.lng + (Math.random() - 0.5) * 5,
            })));
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="map-container" style={{ position: 'relative', background: '#020617', overflow: 'hidden' }}>
            {/* Predictive Heatmap Overlays */}
            {predictions.map(zone => (
                <div
                    key={zone.id}
                    className={`prediction-pulse ${zone.level.toLowerCase()}`}
                    style={{
                        position: 'absolute',
                        left: zone.x,
                        top: zone.y,
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: zone.level === 'CRITICAL' ? 'rgba(239, 68, 68, 0.15)' :
                            zone.level === 'HIGH' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(59, 130, 246, 0.1)',
                        border: `1px dashed ${zone.level === 'CRITICAL' ? '#ef4444' : zone.level === 'HIGH' ? '#f59e0b' : '#3b82f6'}`,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1,
                    }}
                >
                    <span style={{ fontSize: '10px', fontWeight: 800, color: zone.level === 'CRITICAL' ? '#ef4444' : '#fff' }}>{zone.count} RIDES</span>
                    <span style={{ fontSize: '9px', opacity: 0.7 }}>{zone.name}</span>
                </div>
            ))}

            {/* Real-time Vehicle Markers */}
            {vehicles.map(v => (
                <div
                    key={v.id}
                    style={{
                        position: 'absolute',
                        left: v.lng,
                        top: v.lat,
                        width: '6px',
                        height: '6px',
                        backgroundColor: v.status === 'ONLINE' ? '#10b981' : '#3b82f6',
                        borderRadius: '50%',
                        boxShadow: `0 0 10px ${v.status === 'ONLINE' ? '#10b981' : '#3b82f6'}`,
                        transition: 'all 2s linear',
                        zIndex: 2,
                    }}
                />
            ))}

            <div className="live-indicator">
                <div className="live-dot"></div>
                AI PREDICTIVE FLEET MONITOR
            </div>

            <div style={{ position: 'absolute', bottom: 20, left: 20, display: 'flex', gap: '1.5rem', zIndex: 3, background: 'rgba(15, 23, 42, 0.8)', padding: '10px 20px', borderRadius: '12px', border: '1px solid #334155' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10b981' }}></div>
                    <span style={{ fontSize: '11px', fontWeight: 600 }}>Available</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#3b82f6' }}></div>
                    <span style={{ fontSize: '11px', fontWeight: 600 }}>On Trip</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: 12, height: 12, border: '1px dashed #ef4444', borderRadius: '50%' }}></div>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#ef4444' }}>High Demand Predictive</span>
                </div>
            </div>
        </div>
    );
}
