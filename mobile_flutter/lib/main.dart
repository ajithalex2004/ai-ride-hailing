import 'package:flutter/material.dart';

void main() {
  runApp(const EmergencyOSApp());
}

class EmergencyOSApp extends StatelessWidget {
  const EmergencyOSApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AI Mobility OS',
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF08080A),
        primaryColor: const Color(0xFF00F3FF), // Neon Blue
        fontFamily: 'Inter',
      ),
      home: const DashboardScreen(),
    );
  }
}

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('MISSION_CONTROL', style: TextStyle(color: Color(0xFF00F3FF), fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 2)),
                      SizedBox(height: 4),
                      Text('WELCOME_BACK, AGENT', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, italic: true)),
                    ],
                  ),
                  CircleAvatar(backgroundColor: Colors.white12, child: Icon(Icons.shield_outlined, color: Colors.white)),
                ],
              ),
              const SizedBox(height: 40),
              Container(
                height: 200,
                width: double.infinity,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: Colors.white12),
                  gradient: const LinearGradient(colors: [Color(0xFF00F3FF), Color(0xFF0066FF)], begin: Alignment.topLeft, end: Alignment.bottomRight),
                ),
                child: const Stack(
                  children: [
                    Positioned(bottom: 24, left: 24, child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Text('SYSTEM_STATUS: NOMINAL', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
                      SizedBox(height: 8),
                      Text('LIVE_RADAR_ACTIVE', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900)),
                    ])),
                  ],
                ),
              ),
              const SizedBox(height: 32),
              const Text('RAPID_RESPONSE_ACTIONS', style: TextStyle(color: Colors.white38, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1.5)),
              const SizedBox(height: 16),
              Expanded(
                child: GridView.count(
                  crossAxisCount: 2,
                  mainAxisSpacing: 16,
                  crossAxisSpacing: 16,
                  children: [
                    _buildActionCard('AMBULANCE', Icons.emergency, Colors.redAccent),
                    _buildActionCard('POLICE', Icons.local_police, Colors.blueAccent),
                    _buildActionCard('TOW_TRUCK', Icons.car_repair, Colors.orangeAccent),
                    _buildActionCard('TRAFFIC', Icons.traffic, Colors.greenAccent),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildActionCard(String label, IconData icon, Color color) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF131316),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withOpacity(0.05)),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, color: color, size: 32),
          const SizedBox(height: 12),
          Text(label, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1)),
        ],
      ),
    );
  }
}
