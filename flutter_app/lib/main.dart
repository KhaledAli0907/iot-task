import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_app/models/reading_model.dart';
import 'package:flutter_app/services/api_service.dart';
import 'package:flutter_app/widgets/reading_card.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await dotenv.load(fileName: ".env");

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'IoT Readings',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.teal),
        useMaterial3: true,
      ),
      home: const HomePage(),
    );
  }
}

class HomePage extends StatefulWidget {
  const HomePage({super.key});
  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final ApiService _api = ApiService();
  ReadingModel? _latestReading;
  String? _error;
  bool _isLoading = false;
  Timer? _pollingTimer;
  final Duration _pollingInterval = const Duration(seconds: 10);

  @override
  void initState() {
    super.initState();
    _fetchLatestReading();
    _startPolling();
  }

  void _startPolling() {
    _pollingTimer = Timer.periodic(
      _pollingInterval,
      (_) => _fetchLatestReading(),
    );
  }

  Future<void> _fetchLatestReading() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final reading = await _api.fetchLatestReading();
      setState(() {
        _latestReading = reading;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  void dispose() {
    _pollingTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Latest Reading')),
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (_isLoading) const CircularProgressIndicator(),
            if (_error != null) ...[
              Padding(
                padding: const EdgeInsets.all(12),
                child: Text(
                  'Error: $_error',
                  style: const TextStyle(color: Colors.red),
                ),
              ),
              ElevatedButton(
                onPressed: _fetchLatestReading,
                child: const Text('Retry'),
              ),
            ],
            if (_latestReading != null) ReadingCard(reading: _latestReading!),
            const SizedBox(height: 12),
            ElevatedButton.icon(
              onPressed: _fetchLatestReading,
              icon: const Icon(Icons.refresh),
              label: const Text('Refresh now'),
            ),
          ],
        ),
      ),
    );
  }
}
